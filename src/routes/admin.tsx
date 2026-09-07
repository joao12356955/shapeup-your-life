import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Users, Dumbbell, Droplets, UtensilsCrossed, Search, RefreshCw, Trophy, Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { TopBar } from "@/components/shapeup/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/user-store";
import { MEAL_SLOTS, WATER_GOAL_ML, type DayLog, type LogMap, type MealEntry } from "@/lib/daily-store";
import { totalXp, XP_PER_LEVEL } from "@/lib/xp";
import {
  useChallenges,
  saveChallenge,
  deleteChallenge,
  emptyDraft,
  draftFrom,
  fmtDate,
  daysBetween,
  type Challenge,
  type ChallengeDraft,
} from "@/lib/challenges";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração de usuários — ShapeUp" },
      { name: "description", content: "Painel administrativo com a lista de usuários cadastrados no ShapeUp e suas métricas de uso." },
      { property: "og:title", content: "Administração — ShapeUp" },
      { property: "og:description", content: "Usuários cadastrados e métricas de uso do ShapeUp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Row = {
  id: string;
  email: string;
  name: string;
  objetivo: string | null;
  peso: number | null;
  altura: number | null;
  onboarding_completo: boolean;
  created_at: string;
  last_seen_at: string;
};

type LogRow = {
  user_id: string;
  day: string;
  water_ml: number;
  meals: unknown;
  weight_kg: number | null;
  workout_done: boolean;
};

type UserMetrics = {
  profile: Row;
  xp: number;
  level: number;
  workouts: number;
  meals: number;
  waterL: number;
  daysWithGoal: number;
  activeDays: number;
};

