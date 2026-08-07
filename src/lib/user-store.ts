import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = "shapeup:profile-cache";
const WELCOMED_KEY = "shapeup:welcomed";
const EVENT = "shapeup:user-changed";

export type Objetivo = "emagrecimento" | "ganho de massa muscular" | "foco";
export type Sexo = "Masculino" | "Feminino" | "Outro";
export type NivelAtividade = "Sedentário" | "Levemente ativo" | "Moderado" | "Muito ativo";

export type Medidas = {
  cintura?: number;
  quadril?: number;
  peito?: number;
  braco?: number;
  coxa?: number;
};

export type PlanoTreino = {
  diasPorSemana?: number;
  local?: "Academia" | "Casa" | "Ar livre";
  duracao?: number; // min
  experiencia?: "Iniciante" | "Intermediário" | "Avançado";
};

export type PlanoDieta = {
  refeicoesPorDia?: number;
  restricoes?: string;
  metaCalorica?: number;
};

export type UserProfile = {
  id?: string;
  email: string;
  password?: string;
  name: string;
  initials?: string;
  altura?: number; // cm
  peso?: number; // kg
  pesoMeta?: number; // kg
  dataNascimento?: string;
  sexo?: Sexo;
  nivelAtividade?: NivelAtividade;
  objetivo?: Objetivo;
  dataMeta?: string;
  medidas?: Medidas;
  treino?: PlanoTreino;
  dieta?: PlanoDieta;
  onboardingCompleto?: boolean;
  isNew?: boolean;
  hasSampleData?: boolean;
  isAdmin?: boolean;
};

/* ------------------------------------------------------------------ */
/* mapping between the app shape and the database row                  */
/* ------------------------------------------------------------------ */

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  initials: string | null;
  altura: number | null;
  peso: number | null;
  peso_meta: number | null;
  data_nascimento: string | null;
  sexo: string | null;
  nivel_atividade: string | null;
  objetivo: string | null;
  data_meta: string | null;
  medidas: unknown;
  treino: unknown;
  dieta: unknown;
  onboarding_completo: boolean;
};

function num(v: unknown) {
  return v === null || v === undefined ? undefined : Number(v);
}

export function rowToProfile(row: ProfileRow, isAdmin = false): UserProfile {
  return {
    id: row.id,
    email: row.email,
    name: row.name || row.email,
    initials: row.initials ?? initialsOf(row.name || row.email),
    altura: num(row.altura),
    peso: num(row.peso),
    pesoMeta: num(row.peso_meta),
    dataNascimento: row.data_nascimento ?? undefined,
    sexo: (row.sexo as Sexo) ?? undefined,
    nivelAtividade: (row.nivel_atividade as NivelAtividade) ?? undefined,
    objetivo: (row.objetivo as Objetivo) ?? undefined,
    dataMeta: row.data_meta ?? undefined,
    medidas: (row.medidas as Medidas) ?? {},
    treino: (row.treino as PlanoTreino) ?? {},
    dieta: (row.dieta as PlanoDieta) ?? {},
    onboardingCompleto: row.onboarding_completo,
    isNew: !row.onboarding_completo,
    isAdmin,
  };
}

function patchToRow(patch: Partial<UserProfile>) {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row["name"] = patch.name;
  if (patch.initials !== undefined) row["initials"] = patch.initials;
  if (patch.altura !== undefined) row["altura"] = patch.altura;
  if (patch.peso !== undefined) row["peso"] = patch.peso;
  if (patch.pesoMeta !== undefined) row["peso_meta"] = patch.pesoMeta;
  if (patch.dataNascimento !== undefined) row["data_nascimento"] = patch.dataNascimento || null;
  if (patch.sexo !== undefined) row["sexo"] = patch.sexo;
  if (patch.nivelAtividade !== undefined) row["nivel_atividade"] = patch.nivelAtividade;
  if (patch.objetivo !== undefined) row["objetivo"] = patch.objetivo;
  if (patch.dataMeta !== undefined) row["data_meta"] = patch.dataMeta || null;
  if (patch.medidas !== undefined) row["medidas"] = patch.medidas;
  if (patch.treino !== undefined) row["treino"] = patch.treino;
  if (patch.dieta !== undefined) row["dieta"] = patch.dieta;
  if (patch.onboardingCompleto !== undefined) row["onboarding_completo"] = patch.onboardingCompleto;
  return row;
}

/* ------------------------------------------------------------------ */
/* local cache (keeps all existing sync components working)            */
/* ------------------------------------------------------------------ */

function readCache(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function writeCache(p: UserProfile | null) {
  if (typeof window === "undefined") return;
  if (p) localStorage.setItem(CACHE_KEY, JSON.stringify(p));
  else localStorage.removeItem(CACHE_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function getCurrentUser(): UserProfile | null {
  return readCache();
}

/* ------------------------------------------------------------------ */
/* auth + profile                                                      */
/* ------------------------------------------------------------------ */

async function fetchIsAdmin(userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  return data === true;
}

export async function loadProfile(): Promise<UserProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) {
    writeCache(null);
    return null;
  }
  const { data: row } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!row) return null;
  const isAdmin = await fetchIsAdmin(user.id);
  const profile = rowToProfile(row as ProfileRow, isAdmin);
  writeCache(profile);
  void supabase.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", user.id);
  return profile;
}

export async function login(email: string, password: string): Promise<UserProfile | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return null;
  return loadProfile();
}

export async function logout() {
  writeCache(null);
  await supabase.auth.signOut();
}

export async function registerUser(u: UserProfile): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase.auth.signUp({
    email: u.email,
    password: u.password ?? "",
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: {
        name: u.name,
        initials: u.initials ?? initialsOf(u.name),
        data_nascimento: u.dataNascimento ?? "",
        sexo: u.sexo ?? "",
      },
    },
  });
  if (error) return { ok: false, error: error.message };
  if (!data.session) {
    const signIn = await supabase.auth.signInWithPassword({
      email: u.email,
      password: u.password ?? "",
    });
    if (signIn.error) return { ok: false, error: signIn.error.message };
  }
  // mark not welcomed so the dashboard shows the welcome balloon
  if (typeof window !== "undefined") {
    const welcomed = JSON.parse(localStorage.getItem(WELCOMED_KEY) || "[]") as string[];
    localStorage.setItem(
      WELCOMED_KEY,
      JSON.stringify(welcomed.filter((e) => e !== u.email)),
    );
  }
  await loadProfile();
  return { ok: true };
}

export function updateCurrentUser(patch: Partial<UserProfile>) {
  const cur = readCache();
  if (!cur) return;
  writeCache({ ...cur, ...patch, isNew: false });
  if (cur.id) {
    void supabase.from("profiles").update(patchToRow(patch) as never).eq("id", cur.id);
  }
}

export function consumeWelcome(email: string): boolean {
  if (typeof window === "undefined") return false;
  const welcomed = JSON.parse(localStorage.getItem(WELCOMED_KEY) || "[]") as string[];
  if (welcomed.includes(email)) return false;
  welcomed.push(email);
  localStorage.setItem(WELCOMED_KEY, JSON.stringify(welcomed));
  return true;
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    const refresh = () => setUser(readCache());
    refresh();
    void loadProfile();
    window.addEventListener(EVENT, refresh);
    window.addEventListener("storage", refresh);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") writeCache(null);
      else void loadProfile();
    });
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener("storage", refresh);
      sub.subscription.unsubscribe();
    };
  }, []);
  return user;
}
