import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  ChevronDown,
  UtensilsCrossed,
  Flame,
  Drumstick,
  Wheat,
  Droplet,
  Plus,
  LogOut,
  User,
  Sparkles,
  Apple,
  Barcode,
  BookOpen,
  Upload,
  ChevronRight,
  Dumbbell,
  Trophy,
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

export const Route = createFileRoute("/dieta")({
  head: () => ({ meta: [{ title: "Dieta — ShapeUp" }] }),
  component: DietaPage,
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

const PURPLE = "oklch(0.62 0.24 295)";
const PURPLE_GLOW = "oklch(0.78 0.18 320)";

const macros = [
  { icon: Flame, label: "Calorias", value: "2.150", goal: "2.700 kcal", pct: 80, rest: "550 kcal restantes" },
  { icon: Drumstick, label: "Proteínas", value: "168", goal: "180 g", pct: 93, rest: "12 g restantes" },
  { icon: Wheat, label: "Carboidratos", value: "210", goal: "270 g", pct: 78, rest: "60 g restantes" },
  { icon: Droplet, label: "Gorduras", value: "65", goal: "80 g", pct: 81, rest: "15 g restantes" },
];

const refeicoes = [
  {
    hour: "07:30",
    name: "Café da manhã",
    kcal: 620,
    title: "Omelete 3 ovos, Aveia, Banana",
    desc: "3 ovos inteiros, 50g aveia, 1 banana, café sem açúcar",
    p: 35, c: 60, g: 18,
    emoji: "🍳",
  },
  {
    hour: "10:30",
    name: "Lanche da manhã",
    kcal: 250,
    title: "Iogurte Grego, Whey, Castanhas",
    desc: "170g iogurte grego, 1 dose whey, 15g castanhas",
    p: 25, c: 18, g: 8,
    emoji: "🥣",
  },
  {
    hour: "13:00",
    name: "Almoço",
    kcal: 650,
    title: "Arroz, Frango, Feijão, Legumes",
    desc: "150g arroz, 150g frango, 100g feijão, legumes à vontade",
    p: 45, c: 70, g: 15,
    emoji: "🍛",
  },
  {
    hour: "16:30",
    name: "Lanche da tarde",
    kcal: 260,
    title: "Pão Integral, Pasta de Amendoim, Fruta",
    desc: "2 fatias pão integral, 15g pasta de amendoim, 1 maçã",
    p: 10, c: 40, g: 6,
    emoji: "🥪",
  },
  {
    hour: "19:30",
    name: "Jantar",
    kcal: 370,
    title: "Salmão, Batata Doce, Vegetais",
    desc: "150g salmão, 150g batata doce, salada verde",
    p: 28, c: 22, g: 13,
    emoji: "🍣",
  },
];

const consumidos = [
  { emoji: "🍗", name: "Frango", qty: "1,2 kg", pct: 95 },
  { emoji: "🍚", name: "Arroz", qty: "850 g", pct: 80 },
  { emoji: "🥚", name: "Ovos", qty: "24 un", pct: 70 },
  { emoji: "🌾", name: "Aveia", qty: "600 g", pct: 60 },
  { emoji: "🍌", name: "Banana", qty: "14 un", pct: 50 },
];

const evolucao = [
  { d: "Seg", v: 2400 },
  { d: "Ter", v: 2050 },
  { d: "Qua", v: 2600 },
  { d: "Qui", v: 2150 },
  { d: "Sex", v: 2200 },
  { d: "Sáb", v: 2700 },
  { d: "Dom", v: 2500 },
];

const metas = [
  { icon: Flame, label: "Calorias", value: "2.150 / 2.700 kcal", pct: 80 },
  { icon: Drumstick, label: "Proteínas", value: "168 / 180 g", pct: 93 },
  { icon: Wheat, label: "Carboidratos", value: "210 / 270 g", pct: 78 },
  { icon: Droplet, label: "Gorduras", value: "65 / 80 g", pct: 81 },
  { icon: Droplet, label: "Água", value: "2,1 / 3 L", pct: 70 },
];

function DietaPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <header className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="text-primary-glow" /> Dieta
            </h1>
            <p className="text-sm text-muted-foreground">Alimente seu corpo, conquiste seus objetivos.</p>
          </div>
          <div className="hidden md:flex relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar alimentos, refeições..."
              className="w-full rounded-full bg-card border border-border pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <HoverCard openDelay={100} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                onClick={() =>
                  toast("🥗 Novo desafio para você!", {
                    description: "Bata sua meta de proteína 5 dias seguidos e ganhe XP bônus.",
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
                  { icon: Trophy, title: "Novo desafio para você!", desc: "Bata sua meta de proteína por 5 dias.", time: "agora" },
                  { icon: UtensilsCrossed, title: "Hora do almoço 🍛", desc: "Registre sua refeição para somar XP.", time: "1h" },
                  { icon: Dumbbell, title: "Sequência alimentar de 8 dias 🔥", desc: "Continue dentro da meta!", time: "ontem" },
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

        {/* Macro cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {macros.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
                    <Icon size={18} />
                  </div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{m.value}</span>
                  <span className="text-xs text-muted-foreground">/ {m.goal}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${m.pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m.pct}%</span>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">{m.rest}</div>
              </div>
            );
          })}
          {/* Água */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
                  <Droplet size={18} />
                </div>
                <div className="text-sm text-muted-foreground">Água</div>
              </div>
              <button className="h-6 w-6 rounded-md bg-primary/20 text-primary-glow flex items-center justify-center hover:bg-primary/30 transition">
                <Plus size={14} />
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold">2,1</span>
              <span className="text-xs text-muted-foreground">/ 3 L</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-primary" style={{ width: "70%" }} />
              </div>
              <span className="text-[10px] text-muted-foreground">70%</span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">0,9 L restantes</div>
          </div>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Plano alimentar */}
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Plano alimentar de hoje</h2>
            <div className="space-y-3">
              {refeicoes.map((r) => (
                <div key={r.hour} className="flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary-glow shadow-glow" />
                    <div className="flex-1 w-px bg-border mt-1" />
                  </div>
                  <div className="w-24 shrink-0 text-xs">
                    <div className="text-muted-foreground">{r.hour}</div>
                    <div className="font-semibold mt-0.5">{r.name}</div>
                    <div className="text-primary-glow mt-0.5">{r.kcal} kcal</div>
                  </div>
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-secondary/60 border border-border flex items-center justify-center text-2xl">
                    {r.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{r.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{r.desc}</div>
                  </div>
                  <div className="hidden md:flex items-center gap-1">
                    <span className="text-[10px] rounded-md bg-secondary/60 border border-border px-1.5 py-1">P {r.p}g</span>
                    <span className="text-[10px] rounded-md bg-secondary/60 border border-border px-1.5 py-1">C {r.c}g</span>
                    <span className="text-[10px] rounded-md bg-secondary/60 border border-border px-1.5 py-1">G {r.g}g</span>
                  </div>
                  <div className="text-xs text-primary-glow font-semibold shrink-0">{r.kcal} kcal</div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-dashed border-primary/50 py-2.5 text-sm font-medium text-primary-glow hover:bg-primary/10 transition flex items-center justify-center gap-2">
              <Plus size={14} /> Adicionar refeição
            </button>
          </div>

          {/* Distribuição + Alimentos */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold mb-3">Distribuição de macronutrientes</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-28 w-28 shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={[{ v: 31 }, { v: 39 }, { v: 30 }]} dataKey="v" innerRadius={36} outerRadius={52} startAngle={90} endAngle={-270} stroke="none">
                        <Cell fill={PURPLE_GLOW} />
                        <Cell fill={PURPLE} />
                        <Cell fill="oklch(0.35 0.06 285)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold leading-none">2.150</div>
                    <div className="text-[10px] text-muted-foreground">kcal</div>
                  </div>
                </div>
                <div className="text-xs space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary-glow" /> Proteínas</div>
                    <div className="text-muted-foreground">168g (31%)</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> Carboidratos</div>
                    <div className="text-muted-foreground">210g (39%)</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Gorduras</div>
                    <div className="text-muted-foreground">65g (30%)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Alimentos mais consumidos</h2>
                <button className="text-[10px] text-muted-foreground flex items-center gap-1 rounded-md border border-border px-2 py-1">
                  Esta semana <ChevronDown size={10} />
                </button>
              </div>
              <div className="space-y-2.5">
                {consumidos.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 text-sm">
                    <span className="text-lg">{c.emoji}</span>
                    <span className="w-16 shrink-0 text-xs">{c.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">{c.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Evolução nutricional */}
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Evolução nutricional</h2>
              <button className="text-[10px] text-muted-foreground flex items-center gap-1 rounded-md border border-border px-2 py-1">
                Esta semana <ChevronDown size={10} />
              </button>
            </div>
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={evolucao} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="d" tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 285)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 285)" domain={[1000, 3000]} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.03 285)", border: "1px solid oklch(0.3 0.05 285)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="v" stroke={PURPLE_GLOW} strokeWidth={2.5} dot={{ fill: PURPLE_GLOW, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Registro rápido + Shape AI + Meta diária */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold">Sugestão da Shape AI <span className="text-[10px] text-primary-glow ml-1">BETA</span></h2>
              <div className="mt-3 flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary-glow flex items-center justify-center shrink-0">
                  <Sparkles size={22} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Com base no seu progresso, aumentar <span className="text-foreground">20g de proteína</span> no almoço pode te ajudar a alcançar sua meta mais rápido.
                </p>
              </div>
              <button className="mt-3 w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold shadow-glow hover:opacity-90 transition flex items-center justify-center gap-2">
                Ver sugestão completa <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Registro rápido + Meta diária */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold">Registro rápido</h2>
            <p className="text-xs text-muted-foreground mt-1">Adicione alimentos ou uma refeição rapidamente.</p>
            <div className="mt-3 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar alimento..."
                className="w-full rounded-lg bg-secondary/40 border border-border pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { icon: Apple, label: "Adicionar alimento" },
                { icon: Barcode, label: "Escanear código" },
                { icon: BookOpen, label: "Minha biblioteca" },
                { icon: Upload, label: "Importar refeição" },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <button key={b.label} className="flex flex-col items-center justify-center gap-1.5 rounded-lg bg-secondary/40 border border-border p-3 text-xs hover:border-primary/50 hover:bg-primary/10 transition">
                    <Icon size={18} className="text-primary-glow" />
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Meta diária</h2>
              <button className="text-[10px] text-primary-glow hover:underline">Editar metas</button>
            </div>
            <div className="space-y-3">
              {metas.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-primary-glow" /> {m.label}
                      </div>
                      <span className="text-muted-foreground">{m.value}</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-gradient-primary" style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
