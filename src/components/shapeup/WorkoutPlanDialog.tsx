import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Trash2, Upload, RotateCcw, Save, ListChecks } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WEEK_LABELS, type SimpleWorkout } from "@/lib/workout-split";
import { useWorkoutPlan, rowsFromSheet, applyImport, type ImportRow } from "@/lib/workout-store";
import type { Objetivo } from "@/lib/user-store";

const inputCls =
  "w-full rounded-lg bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function WorkoutPlanDialog({
  email,
  objetivo,
}: {
  email?: string | null;
  objetivo?: Objetivo | null;
}) {
  const { plan, isCustom, save, reset } = useWorkoutPlan(email, objetivo);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<SimpleWorkout[]>(plan);
  const [day, setDay] = useState(new Date().getDay());
  const [preview, setPreview] = useState<ImportRow[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(plan.map((w) => ({ ...w, exercises: w.exercises.map((e) => ({ ...e })) })));
      setPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const current = draft[day] ?? draft[0]!;
  const total = useMemo(() => draft.reduce((acc, w) => acc + w.exercises.length, 0), [draft]);

  const patchDay = (patch: Partial<SimpleWorkout>) =>
    setDraft((prev) => prev.map((w, i) => (i === day ? { ...w, ...patch } : w)));

  const patchExercise = (idx: number, patch: Partial<SimpleWorkout["exercises"][number]>) =>
    patchDay({ exercises: current.exercises.map((e, i) => (i === idx ? { ...e, ...patch } : e)) });

  const addExercise = () =>
    patchDay({
      rest: false,
      exercises: [...current.exercises, { name: "Novo exercício", sets: "3 x 10", rest: "60s" }],
    });

  const removeExercise = (idx: number) =>
    patchDay({ exercises: current.exercises.filter((_, i) => i !== idx) });

  const onFile = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const rows: Record<string, unknown>[] = [];
      for (const sheetName of wb.SheetNames) {
        const sheet = wb.Sheets[sheetName];
        if (sheet) rows.push(...XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" }));
      }
      const parsed = rowsFromSheet(rows);
      if (!parsed.length) {
        toast.error("Não encontrei os dados", {
          description: "A planilha precisa das colunas Dia, Exercício, Séries e Descanso.",
        });
        return;
      }
      setPreview(parsed);
    } catch {
      toast.error("Não consegui ler esse arquivo. Envie um Excel (.xlsx) ou CSV.");
    }
  };

  const confirmImport = () => {
    if (!preview) return;
    setDraft((prev) => applyImport(prev, preview));
    setPreview(null);
    toast.success("Planilha aplicada! Confira e salve.");
  };

  const onSave = () => {
    save(draft);
    toast.success("Seus treinos foram salvos.");
    setOpen(false);
  };

  const onReset = () => {
    reset();
    toast("Plano original restaurado.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs rounded-lg border border-primary/50 px-3 py-1.5 hover:bg-primary/10 transition flex items-center gap-1.5">
          <ListChecks size={14} /> Ver todos os treinos
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Todos os treinos da semana</DialogTitle>
          <DialogDescription>
            {total} exercícios no total {isCustom ? "• plano personalizado" : "• plano sugerido"}
          </DialogDescription>
        </DialogHeader>

        {/* dias */}
        <div className="flex flex-wrap gap-2">
          {draft.map((w, i) => (
            <button
              key={i}
              onClick={() => setDay(i)}
              className={`rounded-lg px-3 py-1.5 text-xs border transition ${
                i === day
                  ? "bg-primary/25 border-primary text-primary-glow"
                  : "border-border hover:bg-primary/10"
              }`}
            >
              {WEEK_LABELS[i]} • {w.exercises.length}
            </button>
          ))}
        </div>

        {/* edição do dia */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Nome">
            <input className={inputCls} value={current.name} onChange={(e) => patchDay({ name: e.target.value })} />
          </Field>
          <Field label="Foco">
            <input className={inputCls} value={current.focus} onChange={(e) => patchDay({ focus: e.target.value })} />
          </Field>
          <Field label="Duração">
            <input className={inputCls} value={current.duration} onChange={(e) => patchDay({ duration: e.target.value })} />
          </Field>
        </div>

        <div className="space-y-2">
          {current.exercises.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum exercício neste dia (descanso).</p>
          )}
          {current.exercises.map((ex, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_140px_110px_36px] gap-2 items-end">
              <Field label="Exercício">
                <input className={inputCls} value={ex.name} onChange={(e) => patchExercise(i, { name: e.target.value })} />
              </Field>
              <Field label="Séries x reps">
                <input className={inputCls} value={ex.sets} onChange={(e) => patchExercise(i, { sets: e.target.value })} />
              </Field>
              <Field label="Descanso">
                <input className={inputCls} value={ex.rest} onChange={(e) => patchExercise(i, { rest: e.target.value })} />
              </Field>
              <button
                onClick={() => removeExercise(i)}
                aria-label="Apagar exercício"
                className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-destructive hover:bg-destructive/10 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={addExercise}
            className="text-xs rounded-lg border border-border px-3 py-1.5 hover:bg-primary/10 transition flex items-center gap-1.5"
          >
            <Plus size={14} /> Adicionar exercício
          </button>
        </div>

        {/* planilha */}
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="text-sm font-semibold">Importar por planilha</div>
          <p className="text-xs text-muted-foreground">
            Envie um Excel (.xlsx) ou CSV com as colunas <strong>Dia</strong>, <strong>Exercício</strong>,{" "}
            <strong>Séries</strong> e <strong>Descanso</strong>. O dia aceita SEG, TER… ou 1 a 7.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs rounded-lg border border-primary/50 px-3 py-1.5 hover:bg-primary/10 transition flex items-center gap-1.5"
          >
            <Upload size={14} /> Escolher planilha
          </button>

          {preview && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Prévia — {preview.length} exercícios em {new Set(preview.map((r) => r.day)).size} dia(s)
              </div>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left px-3 py-2">Dia</th>
                      <th className="text-left px-3 py-2">Exercício</th>
                      <th className="text-left px-3 py-2">Séries</th>
                      <th className="text-left px-3 py-2">Descanso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {preview.map((r, i) => (
                      <tr key={i}>
                        <td className="px-3 py-1.5">{WEEK_LABELS[r.day]}</td>
                        <td className="px-3 py-1.5">{r.name}</td>
                        <td className="px-3 py-1.5">{r.sets}</td>
                        <td className="px-3 py-1.5">{r.rest}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={confirmImport}
                  className="text-xs rounded-lg bg-gradient-primary px-3 py-1.5 font-semibold hover:opacity-90 transition"
                >
                  Confirmar importação
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="text-xs rounded-lg border border-border px-3 py-1.5 hover:bg-primary/10 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
          <button
            onClick={onReset}
            className="text-xs rounded-lg border border-border px-3 py-1.5 hover:bg-primary/10 transition flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Voltar ao plano original
          </button>
          <button
            onClick={onSave}
            className="text-sm rounded-lg bg-gradient-primary px-4 py-2 font-semibold shadow-glow hover:opacity-90 transition flex items-center gap-2"
          >
            <Save size={14} /> Salvar treinos
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
