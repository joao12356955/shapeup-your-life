import { useMemo } from "react";
import {
  BOTTLE_ML,
  MEAL_SLOTS,
  WATER_GOAL_ML,
  useDailyLogs,
  type DayLog,
  type LogMap,
} from "@/lib/daily-store";

export const XP_PER_LEVEL = 1000;
export const XP_ALL_MEALS = 100;
export const XP_WATER_GOAL = 250;
export const XP_EXTRA_BOTTLE = 50;
export const XP_WORKOUT = 300;

export type XpItem = { label: string; xp: number };

export function dayXp(day: DayLog | undefined): { total: number; items: XpItem[] } {
  const items: XpItem[] = [];
  if (!day) return { total: 0, items };

  if (day.workoutDone) items.push({ label: "Treino concluído", xp: XP_WORKOUT });

  const meals = day.meals ?? [];
  const allMeals = MEAL_SLOTS.every((slot) => meals.some((m) => m.slot === slot));
  if (allMeals) items.push({ label: "Todas as refeições do dia", xp: XP_ALL_MEALS });


  const water = day.waterMl ?? 0;
  if (water >= WATER_GOAL_ML) {
    items.push({ label: `Meta de ${WATER_GOAL_ML / 1000} L de água`, xp: XP_WATER_GOAL });
    const extra = Math.floor((water - WATER_GOAL_ML) / BOTTLE_ML);
    if (extra > 0)
      items.push({
        label: `${extra} garrafa(s) extra de ${BOTTLE_ML} ml`,
        xp: extra * XP_EXTRA_BOTTLE,
      });
  }

  return { total: items.reduce((a, i) => a + i.xp, 0), items };
}

export function totalXp(logs: LogMap) {
  return Object.values(logs).reduce((a, d) => a + dayXp(d).total, 0);
}

export function useXp(email?: string) {
  const { logs } = useDailyLogs(email);
  return useMemo(() => {
    const total = totalXp(logs);
    const level = Math.floor(total / XP_PER_LEVEL);
    const inLevel = total % XP_PER_LEVEL;
    const history = Object.entries(logs)
      .map(([key, day]) => ({ key, ...dayXp(day) }))
      .filter((d) => d.total > 0)
      .sort((a, b) => (a.key < b.key ? 1 : -1));
    return {
      total,
      level,
      inLevel,
      toNext: XP_PER_LEVEL - inLevel,
      pct: Math.round((inLevel / XP_PER_LEVEL) * 100),
      history,
      logs,
    };
  }, [logs]);
}
