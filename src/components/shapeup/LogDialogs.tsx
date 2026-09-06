import { useState } from "react";
import { Droplet, Minus, Pencil, Plus, Scale, Search, Trash2, UtensilsCrossed, Check, X } from "lucide-react";
import { useCurrentUser } from "@/lib/user-store";
import { FOOD_BASE, FOOD_CATEGORIES } from "@/lib/food-base";

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
  MEAL_SLOTS,
  useCustomFoods,
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
  const user = useCurrentUser();
  const { addFood, updateFood, removeFood, optionsFor, isCustom } = useCustomFoods(user?.email);
  const [selected, setSelected] = useState<MealEntry[]>(day.meals);
  const [formSlot, setFormSlot] = useState<MealSlot | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [cat, setCat] = useState(FOOD_CATEGORIES[0]);
  const [query, setQuery] = useState("");

  const results = FOOD_BASE.filter((f) => {
    const q = query.trim().toLowerCase();
    if (q) return f.name.toLowerCase().includes(q);
    return f.cat === cat;
  }).slice(0, 40);

  const openForm = (slot: MealSlot) => {
    setForm(emptyForm);
    setEditing(null);
    setQuery("");
    setFormSlot(formSlot === slot && !editing ? null : slot);
  };

  const startEdit = (slot: MealSlot, o: ReturnType<typeof optionsFor>[number]) => {
    setFormSlot(slot);
    setEditing(o.name);
    setQuery("");
    setForm({
      name: o.name,
      kcal: String(o.kcal),
      carbs: String(o.carbs),
      protein: String(o.protein),
      fat: String(o.fat),
    });
  };

  const addBaseFood = (f: (typeof FOOD_BASE)[number]) => {
    const num = (v: string) => Number(v.replace(",", ".")) || 0;
    setForm((prev) => ({
      name: prev.name.trim() ? `${prev.name} + ${f.name}` : f.name,
      kcal: String(Math.round(num(prev.kcal) + f.kcal)),
      carbs: String(Math.round(num(prev.carbs) + f.carbs)),
      protein: String(Math.round(num(prev.protein) + f.protein)),
      fat: String(Math.round(num(prev.fat) + f.fat)),
    }));
  };

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
    const food = {
      name,
      kcal: num(form.kcal),
      carbs: num(form.carbs),
      protein: num(form.protein),
      fat: num(form.fat),
    };
    if (editing) {
      updateFood(slot, editing, food);
      setSelected((prev) =>
        prev.map((m) =>
          m.id === `${slot}::${editing}` ? { ...m, ...food, id: `${slot}::${food.name}` } : m,
        ),
      );
    } else {
      addFood(slot, food);
    }
    setForm(emptyForm);
    setEditing(null);
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
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-muted-foreground">{slot}</div>
                <button
                  onClick={() => openForm(slot)}
                  className="text-xs font-medium text-primary-glow hover:underline flex items-center gap-1"
                >
                  {formSlot === slot ? <X size={12} /> : <Plus size={12} />}
                  {formSlot === slot ? "Cancelar" : "Nova refeição"}
                </button>
              </div>

              {formSlot === slot && (
                <div className="mb-2 rounded-xl border border-primary/40 bg-secondary/40 p-3 space-y-2">
                  <input
                    value={form.name}
                    maxLength={120}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nome da refeição"
                    className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />

                  <div className="rounded-lg border border-border bg-background/40 p-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search
                          size={13}
                          className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Buscar alimento"
                          className="w-full rounded-md bg-background/60 border border-border pl-7 pr-2 py-1.5 text-xs outline-none focus:border-primary"
                        />
                      </div>
                      <select
                        value={cat}
                        onChange={(e) => setCat(e.target.value)}
                        className="rounded-md bg-background/60 border border-border px-2 py-1.5 text-xs outline-none focus:border-primary max-w-[45%]"
                      >
                        {FOOD_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {results.map((f) => (
                        <button
                          key={`${f.cat}-${f.name}`}
                          onClick={() => addBaseFood(f)}
                          className="w-full text-left rounded-md px-2 py-1.5 hover:bg-primary/15 transition"
                        >
                          <div className="text-xs font-medium">{f.name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {f.portion} • {f.kcal} kcal • C {f.carbs}g • P {f.protein}g • G {f.fat}g
                          </div>
                        </button>
                      ))}
                      {results.length === 0 && (
                        <div className="px-2 py-3 text-xs text-muted-foreground">
                          Nenhum alimento encontrado.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(["kcal", "carbs", "protein", "fat"] as const).map((k) => (
                      <input
                        key={k}
                        type="number"
                        min={0}
                        value={form[k]}
                        onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                        placeholder={
                          k === "kcal" ? "kcal" : k === "carbs" ? "Carb g" : k === "protein" ? "Prot g" : "Gord g"
                        }
                        className="w-full rounded-lg bg-background/60 border border-border px-2 py-2 text-xs outline-none focus:border-primary"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => submitFood(slot)}
                    disabled={!form.name.trim()}
                    className={`w-full ${btn} disabled:opacity-50`}
                  >
                    {editing ? "Salvar alterações" : "Adicionar à lista"}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {optionsFor(slot).map((o) => {
                  const active = selected.some((m) => m.id === `${slot}::${o.name}`);
                  const custom = isCustom(slot, o.name);
                  return (
                    <div
                      key={o.name}
                      className={`relative rounded-xl border transition ${
                        active
                          ? "border-primary bg-primary/15"
                          : "border-border bg-secondary/40 hover:border-primary/50"
                      }`}
                    >
                      <button
                        onClick={() => toggle(slot, o.name)}
                        className="w-full text-left flex items-start gap-2 p-3 pr-14"
                      >
                        <div
                          className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center shrink-0 ${
                            active ? "bg-gradient-primary" : "border border-border"
                          }`}
                        >
                          {active && <Check size={12} />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium">
                            {o.name}
                            {custom && (
                              <span className="ml-2 text-[10px] uppercase tracking-wide text-primary-glow">
                                sua
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {o.kcal} kcal • C {o.carbs}g • P {o.protein}g • G {o.fat}g
                          </div>
                        </div>
                      </button>
                      {custom && (
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <button
                            aria-label={`Editar ${o.name}`}
                            onClick={() => startEdit(slot, o)}
                            className="text-muted-foreground hover:text-primary-glow"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            aria-label={`Excluir ${o.name}`}
                            onClick={() => {
                              removeFood(slot, o.name);
                              setSelected((prev) => prev.filter((m) => m.id !== `${slot}::${o.name}`));
                            }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
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
