import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  banner_url: string | null;
  start_date: string;
  end_date: string;
  workout_frequency: number;
  meals_per_day: number;
  diet_notes: string;
  workout_notes: string;
  xp_reward: number;
  published: boolean;
  created_at: string;
};

export type ChallengeDraft = {
  id?: string;
  title: string;
  description: string;
  banner_url: string;
  start_date: string;
  end_date: string;
  workout_frequency: number;
  meals_per_day: number;
  diet_notes: string;
  workout_notes: string;
  xp_reward: number;
  published: boolean;
};

export const emptyDraft = (): ChallengeDraft => {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 29);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return {
    title: "",
    description: "",
    banner_url: "",
    start_date: iso(today),
    end_date: iso(end),
    workout_frequency: 3,
    meals_per_day: 4,
    diet_notes: "",
    workout_notes: "",
    xp_reward: 300,
    published: true,
  };
};

export const draftFrom = (c: Challenge): ChallengeDraft => ({
  id: c.id,
  title: c.title,
  description: c.description,
  banner_url: c.banner_url ?? "",
  start_date: c.start_date,
  end_date: c.end_date,
  workout_frequency: c.workout_frequency,
  meals_per_day: c.meals_per_day,
  diet_notes: c.diet_notes,
  workout_notes: c.workout_notes,
  xp_reward: c.xp_reward,
  published: c.published,
});

const EVENT = "shapeup:challenges-changed";
const ping = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
};

export function fmtDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
}

export function daysBetween(a: string, b: string) {
  const ms = new Date(`${b}T12:00:00`).getTime() - new Date(`${a}T12:00:00`).getTime();
  return Math.round(ms / 86400000) + 1;
}

/** Progress of a challenge relative to today (0-100). */
export function challengeProgress(c: Challenge) {
  const total = daysBetween(c.start_date, c.end_date);
  const today = new Date().toISOString().slice(0, 10);
  if (today < c.start_date) return { pct: 0, elapsed: 0, total };
  const elapsed = Math.min(total, daysBetween(c.start_date, today > c.end_date ? c.end_date : today));
  return { pct: Math.round((elapsed / total) * 100), elapsed, total };
}

export async function saveChallenge(draft: ChallengeDraft) {
  const payload = {
    title: draft.title.trim(),
    description: draft.description.trim(),
    banner_url: draft.banner_url.trim() || null,
    start_date: draft.start_date,
    end_date: draft.end_date,
    workout_frequency: draft.workout_frequency,
    meals_per_day: draft.meals_per_day,
    diet_notes: draft.diet_notes.trim(),
    workout_notes: draft.workout_notes.trim(),
    xp_reward: draft.xp_reward,
    published: draft.published,
  };
  if (draft.id) {
    const { error } = await supabase.from("challenges").update(payload).eq("id", draft.id);
    ping();
    return error?.message ?? null;
  }
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("challenges")
    .insert({ ...payload, created_by: auth.user?.id ?? null });
  ping();
  return error?.message ?? null;
}

export async function deleteChallenge(id: string) {
  const { error } = await supabase.from("challenges").delete().eq("id", id);
  ping();
  return error?.message ?? null;
}

export async function joinChallenge(challengeId: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return "Entre na sua conta para participar.";
  const { error } = await supabase
    .from("challenge_participants")
    .insert({ challenge_id: challengeId, user_id: auth.user.id });
  ping();
  return error?.message ?? null;
}

export async function leaveChallenge(challengeId: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return "Sessão expirada.";
  const { error } = await supabase
    .from("challenge_participants")
    .delete()
    .eq("challenge_id", challengeId)
    .eq("user_id", auth.user.id);
  ping();
  return error?.message ?? null;
}

/** Challenges + which ones the signed-in user joined. */
export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);
  const [joined, setJoined] = useState<string[]>([]);

  const reload = useCallback(async () => {
    const [{ data: rows }, { data: parts }] = await Promise.all([
      supabase.from("challenges").select("*").order("start_date", { ascending: false }),
      supabase.from("challenge_participants").select("challenge_id"),
    ]);
    setChallenges((rows ?? []) as Challenge[]);
    const { data: auth } = await supabase.auth.getUser();
    const mine = (parts ?? []) as { challenge_id: string }[];
    setJoined(auth.user ? mine.map((p) => p.challenge_id) : []);
  }, []);

  useEffect(() => {
    void reload();
    const h = () => void reload();
    window.addEventListener(EVENT, h);
    return () => window.removeEventListener(EVENT, h);
  }, [reload]);

  return { challenges, joined, reload };
}

/** Only the challenges the user joined. */
export function useMyChallenges() {
  const { challenges, joined, reload } = useChallenges();
  const mine = (challenges ?? []).filter((c) => joined.includes(c.id));
  return { mine, challenges, joined, reload };
}
