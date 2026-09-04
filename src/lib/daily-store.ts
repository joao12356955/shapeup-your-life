import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


const LOGS_KEY = "shapeup:logs";
const EVENT = "shapeup:logs-changed";

export const BOTTLE_ML = 500;
export const WATER_GOAL_ML = 3000; // 3 litros = 6 garrafas
export const WATER_GOAL_BOTTLES = WATER_GOAL_ML / BOTTLE_ML;

export type MealSlot = "Café da manhã" | "Almoço" | "Café da tarde" | "Jantar";

export type MealEntry = {
  id: string;
  slot: MealSlot;
  name: string;
  kcal: number;
  carbs: number;
  protein: number;
  fat: number;
};

export type DayLog = {
  waterMl: number;
  meals: MealEntry[];
  weightKg?: number;
  workoutDone?: boolean;
};

export type LogMap = Record<string, DayLog>;

export const MEAL_SLOTS: MealSlot[] = ["Café da manhã", "Almoço", "Café da tarde", "Jantar"];

export const MEAL_OPTIONS: Record<MealSlot, Omit<MealEntry, "id" | "slot">[]> = {
  "Café da manhã": [
    { name: "Ovos mexidos + pão integral", kcal: 380, carbs: 32, protein: 24, fat: 16 },
    { name: "Iogurte grego + granola + fruta", kcal: 320, carbs: 40, protein: 20, fat: 8 },
    { name: "Tapioca com frango", kcal: 420, carbs: 52, protein: 28, fat: 9 },
    { name: "Vitamina de banana com whey", kcal: 340, carbs: 44, protein: 30, fat: 5 },
  ],
  Almoço: [
    { name: "Arroz, feijão, frango e salada", kcal: 620, carbs: 72, protein: 45, fat: 14 },
    { name: "Batata doce + carne magra + brócolis", kcal: 580, carbs: 60, protein: 48, fat: 13 },
    { name: "Macarrão integral com atum", kcal: 540, carbs: 68, protein: 34, fat: 12 },
    { name: "Salmão grelhado + quinoa", kcal: 610, carbs: 48, protein: 42, fat: 24 },
  ],
  "Café da tarde": [
    { name: "Whey protein + banana", kcal: 260, carbs: 30, protein: 26, fat: 3 },
    { name: "Sanduíche de peito de peru", kcal: 300, carbs: 34, protein: 22, fat: 8 },
    { name: "Mix de castanhas", kcal: 210, carbs: 8, protein: 6, fat: 18 },
    { name: "Fruta + pasta de amendoim", kcal: 240, carbs: 26, protein: 8, fat: 12 },
  ],
  Jantar: [
    { name: "Omelete com legumes", kcal: 380, carbs: 14, protein: 30, fat: 22 },
    { name: "Frango grelhado + purê de abóbora", kcal: 470, carbs: 38, protein: 44, fat: 14 },
    { name: "Sopa de legumes com carne", kcal: 350, carbs: 32, protein: 26, fat: 11 },
    { name: "Wrap de atum com salada", kcal: 420, carbs: 40, protein: 32, fat: 13 },
  ],
};

export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const emptyDay: DayLog = { waterMl: 0, meals: [] };

function storageKey(email: string) {
  return `${LOGS_KEY}:${email}`;
}

function read(email: string): LogMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(storageKey(email)) || "{}") as LogMap;
  } catch {
    return {};
  }
}

function write(email: string, logs: LogMap) {
  localStorage.setItem(storageKey(email), JSON.stringify(logs));
  window.dispatchEvent(new Event(EVENT));
}

/** Pulls the user's daily logs from the database into the local cache. */
async function hydrateFromDb(email: string) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return;
  const { data } = await supabase
    .from("daily_logs")
    .select("day, water_ml, meals, weight_kg, workout_done")
    .eq("user_id", user.id);
  if (!data) return;
  const merged = read(email);
  for (const row of data) {
    merged[row.day] = {
      waterMl: row.water_ml ?? 0,
      meals: (row.meals as MealEntry[]) ?? [],
      weightKg: row.weight_kg === null ? undefined : Number(row.weight_kg),
      workoutDone: row.workout_done ?? false,
    };
  }
  write(email, merged);
}

