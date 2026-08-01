import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BOTTLE_ML,
  WATER_GOAL_BOTTLES,
  WATER_GOAL_ML,
  dateKey,
  emptyDay,
  sumMacros,
  useDailyLogs,
  weekKeys,
  type DayLog,
} from "@/lib/daily-store";
import { MealDialog, WaterDialog, WeightDialog } from "@/components/shapeup/LogDialogs";

import {
  LogOut,
  User,
  Search,
  Bell,
  ChevronDown,
  Scale,
  Target,
  Flame,
  CheckCircle2,
  CalendarDays,
  Dumbbell,
  UtensilsCrossed,
  Droplet,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import { consumeWelcome, logout, useCurrentUser, initialsOf } from "@/lib/user-store";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { StatCard } from "@/components/shapeup/StatCard";
import workoutImg from "@/assets/workout-pulldown.jpg";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Trophy } from "lucide-react";

function UserMenu() {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const name = user?.name ?? "Convidado";
  const initials = user?.initials ?? initialsOf(name);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-card border border-border pl-1 pr-3 py-1 hover:border-primary/50 transition">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-sm">{initials}</div>
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-muted-foreground font-normal">{user?.email ?? "—"}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/configuracoes" })}>
          <User size={14} className="mr-2" /> Meu perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut size={14} className="mr-2" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — ShapeUp" }],
  }),
  component: Dashboard,
});

const SAMPLE_WEIGHT: { d: string; kg: number }[] = [
  { d: "10/07", kg: 82 }, { d: "13/07", kg: 81.2 }, { d: "17/07", kg: 80.5 },
  { d: "20/07", kg: 79.8 }, { d: "24/07", kg: 79.3 }, { d: "27/07", kg: 78.9 },
  { d: "31/07", kg: 78.6 }, { d: "04/08", kg: 78.5 }, { d: "08/08", kg: 78.4 },
];


const WORKOUT_SPLIT = [
  { name: "Descanso ativo", focus: "Mobilidade • Alongamento", duration: "30 min", level: "Recuperação", rest: true, exercises: [
    { name: "Alongamento dinâmico", sets: "3 x 30s", rest: "20s" },
    { name: "Caminhada leve", sets: "20 min", rest: "-" },
    { name: "Mobilidade de quadril", sets: "3 x 10", rest: "30s" },
  ] },
  { name: "Treino A", focus: "Peito • Ombro • Tríceps", duration: "60 min", level: "Intermediário", exercises: [
    { name: "Supino reto", sets: "4 x 10", rest: "75s" },
    { name: "Supino inclinado halteres", sets: "4 x 10", rest: "60s" },
    { name: "Desenvolvimento militar", sets: "4 x 10", rest: "75s" },
    { name: "Elevação lateral", sets: "3 x 15", rest: "45s" },
    { name: "Tríceps corda", sets: "4 x 12", rest: "45s" },
    { name: "Tríceps francês", sets: "3 x 12", rest: "60s" },
  ] },
  { name: "Treino B", focus: "Costas • Bíceps • Posterior", duration: "60 min", level: "Avançado", exercises: [
    { name: "Puxada frente", sets: "4 x 12", rest: "60s" },
    { name: "Remada curvada", sets: "4 x 10", rest: "75s" },
    { name: "Remada baixa", sets: "3 x 12", rest: "60s" },
    { name: "Pulldown corda", sets: "3 x 15", rest: "45s" },
    { name: "Rosca direta", sets: "4 x 10", rest: "60s" },
    { name: "Rosca martelo", sets: "3 x 12", rest: "45s" },
    { name: "Stiff", sets: "4 x 12", rest: "75s" },
  ] },
  { name: "Treino C", focus: "Pernas • Glúteo • Panturrilha", duration: "70 min", level: "Avançado", exercises: [
    { name: "Agachamento livre", sets: "4 x 10", rest: "90s" },
    { name: "Leg press", sets: "4 x 12", rest: "75s" },
    { name: "Cadeira extensora", sets: "3 x 15", rest: "45s" },
    { name: "Mesa flexora", sets: "3 x 12", rest: "45s" },
    { name: "Elevação de quadril", sets: "4 x 12", rest: "60s" },
    { name: "Panturrilha em pé", sets: "4 x 20", rest: "30s" },
  ] },
  { name: "Treino A", focus: "Peito • Ombro • Tríceps", duration: "60 min", level: "Intermediário", exercises: [
    { name: "Supino reto", sets: "4 x 10", rest: "75s" },
    { name: "Crucifixo halteres", sets: "3 x 12", rest: "60s" },
    { name: "Desenvolvimento halteres", sets: "4 x 10", rest: "75s" },
    { name: "Tríceps testa", sets: "4 x 12", rest: "60s" },
  ] },
  { name: "Treino B", focus: "Costas • Bíceps", duration: "55 min", level: "Intermediário", exercises: [
    { name: "Barra fixa", sets: "4 x AMRAP", rest: "90s" },
    { name: "Remada cavalinho", sets: "4 x 10", rest: "75s" },
    { name: "Pulldown", sets: "3 x 12", rest: "60s" },
    { name: "Rosca scott", sets: "3 x 12", rest: "60s" },
  ] },
  { name: "Cardio & Core", focus: "HIIT • Abdômen", duration: "40 min", level: "Moderado", exercises: [
    { name: "Corrida intervalada", sets: "10 x 1min", rest: "1min" },
    { name: "Prancha", sets: "3 x 45s", rest: "30s" },
    { name: "Abdominal remador", sets: "4 x 15", rest: "30s" },
    { name: "Mountain climbers", sets: "4 x 40s", rest: "20s" },
  ] },
];

