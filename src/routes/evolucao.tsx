import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Scale,
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

const metrics = [
  { icon: Scale, label: "Peso atual", value: "78.4", unit: "kg", delta: "2.6 kg", trend: "down" as const, sub: "desde o início" },
  { icon: Activity, label: "Massa magra", value: "62.1", unit: "kg", delta: "1.8 kg", trend: "up" as const, sub: "desde o início" },
  { icon: Droplets, label: "Gordura corporal", value: "14.2", unit: "%", delta: "2.1 %", trend: "down" as const, sub: "desde o início" },
  { icon: Heart, label: "IMC", value: "24.1", unit: "", delta: "Saudável", trend: "neutral" as const, sub: "" },
  { icon: Droplets, label: "Água corporal", value: "58.7", unit: "%", delta: "3.2 %", trend: "up" as const, sub: "desde o início" },
  { icon: UserIcon, label: "Idade metabólica", value: "28", unit: "anos", delta: "3 anos", trend: "down" as const, sub: "desde o início" },
];

const weightData = [
  { d: "08/05", v: 81 }, { d: "10/05", v: 80.7 }, { d: "12/05", v: 80.3 },
  { d: "14/05", v: 80 }, { d: "16/05", v: 79.6 }, { d: "18/05", v: 79.3 },
  { d: "20/05", v: 79 }, { d: "22/05", v: 78.7 }, { d: "24/05", v: 78.5 },
  { d: "26/05", v: 78.4 }, { d: "28/05", v: 78.5 }, { d: "30/05", v: 78.4 },
  { d: "01/06", v: 78.4 }, { d: "03/06", v: 78.4 }, { d: "05/06", v: 78.3 },
  { d: "08/06", v: 78.4 },
];

const medidas = [
  { name: "Peito", value: "105 cm", delta: "1.5 cm", trend: "down" as const },
  { name: "Cintura", value: "79 cm", delta: "2.0 cm", trend: "down" as const },
  { name: "Abdômen", value: "89 cm", delta: "2.3 cm", trend: "down" as const },
  { name: "Quadril", value: "102 cm", delta: "1.0 cm", trend: "down" as const },
  { name: "Coxa", value: "59 cm", delta: "0 cm", trend: "neutral" as const },
  { name: "Braço", value: "37 cm", delta: "0.5 cm", trend: "up" as const },
];

const medicoes = [
  { name: "Peito", value: "105 cm", delta: "1.5 cm" },
  { name: "Cintura", value: "79 cm", delta: "2.0 cm" },
  { name: "Braço", value: "37 cm", delta: "0.5 cm" },
  { name: "Abdômen", value: "89 cm", delta: "2.3 cm" },
  { name: "Coxa", value: "59 cm", delta: "0 cm" },
  { name: "Panturrilha", value: "38 cm", delta: "0.3 cm" },
];