async function persistDay(key: string, day: DayLog) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return;
  await supabase.from("daily_logs").upsert(
    {
      user_id: user.id,
      day: key,
      water_ml: day.waterMl ?? 0,
      meals: (day.meals ?? []) as never,
      weight_kg: day.weightKg ?? null,
      workout_done: day.workoutDone ?? false,
    },
    { onConflict: "user_id,day" },
  );
}

export function useDailyLogs(email?: string) {
  const [logs, setLogs] = useState<LogMap>({});

  useEffect(() => {
    if (!email) return;
    const refresh = () => setLogs(read(email));
    refresh();
    void hydrateFromDb(email);
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [email]);

  const updateDay = useCallback(
    (key: string, patch: Partial<DayLog> | ((prev: DayLog) => Partial<DayLog>)) => {
      if (!email) return;
      const current = read(email);
      const prev = current[key] ?? emptyDay;
      const next = typeof patch === "function" ? patch(prev) : patch;
      current[key] = { ...prev, ...next };
      write(email, current);
      void persistDay(key, current[key]);
    },
    [email],
  );

  return { logs, updateDay };
}

/* ------------------------------------------------------------------ */
/* refeições personalizadas (o usuário pode criar as suas)             */
/* ------------------------------------------------------------------ */

export type FoodOption = Omit<MealEntry, "id" | "slot">;
export type CustomFoods = Partial<Record<MealSlot, FoodOption[]>>;

const FOODS_KEY = "shapeup:foods";
const FOODS_EVENT = "shapeup:foods-changed";

function foodsKey(email: string) {
  return `${FOODS_KEY}:${email}`;
}

function readFoods(email: string): CustomFoods {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(foodsKey(email)) || "{}") as CustomFoods;
  } catch {
    return {};
  }
}

function writeFoods(email: string, foods: CustomFoods) {
  localStorage.setItem(foodsKey(email), JSON.stringify(foods));
  window.dispatchEvent(new Event(FOODS_EVENT));
}

/** Custom foods created by the user, merged with the built-in suggestions. */
export function useCustomFoods(email?: string) {
  const [foods, setFoods] = useState<CustomFoods>({});

  useEffect(() => {
    if (!email) return;
    const refresh = () => setFoods(readFoods(email));
    refresh();
    window.addEventListener(FOODS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(FOODS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [email]);

  const addFood = useCallback(
    (slot: MealSlot, food: FoodOption) => {
      if (!email) return;
      const current = readFoods(email);
      const list = (current[slot] ?? []).filter((f) => f.name !== food.name);
      current[slot] = [...list, food];
      writeFoods(email, current);
    },
    [email],
  );

  const removeFood = useCallback(
    (slot: MealSlot, name: string) => {
      if (!email) return;
      const current = readFoods(email);
      current[slot] = (current[slot] ?? []).filter((f) => f.name !== name);
      writeFoods(email, current);
    },
    [email],
  );

  const optionsFor = useCallback(
    (slot: MealSlot): FoodOption[] => [...MEAL_OPTIONS[slot], ...(foods[slot] ?? [])],
    [foods],
  );

  const isCustom = useCallback(
    (slot: MealSlot, name: string) => (foods[slot] ?? []).some((f) => f.name === name),
    [foods],
  );

  return { foods, addFood, removeFood, optionsFor, isCustom };
}



export function weekKeys(today = new Date()) {
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return dateKey(d);
  });
}

export function sumMacros(meals: MealEntry[]) {
  return meals.reduce(
    (a, m) => ({
      kcal: a.kcal + m.kcal,
      carbs: a.carbs + m.carbs,
      protein: a.protein + m.protein,
      fat: a.fat + m.fat,
    }),
    { kcal: 0, carbs: 0, protein: 0, fat: 0 },
  );
}
