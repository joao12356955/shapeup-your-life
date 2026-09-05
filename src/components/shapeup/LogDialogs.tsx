import { useState } from "react";
import { Droplet, Minus, Plus, Scale, Trash2, UtensilsCrossed, Check, X } from "lucide-react";
import { useCurrentUser } from "@/lib/user-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BOTTLE_ML,
  MEAL_OPTIONS,
  MEAL_SLOTS,
  WATER_GOAL_BOTTLES,
  WATER_GOAL_ML,
  type DayLog,
  type MealEntry,
  type MealSlot,
} from "@/lib/daily-store";

type BaseProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  day: DayLog;
  onSave: (patch: Partial<DayLog>) => void;
};

const btn =
  "rounded-lg bg-gradient-primary py-2.5 px-4 text-sm font-semibold shadow-glow hover:opacity-90 transition";

export function WaterDialog({ open, onOpenChange, day, onSave }: BaseProps) {
  const [bottles, setBottles] = useState(Math.round(day.waterMl / BOTTLE_ML));

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setBottles(Math.round(day.waterMl / BOTTLE_ML));
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplet size={18} className="text-primary-glow" /> Registrar água
          </DialogTitle>
          <DialogDescription>
            Meta: {WATER_GOAL_ML / 1000} litros ({WATER_GOAL_BOTTLES} garrafas de {BOTTLE_ML} ml).
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-4 py-2">
          <button
            aria-label="Remover garrafa"
            onClick={() => setBottles((b) => Math.max(0, b - 1))}
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10"
          >
            <Minus size={16} />
          </button>
          <div className="text-center">
            <div className="text-3xl font-bold">{((bottles * BOTTLE_ML) / 1000).toFixed(1)} L</div>
            <div className="text-xs text-muted-foreground">{bottles} garrafas</div>
          </div>
          <button
            aria-label="Adicionar garrafa"
            onClick={() => setBottles((b) => Math.min(12, b + 1))}
            className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: WATER_GOAL_BOTTLES }).map((_, i) => (
            <button
              key={i}
              aria-label={`Definir ${i + 1} garrafas`}
              onClick={() => setBottles(i + 1)}
              className={`h-10 w-7 rounded-md transition ${
                i < bottles
                  ? "bg-gradient-primary shadow-glow"
                  : "border border-dashed border-primary/50"
              }`}
            />
          ))}
        </div>

        <DialogFooter>
          <button
            className={`w-full ${btn}`}
            onClick={() => {
              onSave({ waterMl: bottles * BOTTLE_ML });
              onOpenChange(false);
            }}
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const emptyForm = { name: "", kcal: "", carbs: "", protein: "", fat: "" };

export function MealDialog({ open, onOpenChange, day, onSave }: BaseProps) {
  const { user } = useCurrentUser();
  const { addFood, removeFood, optionsFor, isCustom } = useCustomFoods(user?.email);
  const [selected, setSelected] = useState<MealEntry[]>(day.meals);
  const [formSlot, setFormSlot] = useState<MealSlot | null>(null);
  const [form, setForm] = useState(emptyForm);

  const toggle = (slot: MealSlot, name: string) => {
    const id = `${slot}::${name}`;
    setSelected((prev) => {
      if (prev.some((m) => m.id === id)) return prev.filter((m) => m.id !== id);
      const opt = optionsFor(slot).find((o) => o.name === name)!;
      return [...prev, { id, slot, ...opt }];
    });
  };

  const submitFood = (slot: MealSlot) => {
    const name = form.name.trim();
    const num = (v: string) => Math.max(0, Math.round(Number(v.replace(",", ".")) || 0));
    if (!name) return;
    addFood(slot, {
      name,
      kcal: num(form.kcal),
      carbs: num(form.carbs),
      protein: num(form.protein),
      fat: num(form.fat),
    });
    setForm(emptyForm);
    setFormSlot(null);
  };


  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setSelected(day.meals);
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-2xl bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-primary-glow" /> Registrar alimentação
          </DialogTitle>
          <DialogDescription>
            Selecione as refeições que você já fez hoje. Os macros são atualizados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {MEAL_SLOTS.map((slot) => (
            <div key={slot}>
              <div className="text-xs font-semibold text-muted-foreground mb-2">{slot}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MEAL_OPTIONS[slot].map((o) => {
                  const active = selected.some((m) => m.id === `${slot}::${o.name}`);
                  return (
                    <button
                      key={o.name}
                      onClick={() => toggle(slot, o.name)}
                      className={`text-left flex items-start gap-2 rounded-xl border p-3 transition ${
                        active
                          ? "border-primary bg-primary/15"
                          : "border-border bg-secondary/40 hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 ${
                          active ? "bg-gradient-primary" : "border border-border"
                        }`}
                      >
                        {active && <Check size={12} />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{o.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {o.kcal} kcal • C {o.carbs}g • P {o.protein}g • G {o.fat}g
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="items-center sm:justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {selected.length} refeições • {selected.reduce((a, m) => a + m.kcal, 0)} kcal
          </span>
          <button
            className={btn}
            onClick={() => {
              onSave({ meals: selected });
              onOpenChange(false);
            }}
          >
            Salvar refeições
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WeightDialog({ open, onOpenChange, day, onSave }: BaseProps) {
  const [value, setValue] = useState(day.weightKg ? String(day.weightKg) : "");

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) setValue(day.weightKg ? String(day.weightKg) : "");
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-sm bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale size={18} className="text-primary-glow" /> Registrar peso de hoje
          </DialogTitle>
          <DialogDescription>Informe seu peso em kg.</DialogDescription>
        </DialogHeader>
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="78.4"
          className="w-full rounded-lg bg-secondary/50 border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <DialogFooter>
          <button
            className={`w-full ${btn}`}
            onClick={() => {
              const n = parseFloat(value.replace(",", "."));
              if (!isNaN(n) && n > 0) onSave({ weightKg: n });
              onOpenChange(false);
            }}
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
