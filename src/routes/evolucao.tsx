import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Scale,
  Target,

  Activity,
  Droplets,
  Heart,
  User as UserIcon,
  LogOut,
  Plus,
  ArrowRight,
  Calendar as CalendarIcon,
  Info,
  Trophy,
  Dumbbell,
  UtensilsCrossed,
  Ruler,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { useCurrentUser, initialsOf } from "@/lib/user-store";
import { useXp } from "@/lib/xp";
import { useStats } from "@/lib/stats";

import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export const Route = createFileRoute("/evolucao")({
  head: () => ({ meta: [{ title: "Evolução — ShapeUp" }] }),
  component: EvolucaoPage,
});

function UserMenu() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const xp = useXp(user?.email);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-card border border-border pl-1 pr-3 py-1 hover:border-primary/50 transition">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-sm">{user?.initials ?? (user ? initialsOf(user.name) : "--")}</div>
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <div className="font-semibold">{user?.name ?? "Visitante"}</div>
          <div className="text-xs text-muted-foreground font-normal">
            Nível {xp.level} • {xp.total} XP
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon size={14} className="mr-2" /> Meu perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate({ to: "/" })}
          className="text-destructive focus:text-destructive"
        >
          <LogOut size={14} className="mr-2" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PURPLE = "oklch(0.62 0.24 295)";
const PURPLE_GLOW = "oklch(0.78 0.18 320)";

const MEDIDA_LABELS: Record<string, string> = {
  peito: "Peito",
  cintura: "Cintura",
  quadril: "Quadril",
  braco: "Braço",
  coxa: "Coxa",
};


function DeltaPill({ trend, label }: { trend: "up" | "down" | "neutral"; label: string }) {
  const color =
    trend === "up" ? "text-emerald-400" :
    trend === "down" ? "text-rose-400" :
    "text-emerald-400";
  const Arrow = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  return (
    <span className={`text-xs font-semibold inline-flex items-center gap-1 ${color}`}>
      {Arrow && <Arrow size={12} />}
      {label}
    </span>
  );
}

