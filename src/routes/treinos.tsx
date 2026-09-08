import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  ChevronDown,
  Dumbbell,
  Flame,
  Clock,
  Star,
  Trophy,
  CalendarDays,
  ChevronRight,
  LogOut,
  User,
  Play,
  PersonStanding,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { useCurrentUser, initialsOf } from "@/lib/user-store";
import { useXp } from "@/lib/xp";
import { splitFor, workoutForDay, planLabel, WEEK_LABELS } from "@/lib/workout-split";
import { dateKey, emptyDay, useDailyLogs, weekKeys } from "@/lib/daily-store";
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

export const Route = createFileRoute("/treinos")({
  head: () => ({ meta: [{ title: "Treinos — ShapeUp" }] }),
  component: TreinosPage,
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
          <User size={14} className="mr-2" /> Meu perfil
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

const streakData = [
  { d: "D1", v: 2 }, { d: "D2", v: 3 }, { d: "D3", v: 2.5 },
  { d: "D4", v: 4 }, { d: "D5", v: 3.5 }, { d: "D6", v: 5 }, { d: "D7", v: 4.5 },
];

const RANGES = [
  { id: "semana", label: "Esta semana" },
  { id: "mes", label: "Este mês" },
  { id: "trimestre", label: "Últimos 3 meses" },
] as const;
type RangeId = (typeof RANGES)[number]["id"];

const shortLabel = (key: string) => `${key.slice(8, 10)}/${key.slice(5, 7)}`;

/** Barras reais de treinos: por dia (semana) ou por semana (mês / 3 meses). */
function buildWorkoutBars(
  logs: Record<string, { workoutDone?: boolean } | undefined>,
  range: RangeId,
) {
  const todayKey = dateKey();
  if (range === "semana") {
    return weekKeys().map((key) => ({
      d: shortLabel(key),
      v: logs[key]?.workoutDone ? 1 : 0,
      today: key === todayKey,
    }));
  }
  const weeksBack = range === "mes" ? 4 : 12;
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay() - (weeksBack - 1) * 7);
  const bars: { d: string; v: number; today: boolean }[] = [];
  for (let w = 0; w < weeksBack; w++) {
    const from = new Date(start);
    from.setDate(start.getDate() + w * 7);
    let count = 0;
    let isCurrent = false;
    for (let i = 0; i < 7; i++) {
      const d = new Date(from);
      d.setDate(from.getDate() + i);
      const key = dateKey(d);
      if (logs[key]?.workoutDone) count++;
      if (key === todayKey) isCurrent = true;
    }
    bars.push({ d: shortLabel(dateKey(from)), v: count, today: isCurrent });
  }
  return bars;
}


function TreinosPage() {
  const user = useCurrentUser();
  const xp = useXp(user?.email);
  const { logs, updateDay } = useDailyLogs(user?.email);
  const [range, setRange] = useState<RangeId>("semana");
  const bars = useMemo(() => buildWorkoutBars(logs, range), [logs, range]);
  const todayKey = dateKey();

  const today = logs[todayKey] ?? emptyDay;
  const week = weekKeys().map((key) => ({ key, done: !!logs[key]?.workoutDone }));
  const completedThisWeek = week.filter((item) => item.done).length;
  const goal = user?.treino?.diasPorSemana ?? 5;
  const plan = splitFor(user?.objetivo);
  const todayWorkout = workoutForDay(new Date().getDay(), user?.objetivo);
  const exercises = todayWorkout.exercises;
  const workoutPct = Math.min(100, Math.round((completedThisWeek / goal) * 100));
  const completedTotal = Object.entries(logs)
    .filter(([, day]) => day.workoutDone)
    .sort(([a], [b]) => b.localeCompare(a));
  const toggleWorkout = () => {
    updateDay(todayKey, { workoutDone: !today.workoutDone });
    toast(today.workoutDone ? "Treino de hoje desmarcado" : "Treino concluído e sincronizado! 💪");
  };
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <header className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <Dumbbell className="text-primary-glow" /> Treinos
            </h1>
            <p className="text-sm text-muted-foreground">Sua evolução acontece série após série.</p>
          </div>
          <div className="hidden md:flex relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar treinos, exercícios..."
              className="w-full rounded-full bg-card border border-border pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <HoverCard openDelay={100} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                onClick={() =>
                  toast("🔥 Novo desafio para você!", {
                    description: "Complete 5 treinos esta semana e ganhe XP bônus.",
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
                  { icon: Trophy, title: "Novo desafio para você!", desc: "Complete 5 treinos esta semana.", time: "agora" },
                  { icon: Dumbbell, title: "Treino B amanhã", desc: "Costas • Bíceps — 60 min", time: "2h" },
                  { icon: Flame, title: "Sequência de 12 dias 🔥", desc: "Continue para bater seu recorde!", time: "ontem" },
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

        {/* Top row — 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Treino de hoje */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card relative overflow-hidden">
            <div className="text-xs text-muted-foreground border-b border-border/50 pb-1 inline-block">Treino de hoje</div>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <div className="text-2xl font-bold leading-tight">{todayWorkout.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{todayWorkout.focus}</div>
                <div className="text-xs text-muted-foreground">{exercises.length} exercícios • {todayWorkout.duration}</div>
              </div>
              <PersonStanding className="text-primary-glow shrink-0" size={48} />
            </div>
            <button onClick={toggleWorkout} className="mt-5 w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition flex items-center justify-center gap-2">
              <Play size={14} fill="currentColor" /> {today.workoutDone ? "Treino concluído" : "Marcar como concluído"}
            </button>
          </div>

          {/* Streak */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 text-sm">
              <Flame size={16} className="text-primary-glow" />
              <span>Streak de treinos</span>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold">{completedTotal.length} <span className="text-base font-normal text-muted-foreground">dias</span></div>
              <div className="text-xs text-muted-foreground">com treino registrado</div>
              <div className="text-xs text-success mt-1">{completedThisWeek} nesta semana</div>
            </div>
            <div className="h-16 mt-2 -mx-1">
              <ResponsiveContainer>
                <AreaChart data={streakData}>
                  <defs>
                    <linearGradient id="streakGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.62 0.24 295)" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="oklch(0.62 0.24 295)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="oklch(0.78 0.18 320)" strokeWidth={2} fill="url(#streakGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evolução semanal */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="text-sm">Evolução semanal</div>
            <div className="mt-3 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={[{ v: workoutPct }, { v: 100 - workoutPct }]} dataKey="v" innerRadius={26} outerRadius={36} startAngle={90} endAngle={-270} stroke="none">
                      <Cell fill="oklch(0.62 0.24 295)" />
                      <Cell fill="oklch(0.25 0.04 285)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{workoutPct}%</div>
              </div>
              <div className="text-sm">
                <div><span className="text-xl font-bold">{completedThisWeek}</span> de <span className="text-xl font-bold">{goal}</span></div>
                <div className="text-xs text-muted-foreground">treinos concluídos</div>
                <div className="text-xs text-muted-foreground mt-1">Faltam {Math.max(0, goal - completedThisWeek)} treino(s)<br/>para completar</div>
              </div>
            </div>
          </div>

          {/* Próximo desbloqueio */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="text-sm">Próximo desbloqueio</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-primary opacity-30 rounded-xl rotate-45" />
                <Star className="relative text-primary-glow" size={28} fill="currentColor" />
              </div>
              <div>
                <div className="text-xl font-bold">Nível {xp.level + 1}</div>
                <div className="text-xs text-muted-foreground">Faltam {xp.toNext} XP</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-primary" style={{ width: `${xp.pct}%` }} />
              </div>
              <div className="text-[10px] text-muted-foreground text-right mt-1">
                {xp.inLevel} / 1000 XP
              </div>
            </div>
          </div>
        </div>

        {/* Middle — Treino A + Divisão semanal + Shape AI */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Treino A */}
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/30 text-primary-glow flex items-center justify-center font-bold">{todayWorkout.tag}</div>
                <div>
                  <div className="font-semibold">{todayWorkout.name} – {todayWorkout.focus}</div>
                  <div className="text-xs text-muted-foreground">{planLabel(user?.objetivo)} • {todayWorkout.level}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} /> {todayWorkout.duration}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="text-left font-medium pb-2 w-8">#</th>
                    <th className="text-left font-medium pb-2">Exercício</th>
                    <th className="text-left font-medium pb-2">Séries</th>
                    <th className="text-left font-medium pb-2">Repetições</th>
                    <th className="text-left font-medium pb-2">Descanso</th>
                    <th className="text-left font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {exercises.map((e, i) => (
                    <tr key={e.name} className="hover:bg-primary/5 transition">
                      <td className="py-2.5 text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5">{e.name}</td>
                      <td className="py-2.5" colSpan={2}>{e.sets}</td>
                      <td className="py-2.5">{e.rest}</td>
                      <td className="py-2.5">
                        <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="text-xs flex items-center gap-2">
                <Trophy size={14} className="text-primary-glow" />
                O status do treino é atualizado no dashboard e nos desafios.
              </div>
              <button onClick={toggleWorkout} className="text-xs rounded-lg border border-primary/50 px-3 py-1.5 hover:bg-primary/10 transition">
                {today.workoutDone ? "Desmarcar treino" : "Marcar treino concluído"}
              </button>
            </div>
          </div>

          {/* Divisão semanal */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays size={16} className="text-primary-glow" />
              <div className="font-semibold">Divisão semanal</div>
            </div>
            <div className="space-y-2">
              {plan.map((w, i) => (
                <div key={`${w.name}-${i}`} className="flex items-center gap-3 text-sm">
                  <span className="text-xs text-muted-foreground w-8">{WEEK_LABELS[i]}</span>
                  <span className={`text-xs font-bold rounded-md px-2 py-1 w-10 text-center ${w.rest ? "bg-muted text-foreground" : "bg-primary/30 text-primary-glow"}`}>{w.tag}</span>
                  <span className="flex-1 truncate">{w.focus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom — Histórico + Treinos por semana */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Histórico recente</h2>
            <div className="space-y-2">
              {completedTotal.length === 0 && <p className="text-sm text-muted-foreground">Nenhum treino concluído ainda.</p>}
              {completedTotal.slice(0, 5).map(([key]) => (
                <div key={key} className="flex items-center gap-3 rounded-xl bg-secondary/40 border border-border p-3 hover:border-primary/50 transition">
                  <span className="text-xs font-bold rounded-md px-2 py-1 w-10 text-center bg-primary/30 text-primary-glow">✓</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">Treino concluído</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(`${key}T12:00:00`).toLocaleDateString("pt-BR")}</div>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="font-semibold">
                {range === "semana" ? "Treinos por dia" : "Treinos por semana"}
              </h2>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value as RangeId)}
                className="text-xs bg-card text-foreground rounded-md border border-border px-2 py-1 outline-none focus:border-primary"
              >
                {RANGES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={bars} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.18 320)" />
                      <stop offset="100%" stopColor="oklch(0.62 0.24 295)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(0.62 0.24 295)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                    {bars.map((b) => (
                      <Cell
                        key={b.d}
                        fill={b.today ? "oklch(0.86 0.16 100)" : "url(#barGrad)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.86 0.16 100)" }} />
              {range === "semana" ? "Hoje" : "Semana atual"}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