function fmt(d: string) {
  return new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function AdminPage() {
  const user = useCurrentUser();
  const [rows, setRows] = useState<UserMetrics[] | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: logs }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("daily_logs").select("user_id, day, water_ml, meals, weight_kg, workout_done"),
    ]);
    const byUser = new Map<string, LogMap>();
    for (const l of (logs ?? []) as LogRow[]) {
      const map = byUser.get(l.user_id) ?? {};
      map[l.day] = {
        waterMl: l.water_ml ?? 0,
        meals: (l.meals as MealEntry[]) ?? [],
        weightKg: l.weight_kg ?? undefined,
        workoutDone: l.workout_done,
      };
      byUser.set(l.user_id, map);
    }
    const metrics = ((profiles ?? []) as Row[]).map((p) => {
      const map = byUser.get(p.id) ?? {};
      const days = Object.values(map) as DayLog[];
      const xp = totalXp(map);
      return {
        profile: p,
        xp,
        level: Math.floor(xp / XP_PER_LEVEL),
        workouts: days.filter((d) => d.workoutDone).length,
        meals: days.reduce((a, d) => a + (d.meals?.length ?? 0), 0),
        waterL: days.reduce((a, d) => a + (d.waterMl ?? 0), 0) / 1000,
        daysWithGoal: days.filter((d) => (d.waterMl ?? 0) >= WATER_GOAL_ML).length,
        activeDays: days.filter(
          (d) => (d.waterMl ?? 0) > 0 || (d.meals?.length ?? 0) > 0 || d.workoutDone,
        ).length,
      };
    });
    setRows(metrics);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.isAdmin) void load();
  }, [user?.isAdmin]);

  if (!user) {
    return (
      <Shell>
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Carregando…
        </div>
      </Shell>
    );
  }

  if (!user.isAdmin) {
    return (
      <Shell>
        <div className="rounded-2xl border border-border bg-gradient-card p-10 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
            <Shield size={22} className="text-primary-glow" />
          </div>
          <h2 className="text-xl font-bold">Área restrita</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Esta página é exclusiva para administradores. Entre com a conta de administrador para ver
            os usuários cadastrados.
          </p>
          <Link to="/dashboard" className="inline-block rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
            Voltar ao dashboard
          </Link>
        </div>
      </Shell>
    );
  }

  const list = (rows ?? []).filter((r) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return r.profile.name.toLowerCase().includes(s) || r.profile.email.toLowerCase().includes(s);
  });

  const totals = {
    users: rows?.length ?? 0,
    workouts: (rows ?? []).reduce((a, r) => a + r.workouts, 0),
    meals: (rows ?? []).reduce((a, r) => a + r.meals, 0),
    waterL: (rows ?? []).reduce((a, r) => a + r.waterL, 0),
  };

  return (
    <Shell>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} label="Usuários cadastrados" value={String(totals.users)} />
        <Kpi icon={Dumbbell} label="Treinos registrados" value={String(totals.workouts)} />
        <Kpi icon={UtensilsCrossed} label="Refeições registradas" value={String(totals.meals)} />
        <Kpi icon={Droplets} label="Água registrada" value={`${totals.waterL.toFixed(1)} L`} />
      </div>

      <ChallengesAdmin />



      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
          <div className="font-semibold flex-1 min-w-40">Usuários</div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome ou e-mail"
              className="rounded-full bg-secondary/60 border border-border pl-9 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => void load()}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm hover:border-primary/50 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Atualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-muted-foreground">
              <tr className="text-left">
                <Th>Usuário</Th>
                <Th>Objetivo</Th>
                <Th>Peso / Altura</Th>
                <Th>Nível / XP</Th>
                <Th>Treinos</Th>
                <Th>Refeições</Th>
                <Th>Água</Th>
                <Th>Dias ativos</Th>
                <Th>Cadastro</Th>
                <Th>Último acesso</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((r) => (
                <tr key={r.profile.id} className="hover:bg-primary/5">
                  <Td>
                    <div className="font-medium">{r.profile.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.profile.email}</div>
                    {!r.profile.onboarding_completo && (
                      <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                        onboarding pendente
                      </span>
                    )}
                  </Td>
                  <Td>{r.profile.objetivo ?? "—"}</Td>
                  <Td>
                    {r.profile.peso ? `${r.profile.peso} kg` : "—"}
                    {r.profile.altura ? ` / ${r.profile.altura} cm` : ""}
                  </Td>
                  <Td>
                    <span className="font-semibold">Nv {r.level}</span>{" "}
                    <span className="text-muted-foreground">• {r.xp} XP</span>
                  </Td>
                  <Td>{r.workouts}</Td>
                  <Td>
                    {r.meals}
                    <span className="text-muted-foreground"> / {MEAL_SLOTS.length}/dia</span>
                  </Td>
                  <Td>
                    {r.waterL.toFixed(1)} L
                    <div className="text-xs text-muted-foreground">{r.daysWithGoal} dias na meta</div>
                  </Td>
                  <Td>{r.activeDays}</Td>
                  <Td className="text-muted-foreground">{fmt(r.profile.created_at)}</Td>
                  <Td className="text-muted-foreground">{fmt(r.profile.last_seen_at)}</Td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-muted-foreground">
                    {rows === null ? "Carregando usuários…" : "Nenhum usuário encontrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 pt-20 lg:p-8 lg:pt-8 space-y-6">
        <TopBar title="Administração" subtitle="Usuários cadastrados e métricas de uso" />
        {children}
      </main>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
        <Icon size={18} className="text-primary-glow" />
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider whitespace-nowrap">{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top whitespace-nowrap ${className}`}>{children}</td>;
}

/* -------------------------------------------------------------- */
/* Desafios                                                        */
/* -------------------------------------------------------------- */

const inputCls =
  "w-full rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ChallengesAdmin() {
  const { challenges, reload } = useChallenges();
  const [draft, setDraft] = useState<ChallengeDraft | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ChallengeDraft>(key: K, value: ChallengeDraft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const submit = async () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      toast.error("Dê um título ao desafio.");
      return;
    }
    if (draft.end_date < draft.start_date) {
      toast.error("A data final deve ser depois da inicial.");
      return;
    }
    setSaving(true);
    const err = await saveChallenge(draft);
    setSaving(false);
    if (err) {
      toast.error("Não foi possível salvar", { description: err });
      return;
    }
    toast.success(draft.id ? "Desafio atualizado!" : "Desafio lançado! 🏆");
    setDraft(null);
    void reload();
  };

  const remove = async (c: Challenge) => {
    const err = await deleteChallenge(c.id);
    if (err) {
      toast.error("Não foi possível excluir", { description: err });
      return;
    }
    toast.success("Desafio excluído.");
    void reload();
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
        <div className="font-semibold flex-1 min-w-40 flex items-center gap-2">
          <Trophy size={16} className="text-primary-glow" /> Desafios
        </div>
        <button
          onClick={() => setDraft(draft ? null : emptyDraft())}
          className="flex items-center gap-2 rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus size={14} /> {draft ? "Fechar formulário" : "Novo desafio"}
        </button>
      </div>

      {draft && (
        <div className="border-b border-border p-4 space-y-4 bg-secondary/20">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Título">
              <input className={inputCls} value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Desafio 30 dias" />
            </Field>
            <Field label="Imagem do banner (link)">
              <input className={inputCls} value={draft.banner_url} onChange={(e) => set("banner_url", e.target.value)} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Descrição">
            <textarea
              className={`${inputCls} min-h-20`}
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="O que o participante vai fazer nesse desafio"
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Início">
              <input type="date" className={inputCls} value={draft.start_date} onChange={(e) => set("start_date", e.target.value)} />
            </Field>
            <Field label="Fim">
              <input type="date" className={inputCls} value={draft.end_date} onChange={(e) => set("end_date", e.target.value)} />
            </Field>
            <Field label="Treinos por semana">
              <input type="number" min={0} max={7} className={inputCls} value={draft.workout_frequency} onChange={(e) => set("workout_frequency", Number(e.target.value))} />
            </Field>
            <Field label="Refeições por dia">
              <input type="number" min={1} max={8} className={inputCls} value={draft.meals_per_day} onChange={(e) => set("meals_per_day", Number(e.target.value))} />
            </Field>
            <Field label="XP de recompensa">
              <input type="number" min={0} step={50} className={inputCls} value={draft.xp_reward} onChange={(e) => set("xp_reward", Number(e.target.value))} />
            </Field>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Orientações de alimentação">
              <textarea className={`${inputCls} min-h-16`} value={draft.diet_notes} onChange={(e) => set("diet_notes", e.target.value)} />
            </Field>
            <Field label="Orientações de treino">
              <textarea className={`${inputCls} min-h-16`} value={draft.workout_notes} onChange={(e) => set("workout_notes", e.target.value)} />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={draft.published} onChange={(e) => set("published", e.target.checked)} />
              Visível para os usuários
            </label>
            <div className="flex-1" />
            <button onClick={() => setDraft(null)} className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/50 transition">
              Cancelar
            </button>
            <button
              onClick={() => void submit()}
              disabled={saving}
              className="rounded-lg bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {saving ? "Salvando…" : draft.id ? "Salvar alterações" : "Lançar desafio"}
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {challenges === null && <div className="p-8 text-center text-muted-foreground">Carregando desafios…</div>}
        {challenges?.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">Nenhum desafio lançado ainda.</div>
        )}
        {(challenges ?? []).map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/40 flex items-center justify-center">
              {c.banner_url ? (
                <img src={c.banner_url} alt={`Banner do ${c.title}`} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <ImageIcon size={18} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-48">
              <div className="flex items-center gap-2">
                <span className="font-medium">{c.title}</span>
                {!c.published && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">rascunho</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {fmtDate(c.start_date)} → {fmtDate(c.end_date)} • {daysBetween(c.start_date, c.end_date)} dias
              </div>
              <div className="text-xs text-muted-foreground">
                {c.workout_frequency} treinos/semana • {c.meals_per_day} refeições/dia • +{c.xp_reward} XP
              </div>
            </div>
            <button
              onClick={() => setDraft(draftFrom(c))}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:border-primary/50 transition"
            >
              <Pencil size={13} /> Editar
            </button>
            <button
              onClick={() => void remove(c)}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-destructive hover:border-destructive/60 transition"
            >
              <Trash2 size={13} /> Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