const exercicios = [
  { name: "Supino Reto", inicial: "70 kg", atual: "80 kg", evo: "14.3%" },
  { name: "Agachamento Smith", inicial: "100 kg", atual: "120 kg", evo: "20.0%" },
  { name: "Puxada Triângulo", inicial: "50 kg", atual: "60 kg", evo: "20.0%" },
  { name: "Desenvolvimento", inicial: "28 kg", atual: "34 kg", evo: "21.4%" },
  { name: "Leg Press 45°", inicial: "180 kg", atual: "220 kg", evo: "22.2%" },
];

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
            08/05/2024 — 08/06/2024
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
              <span className="text-xs rounded-md bg-primary/20 text-primary-glow px-2 py-1">08/06/2024</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="rounded-xl border border-border bg-secondary/40 aspect-[3/4] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                <span className="absolute top-2 left-2 text-xs rounded bg-background/70 px-2 py-0.5">08/05/2024</span>
                <div className="text-5xl opacity-30">👤</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-full border-2 border-primary flex items-center justify-center text-primary-glow">
                  <ArrowRight size={20} />
                </div>
                <div className="text-3xl font-bold leading-none">30</div>
                <div className="text-xs text-muted-foreground">dias</div>
                <div className="text-[10px] text-muted-foreground">de evolução</div>
              </div>
              <div className="rounded-xl border border-border bg-secondary/40 aspect-[3/4] flex flex-col items-center justify-end p-3 relative overflow-hidden">
                <span className="absolute top-2 left-2 text-xs rounded bg-background/70 px-2 py-0.5">08/06/2024</span>
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
                  <YAxis stroke="oklch(0.65 0.05 290)" fontSize={10} domain={[76, 82]} tickLine={false} axisLine={false} />
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
                08/06/2024 <ChevronDown size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {medidas.map((m) => (
                <div key={m.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-primary/15 flex items-center justify-center text-primary-glow">
                      <Ruler size={12} />
                    </div>
                    {m.name}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{m.value}</span>
                    <DeltaPill trend={m.trend} label={m.delta} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full rounded-lg bg-primary/10 text-primary-glow text-sm py-2 hover:bg-primary/20 transition">
              Ver histórico completo
            </button>
          </div>

          {/* Medições corporais visual */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="font-semibold flex items-center gap-2 mb-4">
              Medições corporais <Info size={12} className="text-muted-foreground" />
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
              <div className="space-y-4 text-sm text-right">
                <div>
                  <div className="text-muted-foreground text-xs">Peito</div>
                  <div className="font-semibold">105 cm <span className="text-rose-400 text-xs">↓ 1.5 cm</span></div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Braço</div>
                  <div className="font-semibold">37 cm <span className="text-emerald-400 text-xs">↑ 0.5 cm</span></div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Coxa</div>
                  <div className="font-semibold">59 cm <span className="text-muted-foreground text-xs">— 0 cm</span></div>
                </div>
              </div>
              <div className="flex items-center justify-center h-full">
                <div className="text-7xl opacity-40 text-primary-glow">🧍</div>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">Cintura</div>
                  <div className="font-semibold">79 cm <span className="text-rose-400 text-xs">↓ 2.0 cm</span></div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Abdômen</div>
                  <div className="font-semibold">89 cm <span className="text-rose-400 text-xs">↓ 2.3 cm</span></div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Panturrilha</div>
                  <div className="font-semibold">38 cm <span className="text-emerald-400 text-xs">↑ 0.3 cm</span></div>
                </div>
              </div>
            </div>
            <button className="mt-5 w-full rounded-lg bg-primary/10 text-primary-glow text-sm py-2 hover:bg-primary/20 transition">
              Registrar novas medidas
            </button>
          </div>

          {/* Desempenho */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold flex items-center gap-2">
                Desempenho nos treinos <Info size={12} className="text-muted-foreground" />
              </div>
              <button className="text-xs rounded-md border border-border px-2 py-1 inline-flex items-center gap-1 hover:border-primary/50">
                Tabela completa <ChevronDown size={12} />
              </button>
            </div>
            <table className="w-full text-xs">
              <thead className="text-muted-foreground uppercase">
                <tr className="text-left">
                  <th className="font-medium pb-2">Exercício</th>
                  <th className="font-medium pb-2 text-right">Inicial</th>
                  <th className="font-medium pb-2 text-right">Atual</th>
                  <th className="font-medium pb-2 text-right">Evolução</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exercicios.map((e) => (
                  <tr key={e.name}>
                    <td className="py-2.5">{e.name}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{e.inicial}</td>
                    <td className="py-2.5 text-right font-semibold">{e.atual}</td>
                    <td className="py-2.5 text-right text-emerald-400 font-semibold">↑ {e.evo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-5 w-full rounded-lg bg-primary/10 text-primary-glow text-sm py-2 hover:bg-primary/20 transition">
              Ver todos os exercícios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