const workoutForDay = (dayIdx: number) => WORKOUT_SPLIT[dayIdx % 7];


function Dashboard() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] ?? "atleta";

  useEffect(() => {
    if (!user) return;
    if (user.isNew || !user.onboardingCompleto) {
      navigate({ to: "/onboarding" });
      return;
    }
    if (consumeWelcome(user.email)) {
      toast(`Bem-vindo, ${user.name}! 🎉`, {
        description: "Que bom te ver por aqui. Bora treinar!",
      });
    }
  }, [user, navigate]);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayNum = today.getDate();
  const monthLabel = today.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  // week starts Sunday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(todayNum - dayOfWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const todaysWorkout = workoutForDay(dayOfWeek);
  const tomorrow = new Date(today);
  tomorrow.setDate(todayNum + 1);
  const tomorrowsWorkout = workoutForDay(tomorrow.getDay());
  const tomorrowLabel = tomorrow.toLocaleDateString("pt-BR", { weekday: "long" });

  const hasSample = !!user?.hasSampleData;
  const meta = user?.pesoMeta ?? 0;

  // ---- registros manuais do dia ----
  const todayKey = dateKey(today);
  const { logs, updateDay } = useDailyLogs(user?.email);
  const day = logs[todayKey] ?? emptyDay;
  const saveToday = (patch: Partial<DayLog>) => updateDay(todayKey, patch);

  const peso = day.weightKg ?? user?.peso ?? 0;
  const diff = Math.max(0, peso - meta).toFixed(1);
  const bottles = Math.round(day.waterMl / BOTTLE_ML);
  const litros = (day.waterMl / 1000).toFixed(1);
  const macros = sumMacros(day.meals);
  const kcalTotal = macros.kcal;
  const macroPct = (grams: number, kcalPerG: number) =>
    kcalTotal > 0 ? Math.round(((grams * kcalPerG) / kcalTotal) * 100) : 0;
  const macroData = [
    { name: "Carboidratos", value: macroPct(macros.carbs, 4) || (kcalTotal ? 0 : 1), grams: macros.carbs, color: "oklch(0.62 0.24 295)" },
    { name: "Proteínas", value: macroPct(macros.protein, 4), grams: macros.protein, color: "oklch(0.65 0.22 340)" },
    { name: "Gorduras", value: macroPct(macros.fat, 9), grams: macros.fat, color: "oklch(0.78 0.17 70)" },
  ];

  const registeredWeights = Object.entries(logs)
    .filter(([, d]) => typeof d.weightKg === "number")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, d]) => ({
      d: `${k.slice(8, 10)}/${k.slice(5, 7)}`,
      kg: d.weightKg as number,
    }));
  const weightData =
    registeredWeights.length > 0
      ? registeredWeights
      : hasSample
        ? SAMPLE_WEIGHT
        : peso > 0
          ? [{ d: "hoje", kg: peso }]
          : [];

  // ---- resumo da semana calculado a partir dos registros ----
  const week = weekKeys(today).map((k) => logs[k] ?? emptyDay);
  const treinosFeitos = week.filter((d) => d.workoutDone).length;
  const treinosMetaNum = 4;
  const dietaDias = week.filter((d) => d.meals.length >= 3).length;
  const aguaDias = week.filter((d) => d.waterMl >= WATER_GOAL_ML).length;
  const pct = (v: number, total: number) => (total > 0 ? Math.round((v / total) * 100) : 0);
  const resumo = [
    { l: "Treinos", v: `${treinosFeitos} / ${treinosMetaNum}`, pct: Math.min(100, pct(treinosFeitos, treinosMetaNum)) },
    { l: "Dieta", v: `${dietaDias} / 7`, pct: pct(dietaDias, 7) },
    { l: "Água", v: `${aguaDias} / 7`, pct: pct(aguaDias, 7) },
  ];
  const metaSemanal = Math.round(resumo.reduce((a, r) => a + r.pct, 0) / resumo.length);

  const diasDesafio = String(Object.values(logs).filter((d) => d.workoutDone).length);
  const treinosConcluidos = String(treinosFeitos);
  const treinosMeta = String(treinosMetaNum);
  const treinoPct = treinosFeitos > 0 ? `${resumo[0].pct}% da meta semanal` : "Comece hoje";
  const desafioHint = Number(diasDesafio) > 0 ? `${Math.max(0, 30 - Number(diasDesafio))} dias restantes` : "Registre seu 1º treino";

  const [waterOpen, setWaterOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);






  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <header className="flex items-center gap-3 sm:gap-4 pl-14 lg:pl-0">

          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              Olá, {firstName}! <span className="text-2xl">👋</span>
            </h1>

            <p className="text-sm text-muted-foreground">Foco hoje, resultado amanhã.</p>
          </div>
          <div className="hidden md:flex relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar..."
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
                  { icon: Trophy, title: "Novo desafio para você!", desc: "Complete 5 treinos esta semana e ganhe XP bônus.", time: "agora" },
                  { icon: Dumbbell, title: "Treino B amanhã", desc: "Costas • Bíceps • Posterior — 60 min", time: "2h" },
                  { icon: Flame, title: "Sequência de 8 dias 🔥", desc: "Continue assim para bater seu recorde!", time: "ontem" },
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
              <button className="w-full py-2.5 text-xs font-medium text-primary-glow hover:bg-primary/10 transition border-t border-border">
                Ver todas as notificações
              </button>
            </HoverCardContent>
          </HoverCard>
          <UserMenu />
        </header>

        {/* Stats row */}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <StatCard icon={Scale} label="Peso atual" value={peso > 0 ? peso.toString() : "—"} unit="kg" hint="atualizado no seu perfil" />
          <StatCard icon={Target} label="Meta" value={meta > 0 ? meta.toString() : "—"} unit="kg" hint={meta > 0 ? `Faltam ${diff} kg` : "Defina sua meta"} />
          <StatCard icon={Flame} label="Dias no desafio" value={diasDesafio} unit="/ 30" hint={desafioHint} />
          <StatCard icon={CheckCircle2} label="Treinos concluídos" value={treinosConcluidos} unit={`/ ${treinosMeta}`} hint={treinoPct} />


          {/* Calendar mini */}
          <div className="col-span-2 lg:col-span-2 xl:col-span-1 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Desafio 30D</div>
              <CalendarDays size={16} className="text-muted-foreground" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground capitalize">{monthLabel}</div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
              {["D","S","T","Q","Q","S","S"].map((d, i) => <div key={i}>{d}</div>)}
              {weekDays.map((d) => {
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <div
                    key={d.toISOString()}
                    className={`py-1 rounded-md text-xs ${isToday ? "bg-gradient-primary text-primary-foreground font-bold" : "text-foreground/80"}`}
                  >
                    {d.getDate()}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Weight progress */}
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Progresso do peso</h2>
              <button className="text-xs text-muted-foreground flex items-center gap-1 rounded-md border border-border px-2 py-1">
                30 dias <ChevronDown size={12} />
              </button>
            </div>
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={weightData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="oklch(0.62 0.24 295)" />
                      <stop offset="100%" stopColor="oklch(0.78 0.18 320)" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 82]} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.17 0.035 280)",
                      border: "1px solid oklch(0.62 0.24 295)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="kg" stroke="url(#lineGrad)" strokeWidth={3} dot={{ fill: "oklch(0.62 0.24 295)", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly summary */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Resumo da semana</h2>
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-28 shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[{ v: metaSemanal }, { v: 100 - metaSemanal }]}
                      dataKey="v"
                      innerRadius={36}
                      outerRadius={50}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      <Cell fill="oklch(0.62 0.24 295)" />
                      <Cell fill="oklch(0.25 0.04 285)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold">{metaSemanal}<span className="text-xs text-muted-foreground">%</span></span>
                  <span className="text-[10px] text-muted-foreground">Meta semanal</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {resumo.map((r) => (
                  <div key={r.l}>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/90">{r.l}</span>
                      <span className="text-muted-foreground">{r.v}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Plano de hoje */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Seu plano de hoje</h2>
            <div className="space-y-3">
              {[
                {
                  icon: Dumbbell,
                  title: todaysWorkout.name,
                  sub: todaysWorkout.rest ? todaysWorkout.focus : day.workoutDone ? "Treino concluído hoje" : todaysWorkout.focus,
                  action: todaysWorkout.rest ? "Descanso" : day.workoutDone ? "Concluído" : "Marcar feito",
                  done: !!todaysWorkout.rest || !!day.workoutDone,
                  onClick: () => {
                    if (todaysWorkout.rest) return;
                    saveToday({ workoutDone: !day.workoutDone });
                    toast(!day.workoutDone ? "Treino marcado como concluído! 💪" : "Treino desmarcado");
                  },
                },
                {
                  icon: UtensilsCrossed,
                  title: "Alimentação",
                  sub: `${day.meals.length}/4 refeições • ${kcalTotal} kcal`,
                  action: "Registrar",
                  done: day.meals.length >= 4,
                  onClick: () => setMealOpen(true),
                },
                {
                  icon: Droplet,
                  title: "Ingestão de água",
                  sub: `${litros} L / ${WATER_GOAL_ML / 1000} L • ${bottles} garrafas`,
                  action: "Registrar",
                  done: day.waterMl >= WATER_GOAL_ML,
                  onClick: () => setWaterOpen(true),
                },
                {
                  icon: Scale,
                  title: "Peso",
                  sub: day.weightKg ? `${day.weightKg} kg registrado hoje` : "Nenhum peso registrado hoje",
                  action: day.weightKg ? "Atualizar" : "Registrar",
                  done: !!day.weightKg,
                  onClick: () => setWeightOpen(true),
                },
              ].map((it) => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.title}
                    onClick={it.onClick}
                    className="w-full text-left flex items-center gap-3 rounded-xl bg-secondary/40 border border-border p-3 hover:border-primary/50 transition"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary-glow">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{it.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{it.sub}</div>
                    </div>
                    <span className={`text-xs rounded-full px-2.5 py-1 ${it.done ? "bg-success/20 text-success" : "bg-primary/20 text-primary-glow"}`}>
                      {it.action}
                    </span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Próximo treino */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Próximo treino</h2>
            <div className="relative rounded-xl overflow-hidden">
              <img src={workoutImg} alt={tomorrowsWorkout.name} className="w-full h-44 object-cover" loading="lazy" width={768} height={512} />
              <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-medium capitalize">
                Amanhã · {tomorrowLabel}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-lg font-bold">{tomorrowsWorkout.name}</div>
              <div className="text-sm text-muted-foreground">{tomorrowsWorkout.focus}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={12} /> {tomorrowsWorkout.duration}</span>
                <span className="flex items-center gap-1"><Flame size={12} /> {tomorrowsWorkout.level}</span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="mt-4 w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition">
                  Ver detalhes
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gradient-card border-border">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Dumbbell size={20} className="text-primary-glow" /> {tomorrowsWorkout.name} — {tomorrowsWorkout.focus}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1"><Clock size={12} /> {tomorrowsWorkout.duration}</span>
                    <span className="flex items-center gap-1"><Flame size={12} /> {tomorrowsWorkout.level}</span>
                    <span className="rounded-full bg-primary/20 text-primary-glow px-2 py-0.5 capitalize">Amanhã · {tomorrowLabel}</span>
                  </DialogDescription>
                </DialogHeader>

                <div className="relative rounded-xl overflow-hidden">
                  <img src={workoutImg} alt={tomorrowsWorkout.name} className="w-full h-48 object-cover" />
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {tomorrowsWorkout.exercises.map((ex, i) => (
                    <div key={ex.name} className="flex items-center gap-3 rounded-xl bg-secondary/40 border border-border p-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary-glow flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{ex.name}</div>
                        <div className="text-xs text-muted-foreground">{ex.sets} • descanso {ex.rest}</div>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>


                <DialogFooter>
                  <button className="w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition">
                    Iniciar treino
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Macros + Água */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold mb-3">Macronutrientes</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-28 w-28 shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={kcalTotal > 0 ? macroData : [{ name: "vazio", value: 1, color: "oklch(0.25 0.04 285)" }]}
                        dataKey="value"
                        innerRadius={36}
                        outerRadius={50}
                        stroke="none"
                      >
                        {(kcalTotal > 0 ? macroData : [{ name: "vazio", value: 1, color: "oklch(0.25 0.04 285)" }]).map((m) => (
                          <Cell key={m.name} fill={m.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold">{kcalTotal.toLocaleString("pt-BR")}</span>
                    <span className="text-[10px] text-muted-foreground">kcal</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  {macroData.map((m) => (
                    <div key={m.name}>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                        <span className="font-medium">{m.name}</span>
                      </div>
                      <div className="text-muted-foreground pl-4">{m.value}% / {m.grams}g</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setMealOpen(true)}
                className="mt-4 w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold shadow-glow hover:opacity-90 transition"
              >
                Registrar alimentação
              </button>
            </div>


            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Ingestão de água</h2>
                <span className="text-xs text-muted-foreground">
                  {litros} L / {WATER_GOAL_ML / 1000} L
                </span>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(bottles, WATER_GOAL_BOTTLES) }).map((_, i) => (
                  <div key={i} className="h-10 w-7 rounded-md bg-gradient-primary shadow-glow" />
                ))}
                {bottles < WATER_GOAL_BOTTLES && (
                  <button
                    onClick={() => setWaterOpen(true)}
                    aria-label="Registrar água"
                    className="h-10 w-7 rounded-md border border-dashed border-primary/50 flex items-center justify-center hover:bg-primary/10 transition"
                  >
                    <Plus size={14} className="text-primary-glow" />
                  </button>
                )}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {bottles} de {WATER_GOAL_BOTTLES} garrafas ({BOTTLE_ML} ml cada)
              </div>
              <button
                onClick={() => setWaterOpen(true)}
                className="mt-3 w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold shadow-glow hover:opacity-90 transition"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>

        <WaterDialog open={waterOpen} onOpenChange={setWaterOpen} day={day} onSave={saveToday} />
        <MealDialog open={mealOpen} onOpenChange={setMealOpen} day={day} onSave={saveToday} />
        <WeightDialog open={weightOpen} onOpenChange={setWeightOpen} day={day} onSave={saveToday} />
      </main>
    </div>
  );
}
