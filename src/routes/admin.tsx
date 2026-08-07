import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Users, Dumbbell, Droplets, UtensilsCrossed, Search, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { TopBar } from "@/components/shapeup/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/user-store";
import { MEAL_SLOTS, WATER_GOAL_ML, type DayLog, type LogMap, type MealEntry } from "@/lib/daily-store";
import { totalXp, XP_PER_LEVEL } from "@/lib/xp";

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
