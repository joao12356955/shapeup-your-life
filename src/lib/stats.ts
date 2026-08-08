import { useMemo } from "react";
import {
  WATER_GOAL_ML,
  sumMacros,
  useDailyLogs,
  type LogMap,
} from "@/lib/daily-store";
import type { UserProfile } from "@/lib/user-store";

export function dayLabel(key: string) {
  return `${key.slice(8, 10)}/${key.slice(5, 7)}`;
}

/** Weight entries registered by the user, ordered by date. */
export function weightSeries(logs: LogMap) {
  return Object.entries(logs)
    .filter(([, d]) => typeof d.weightKg === "number")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, d]) => ({ key: k, d: dayLabel(k), kg: d.weightKg as number }));
}

export function imcOf(pesoKg?: number, alturaCm?: number) {
  if (!pesoKg || !alturaCm) return undefined;
  const m = alturaCm / 100;
  return pesoKg / (m * m);
}

export function imcLabel(imc?: number) {
  if (!imc) return "Sem dados";
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Saudável";
  if (imc < 30) return "Sobrepeso";
  return "Obesidade";
}

/** Consecutive days (ending today) with any registered activity. */
export function currentStreak(logs: LogMap) {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 400; i++) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const day = logs[key];
    const active = !!day && (day.workoutDone || day.meals.length > 0 || day.waterMl > 0);
    if (!active) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function bestStreak(logs: LogMap) {
  const keys = Object.keys(logs)
    .filter((k) => {
      const d = logs[k]!;
      return d.workoutDone || d.meals.length > 0 || d.waterMl > 0;
    })
    .sort();
  let best = 0;
  let run = 0;
  let prev: number | null = null;
  for (const k of keys) {
    const t = new Date(`${k}T00:00:00`).getTime();
    run = prev !== null && t - prev === 86400000 ? run + 1 : 1;
    prev = t;
    best = Math.max(best, run);
  }
  return best;
}

/** Everything the reports/evolution pages need, derived from the user's logs. */
export function computeStats(logs: LogMap, user?: UserProfile | null) {
  const entries = Object.entries(logs).sort(([a], [b]) => a.localeCompare(b));
  const active = entries.filter(
    ([, d]) => d.workoutDone || d.meals.length > 0 || d.waterMl > 0 || d.weightKg,
  );

  const weights = weightSeries(logs);
  const firstWeight = weights[0]?.kg;
  const lastWeight = weights[weights.length - 1]?.kg;
  const peso = lastWeight ?? user?.peso;
  const pesoDelta = firstWeight && lastWeight ? lastWeight - firstWeight : undefined;

  const workoutsDone = entries.filter(([, d]) => d.workoutDone).length;
  const workoutsGoal = Math.max(
    workoutsDone,
    (user?.treino?.diasPorSemana ?? 4) * Math.max(1, Math.ceil(active.length / 7)),
  );

  const daysWithMeals = entries.filter(([, d]) => d.meals.length > 0);
  const totals = daysWithMeals.reduce(
    (a, [, d]) => {
      const m = sumMacros(d.meals);
      return {
        kcal: a.kcal + m.kcal,
        carbs: a.carbs + m.carbs,
        protein: a.protein + m.protein,
        fat: a.fat + m.fat,
      };
    },
    { kcal: 0, carbs: 0, protein: 0, fat: 0 },
  );
  const n = daysWithMeals.length;
  const avgKcal = n > 0 ? Math.round(totals.kcal / n) : 0;
  const kcalFromMacros = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
  const pctOf = (g: number, k: number) =>
    kcalFromMacros > 0 ? Math.round(((g * k) / kcalFromMacros) * 100) : 0;
  const macros = [
    { name: "Proteínas", value: pctOf(totals.protein, 4), color: "oklch(0.62 0.24 295)" },
    { name: "Carboidratos", value: pctOf(totals.carbs, 4), color: "oklch(0.65 0.22 340)" },
    { name: "Gorduras", value: pctOf(totals.fat, 9), color: "oklch(0.78 0.17 70)" },
  ];

  const waterDays = entries.filter(([, d]) => d.waterMl > 0);
  const avgWaterMl =
    waterDays.length > 0
      ? Math.round(waterDays.reduce((a, [, d]) => a + d.waterMl, 0) / waterDays.length)
      : 0;
  const waterGoalDays = entries.filter(([, d]) => d.waterMl >= WATER_GOAL_ML).length;

  const imc = imcOf(peso, user?.altura);

  // weekly workout volume (count of workouts per week) from real logs
  const weeks = new Map<string, number>();
  for (const [k, d] of entries) {
    if (!d.workoutDone) continue;
    const dt = new Date(`${k}T00:00:00`);
    dt.setDate(dt.getDate() - dt.getDay());
    const label = dayLabel(
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`,
    );
    weeks.set(label, (weeks.get(label) ?? 0) + 1);
  }
  const weeklyWorkouts = Array.from(weeks, ([w, v]) => ({ w, v }));

  return {
    daysLogged: active.length,
    weights,
    peso,
    pesoInicial: firstWeight ?? user?.peso,
    pesoDelta,
    pesoMeta: user?.pesoMeta,
    altura: user?.altura,
    imc,
    imcLabel: imcLabel(imc),
    workoutsDone,
    workoutsGoal,
    avgKcal,
    macros,
    avgWaterMl,
    waterGoalDays,
    mealDays: n,
    streak: currentStreak(logs),
    best: bestStreak(logs),
    weeklyWorkouts,
    medidas: user?.medidas ?? {},
  };
}

export type Stats = ReturnType<typeof computeStats>;

export function useStats(user?: UserProfile | null) {
  const { logs } = useDailyLogs(user?.email);
  return useMemo(() => computeStats(logs, user), [logs, user]);
}