function EvolucaoPage() {
  const user = useCurrentUser();
  const s = useStats(user);
  const one = (v?: number) => (typeof v === "number" ? v.toFixed(1) : "—");
  const [hoje, setHoje] = useState("—");
  useEffect(() => setHoje(new Date().toLocaleDateString("pt-BR")), []);
  const inicio = s.weights[0]?.key
    ? s.weights[0]!.key.split("-").reverse().join("/")
    : hoje;



  const metrics = [
    {
      icon: Scale,
      label: "Peso atual",
      value: one(s.peso),
      unit: "kg",
      delta:
        s.pesoDelta !== undefined
          ? `${Math.abs(s.pesoDelta).toFixed(1)} kg`
          : "Sem registros",
      trend: (s.pesoDelta === undefined ? "neutral" : s.pesoDelta < 0 ? "down" : "up") as
        | "up"
        | "down"
        | "neutral",
      sub: s.pesoDelta !== undefined ? "desde o início" : "",
    },
    {
      icon: Target,
      label: "Meta de peso",
      value: one(s.pesoMeta),
      unit: "kg",
      delta:
        s.peso && s.pesoMeta
          ? `${Math.abs(s.peso - s.pesoMeta).toFixed(1)} kg restantes`
          : "Defina sua meta",
      trend: "neutral" as const,
      sub: "",
    },
    {
      icon: Heart,
      label: "IMC",
      value: s.imc ? s.imc.toFixed(1) : "—",
      unit: "",
      delta: s.imcLabel,
      trend: "neutral" as const,
      sub: s.altura ? `${s.altura} cm` : "",
    },
    {
      icon: Droplets,
      label: "Água (média)",
      value: s.avgWaterMl ? (s.avgWaterMl / 1000).toFixed(1) : "—",
      unit: "L/dia",
      delta: `${s.waterGoalDays} dia(s) na meta`,
      trend: "neutral" as const,
      sub: "",
    },
    {
      icon: Dumbbell,
      label: "Treinos concluídos",
      value: String(s.workoutsDone),
      unit: "treinos",
      delta: `${s.streak} dia(s) de sequência`,
      trend: "neutral" as const,
      sub: "",
    },
    {
      icon: Activity,
      label: "Dias registrados",
      value: String(s.daysLogged),
      unit: "dias",
      delta: `${s.mealDays} dia(s) com refeições`,
      trend: "neutral" as const,
      sub: "",
    },
  ];

  const weightData = s.weights.map((w) => ({ d: w.d, v: w.kg }));
  const weightMin = weightData.length ? Math.min(...weightData.map((w) => w.v)) - 2 : 60;
  const weightMax = weightData.length ? Math.max(...weightData.map((w) => w.v)) + 2 : 100;

  const medidas = Object.entries(MEDIDA_LABELS)
    .map(([k, name]) => ({
      name,
      value: (s.medidas as Record<string, number | undefined>)[k],
    }))
    .filter((m) => typeof m.value === "number");

  const treinosRecentes = s.weeklyWorkouts.slice(-6);

  return (

    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <header className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary-glow" /> Evolução
            </h1>
            <p className="text-sm text-muted-foreground">Acompanhe sua jornada e veja sua transformação.</p>
          </div>
          <div className="hidden md:flex relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar métricas, registros..."
              className="w-full rounded-full bg-card border border-border pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <HoverCard openDelay={100} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                onClick={() =>
                  toast("📈 Novo desafio para você!", {
                    description: "Perca 1 kg nas próximas 2 semanas e ganhe XP bônus.",
                  })
                }
                className="relative h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition"
              >
                <Bell size={16} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-glow" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="end" className="w-80 p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="font-semibold text-sm">Notificações</div>
                <span className="text-[10px] uppercase tracking-wider text-primary-glow">3 novas</span>
              </div>
              <div className="divide-y divide-border">
                {[
                  { icon: Trophy, title: "Novo desafio para você!", desc: "Perca 1 kg nas próximas 2 semanas.", time: "agora" },
                  { icon: Ruler, title: "Hora de medir 📏", desc: "Registre suas medidas semanais.", time: "2h" },
                  { icon: Dumbbell, title: "Recorde batido 🔥", desc: "Você superou seu PR no supino!", time: "ontem" },
                ].map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.title} className="flex gap-3 px-4 py-3 hover:bg-primary/10 transition cursor-pointer">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary-glow">
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{n.desc}</div>
                      </div>
                      <div className="text-[10px] text-muted-foreground shrink-0">{n.time}</div>
                    </div>
                  );
                })}
              </div>
            </HoverCardContent>
          </HoverCard>
          <UserMenu />
        </header>

        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:border-primary/50 transition">
            <CalendarIcon size={14} className="text-primary-glow" />
            {inicio} — {hoje}
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-2xl bg-gradient-card border border-border p-4 shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary-glow mb-3">
                  <Icon size={16} />
                </div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{m.value}</span>
                  {m.unit && <span className="text-xs text-muted-foreground">{m.unit}</span>}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <DeltaPill trend={m.trend} label={m.delta} />
                  {m.sub && <span className="text-[10px] text-muted-foreground">{m.sub}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress photos + Weight chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold flex items-center gap-2">
                Fotos de progresso <Info size={12} className="text-muted-foreground" />
              </div>
              <span className="text-xs rounded-md bg-primary/20 text-primary-glow px-2 py-1">{hoje}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="rounded-xl border border-border bg-secondary/40 aspect-[3/4] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                <span className="absolute top-2 left-2 text-xs rounded bg-background/70 px-2 py-0.5">{inicio}</span>
                <div className="text-5xl opacity-30">👤</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-full border-2 border-primary flex items-center justify-center text-primary-glow">
                  <ArrowRight size={20} />
                </div>
                <div className="text-3xl font-bold leading-none">{s.daysLogged}</div>
                <div className="text-xs text-muted-foreground">dias</div>
                <div className="text-[10px] text-muted-foreground">de evolução</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 aspect-[3/4] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                <span className="absolute top-2 left-2 text-xs rounded bg-background/70 px-2 py-0.5">{hoje}</span>
                <div className="text-5xl opacity-30">💪</div>
              </div>
            </div>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm text-primary-glow hover:bg-primary/10 transition">
              <Plus size={14} /> Adicionar nova foto
            </button>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold flex items-center gap-2">
                Evolução do peso <Info size={12} className="text-muted-foreground" />
              </div>
              <button className="text-xs rounded-md border border-border px-2 py-1 inline-flex items-center gap-1 hover:border-primary/50">
                Últimos 30 dias <ChevronDown size={12} />
              </button>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="weight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PURPLE_GLOW} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.3 0.05 290)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="d" stroke="oklch(0.65 0.05 290)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.65 0.05 290)" fontSize={10} domain={[Math.floor(weightMin), Math.ceil(weightMax)]} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.18 0.05 290)",
                      border: "1px solid oklch(0.35 0.1 290)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="v" stroke={PURPLE_GLOW} strokeWidth={2.5} dot={{ r: 3, fill: PURPLE_GLOW }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medidas corporais */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold flex items-center gap-2">
                Medidas corporais <Info size={12} className="text-muted-foreground" />
              </div>
              <button className="text-xs rounded-md border border-border px-2 py-1 inline-flex items-center gap-1 hover:border-primary/50">
                {hoje} <ChevronDown size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {medidas.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhuma medida registrada ainda. Adicione suas medidas nas configurações.
                </p>
              )}
              {medidas.map((m) => (
                <div key={m.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-primary/15 flex items-center justify-center text-primary-glow">
                      <Ruler size={12} />
                    </div>
                    {m.name}
                  </div>
                  <span className="font-semibold">{m.value} cm</span>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full rounded-lg bg-primary/10 text-primary-glow text-sm py-2 hover:bg-primary/20 transition">
              Ver histórico completo
            </button>
          </div>

          {/* Hábitos registrados */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="font-semibold flex items-center gap-2 mb-4">
              Hábitos registrados <Info size={12} className="text-muted-foreground" />
            </div>
            <div className="space-y-3 text-sm">
              {[
                { l: "Dias com registro", v: `${s.daysLogged} dia(s)` },
                { l: "Treinos concluídos", v: `${s.workoutsDone} treino(s)` },
                { l: "Dias com refeições", v: `${s.mealDays} dia(s)` },
                { l: "Dias na meta de água", v: `${s.waterGoalDays} dia(s)` },
                { l: "Média de água", v: s.avgWaterMl ? `${(s.avgWaterMl / 1000).toFixed(1)} L/dia` : "—" },
                { l: "Média de calorias", v: s.avgKcal ? `${s.avgKcal} kcal` : "—" },
                { l: "Sequência atual", v: `${s.streak} dia(s)` },
                { l: "Melhor sequência", v: `${s.best} dia(s)` },
              ].map((r) => (
                <div key={r.l} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{r.l}</span>
                  <span className="font-semibold">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desempenho */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold flex items-center gap-2">
                Treinos por semana <Info size={12} className="text-muted-foreground" />
              </div>
            </div>
            {treinosRecentes.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Marque seus treinos como concluídos no dashboard para ver sua evolução aqui (+300 XP por treino).
              </p>
            ) : (
              <table className="w-full text-xs">
                <thead className="text-muted-foreground uppercase">
                  <tr className="text-left">
                    <th className="font-medium pb-2">Semana de</th>
                    <th className="font-medium pb-2 text-right">Treinos</th>
                    <th className="font-medium pb-2 text-right">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {treinosRecentes.map((t) => (
                    <tr key={t.w}>
                      <td className="py-2.5">{t.w}</td>
                      <td className="py-2.5 text-right font-semibold">{t.v}</td>
                      <td className="py-2.5 text-right text-emerald-400 font-semibold">+{t.v * 300}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
