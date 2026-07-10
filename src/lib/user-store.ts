import { useEffect, useState } from "react";

const USERS_KEY = "shapeup:users";
const CURRENT_KEY = "shapeup:current-user";
const WELCOMED_KEY = "shapeup:welcomed";

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
  email: string;
  password: string;
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
};

const SEED_USERS: UserProfile[] = [
  {
    email: "teste1@email",
    password: "1234",
    name: "João Victor",
    initials: "JV",
    altura: 178,
    peso: 78.4,
    pesoMeta: 72,
    objetivo: "ganho de massa muscular",
    sexo: "Masculino",
    nivelAtividade: "Moderado",
    onboardingCompleto: true,
    hasSampleData: true,
  },
];


function readUsers(): UserProfile[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(raw) as UserProfile[];
  } catch {
    return SEED_USERS;
  }
}

function writeUsers(users: UserProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event("shapeup:user-changed"));
}

export function login(email: string, password: string): UserProfile | null {
  const users = readUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!found) return null;
  localStorage.setItem(CURRENT_KEY, found.email);
  window.dispatchEvent(new Event("shapeup:user-changed"));
  return found;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_KEY);
  window.dispatchEvent(new Event("shapeup:user-changed"));
}

export function registerUser(u: UserProfile) {
  const users = readUsers();
  const idx = users.findIndex((x) => x.email.toLowerCase() === u.email.toLowerCase());
  const withDefaults = { ...u, initials: u.initials ?? initialsOf(u.name), isNew: false };
  if (idx >= 0) users[idx] = withDefaults;
  else users.push(withDefaults);
  writeUsers(users);
  localStorage.setItem(CURRENT_KEY, u.email);
  // mark not welcomed so dashboard shows welcome balloon
  const welcomed = JSON.parse(localStorage.getItem(WELCOMED_KEY) || "[]") as string[];
  const filtered = welcomed.filter((e) => e !== u.email);
  localStorage.setItem(WELCOMED_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("shapeup:user-changed"));
}

export function updateCurrentUser(patch: Partial<UserProfile>) {
  const cur = getCurrentUser();
  if (!cur) return;
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === cur.email);
  if (idx < 0) return;
  users[idx] = { ...users[idx], ...patch, isNew: false };
  writeUsers(users);
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const email = localStorage.getItem(CURRENT_KEY);
  if (!email) return null;
  return readUsers().find((u) => u.email === email) ?? null;
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
    const refresh = () => setUser(getCurrentUser());
    refresh();
    window.addEventListener("shapeup:user-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("shapeup:user-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return user;
}
