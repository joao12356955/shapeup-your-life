import { useCallback, useEffect, useState } from "react";
import { splitFor, type SimpleWorkout } from "@/lib/workout-split";
import type { Objetivo } from "@/lib/user-store";

const EVENT = "shapeup:plan-changed";

const planKey = (email?: string | null) => `shapeup:plan:${email ?? "anon"}`;

function read(email?: string | null): SimpleWorkout[] | null {
  if (typeof window === "undefined" || !email) return null;
  try {
    const raw = localStorage.getItem(planKey(email));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SimpleWorkout[];
    return Array.isArray(parsed) && parsed.length === 7 ? parsed : null;
  } catch {
    return null;
  }
}

export function savePlan(email: string | null | undefined, plan: SimpleWorkout[]) {
  if (typeof window === "undefined" || !email) return;
  localStorage.setItem(planKey(email), JSON.stringify(plan));
  window.dispatchEvent(new Event(EVENT));
}

export function resetPlan(email: string | null | undefined) {
  if (typeof window === "undefined" || !email) return;
  localStorage.removeItem(planKey(email));
  window.dispatchEvent(new Event(EVENT));
}

/** Plano de 7 dias do usuário: override salvo ou o plano padrão do objetivo. */
export function useWorkoutPlan(email?: string | null, objetivo?: Objetivo | null) {
  const base = splitFor(objetivo);
  const [custom, setCustom] = useState<SimpleWorkout[] | null>(null);

  useEffect(() => {
    const refresh = () => setCustom(read(email));
    refresh();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [email]);

  const save = useCallback((plan: SimpleWorkout[]) => savePlan(email, plan), [email]);
  const reset = useCallback(() => resetPlan(email), [email]);

  return { plan: custom ?? base, base, isCustom: !!custom, save, reset };
}

/* ----------------------------- planilha ----------------------------- */

export type ImportRow = { day: number; name: string; sets: string; rest: string };

const DAY_ALIASES: Record<string, number> = {
  dom: 0, domingo: 0,
  seg: 1, segunda: 1, "segunda-feira": 1,
  ter: 2, terca: 2, "terça": 2, "terca-feira": 2, "terça-feira": 2,
  qua: 3, quarta: 3, "quarta-feira": 3,
  qui: 4, quinta: 4, "quinta-feira": 4,
  sex: 5, sexta: 5, "sexta-feira": 5,
  sab: 6, "sábado": 6, sabado: 6,
};

function parseDay(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim().toLowerCase();
  if (!raw) return null;
  const digits = raw.match(/\d+/);
  if (digits) {
    const n = Number(digits[0]);
    if (n >= 0 && n <= 6) return n;
    if (n >= 1 && n <= 7) return n % 7; // "Dia 1" = segunda
  }
  const key = raw.replace(/\.$/, "");
  for (const alias of Object.keys(DAY_ALIASES)) {
    if (key.startsWith(alias)) return DAY_ALIASES[alias]!;
  }
  return null;
}

function pick(row: Record<string, unknown>, names: string[]) {
  for (const [k, v] of Object.entries(row)) {
    const key = k
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (names.includes(key)) return v;
  }
  return undefined;
}

/** Converte as linhas cruas da planilha em exercícios por dia. */
export function rowsFromSheet(rows: Record<string, unknown>[]): ImportRow[] {
  const out: ImportRow[] = [];
  for (const row of rows) {
    const day = parseDay(pick(row, ["dia", "dia da semana", "weekday", "day"]));
    const name = pick(row, ["exercicio", "exercicios", "nome", "exercise", "treino"]);
    if (day === null || !name) continue;
    const sets = pick(row, ["series", "serie", "sets", "series x reps", "repeticoes", "series/reps"]);
    const rest = pick(row, ["descanso", "rest", "intervalo"]);
    out.push({
      day,
      name: String(name).trim(),
      sets: sets === undefined || sets === null ? "3 x 10" : String(sets).trim(),
      rest: rest === undefined || rest === null ? "60s" : String(rest).trim(),
    });
  }
  return out;
}

/** Aplica as linhas importadas sobre o plano atual (substitui os dias presentes). */
export function applyImport(plan: SimpleWorkout[], rows: ImportRow[]): SimpleWorkout[] {
  const byDay = new Map<number, ImportRow[]>();
  for (const r of rows) {
    const list = byDay.get(r.day) ?? [];
    list.push(r);
    byDay.set(r.day, list);
  }
  return plan.map((w, i) => {
    const list = byDay.get(i);
    if (!list?.length) return w;
    return {
      ...w,
      rest: false,
      tag: w.rest ? "🏋️" : w.tag,
      name: w.rest ? "Treino personalizado" : w.name,
      focus: w.rest ? "Importado da planilha" : w.focus,
      exercises: list.map((r) => ({ name: r.name, sets: r.sets, rest: r.rest })),
    };
  });
}
