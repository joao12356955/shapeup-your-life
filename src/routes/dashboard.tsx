import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function UserMenu() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-card border border-border pl-1 pr-3 py-1 hover:border-primary/50 transition">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-sm">JV</div>
          <ChevronDown size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>
          <div className="font-semibold">João Victor</div>
          <div className="text-xs text-muted-foreground font-normal">Nível 12</div>
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

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — ShapeUp" }],
  }),
  component: Dashboard,
});

const weightData = [
  { d: "10/07", kg: 82 }, { d: "13/07", kg: 81.2 }, { d: "17/07", kg: 80.5 },
  { d: "20/07", kg: 79.8 }, { d: "24/07", kg: 79.3 }, { d: "27/07", kg: 78.9 },
  { d: "31/07", kg: 78.6 }, { d: "04/08", kg: 78.5 }, { d: "08/08", kg: 78.4 },
];

const macroData = [
  { name: "Carbs", value: 45, color: "oklch(0.62 0.24 295)" },
  { name: "Proteínas", value: 30, color: "oklch(0.65 0.22 340)" },
  { name: "Gorduras", value: 25, color: "oklch(0.78 0.17 70)" },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <header className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              Olá, João! <span className="text-2xl">👋</span>
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
          <UserMenu />
        </header>

        {/* Stats row */}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <StatCard icon={Scale} label="Peso atual" value="78.4" unit="kg" trend="2.6 kg" hint="desde o início" />
          <StatCard icon={Target} label="Meta" value="72.0" unit="kg" hint="Faltam 6.4 kg" />
          <StatCard icon={Flame} label="Dias no desafio" value="8" unit="/ 30" hint="26 dias restantes" />
          <StatCard icon={CheckCircle2} label="Treinos concluídos" value="12" unit="/ 16" hint="75% concluído" />

          {/* Calendar mini */}
          <div className="col-span-2 lg:col-span-2 xl:col-span-1 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Desafio 30D</div>
              <CalendarDays size={16} className="text-muted-foreground" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Agosto 2024</div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
              {["D","S","T","Q","Q","S","S"].map((d, i) => <div key={i}>{d}</div>)}
              {[4,5,6,7,8,9,10].map((n) => (
                <div
                  key={n}
                  className={`py-1 rounded-md text-xs ${n === 8 ? "bg-gradient-primary text-primary-foreground font-bold" : "text-foreground/80"}`}
                >
                  {n}
                </div>
              ))}
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
                      data={[{ v: 75 }, { v: 25 }]}
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
                  <span className="text-xl font-bold">75<span className="text-xs text-muted-foreground">%</span></span>
                  <span className="text-[10px] text-muted-foreground">Meta semanal</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {[
                  { l: "Treinos", v: "3 / 4", pct: 75 },
                  { l: "Dieta", v: "5 / 7", pct: 71 },
                  { l: "Água", v: "6 / 7", pct: 85 },
                ].map((r) => (
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
                { icon: Dumbbell, title: "Treino A", sub: "Peito • Ombro • Tríceps", action: "Concluído", done: true },
                { icon: UtensilsCrossed, title: "Alimentação", sub: "2/4 refeições registradas", action: "Registrar" },
                { icon: Droplet, title: "Ingestão de água", sub: "6 / 7 copos", action: "Registrar" },
                { icon: Scale, title: "Peso", sub: "78.4 kg registrado hoje", action: "Ver histórico" },
              ].map((it) => {
                const Icon = it.icon;
                return (
                  <div key={it.title} className="flex items-center gap-3 rounded-xl bg-secondary/40 border border-border p-3 hover:border-primary/50 transition">
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
                  </div>
                );
              })}
            </div>
          </div>

          {/* Próximo treino */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Próximo treino</h2>
            <div className="relative rounded-xl overflow-hidden">
              <img src={workoutImg} alt="Treino B" className="w-full h-44 object-cover" loading="lazy" width={768} height={512} />
              <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-medium">Amanhã</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-lg font-bold">Treino B</div>
              <div className="text-sm text-muted-foreground">Costas • Bíceps • Posterior</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={12} /> 60 min</span>
                <span className="flex items-center gap-1"><Flame size={12} /> Avançado</span>
              </div>
            </div>
            <button className="mt-4 w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition">
              Ver detalhes
            </button>
          </div>

          {/* Macros + Água */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold mb-3">Macronutrientes</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-28 w-28 shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={macroData} dataKey="value" innerRadius={36} outerRadius={50} stroke="none">
                        {macroData.map((m) => <Cell key={m.name} fill={m.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold">1.842</span>
                    <span className="text-[10px] text-muted-foreground">kcal</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  {[
                    { name: "Carboidratos", pct: "45%", g: "207g", c: "oklch(0.62 0.24 295)" },
                    { name: "Proteínas", pct: "30%", g: "138g", c: "oklch(0.65 0.22 340)" },
                    { name: "Gorduras", pct: "25%", g: "51g", c: "oklch(0.78 0.17 70)" },
                  ].map((m) => (
                    <div key={m.name}>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: m.c }} />
                        <span className="font-medium">{m.name}</span>
                      </div>
                      <div className="text-muted-foreground pl-4">{m.pct} / {m.g}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Ingestão de água</h2>
                <span className="text-xs text-muted-foreground">6 / 7 copos</span>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 w-7 rounded-md bg-gradient-primary shadow-glow" />
                ))}
                <div className="h-10 w-7 rounded-md border border-dashed border-primary/50 flex items-center justify-center">
                  <Plus size={14} className="text-primary-glow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
