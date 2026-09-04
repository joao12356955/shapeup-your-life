import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LogOut,
  User,
  Trophy,
  Flame,
  Dumbbell,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { toast } from "sonner";
import { useCurrentUser, initialsOf, logout } from "@/lib/user-store";
import { splitFor } from "@/lib/workout-split";
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

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [{ title: "Calendário — ShapeUp" }] }),
  component: CalendarioPage,
});

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

type EventType = "treino" | "prova" | "evento" | "outro";
type Ev = { label: string; type: EventType };

const typeDot: Record<EventType, string> = {
  treino: "bg-primary-glow",
  prova: "bg-destructive",
  evento: "bg-blue-400",
  outro: "bg-yellow-400",
};

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(base.getDate() + days);
  return d;
};

const fmtLong = (d: Date) => {
  const mo = d.toLocaleDateString("pt-BR", { month: "long" });
  return `${d.getDate()} de ${mo.charAt(0).toUpperCase() + mo.slice(1)} de ${d.getFullYear()}`;
};
const fmtShort = (d: Date) => d.toLocaleDateString("pt-BR");

function CalendarioPage() {
  const user = useCurrentUser();
  const hasSample = !!user?.hasSampleData;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = first.getDay();
  const leading = Array.from({ length: firstDow }, (_, i) => {
    const d = new Date(year, month, -firstDow + 1 + i);
    return d.getDate();
  });
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
  const trailingCount = totalCells - firstDow - daysInMonth;
  const trailing = Array.from({ length: trailingCount }, (_, i) => i + 1);
  const monthLabel = today.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const SELECTED = today.getDate();

  const plan = splitFor(user?.objetivo);
  const eventsByDay: Record<number, Ev[]> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const w = plan[date.getDay()]!;
    if (!w.rest) eventsByDay[d] = [{ label: w.name, type: "treino" }];
  }
  if (hasSample) {
    const wk = SELECTED;
    eventsByDay[wk] = [...(eventsByDay[wk] || []), { label: "Workshop Nutrição", type: "evento" }];
  }

  const lembretes = hasSample
    ? [
        { icon: Trophy, title: "Maratona Internacional SP", date: fmtLong(addDays(today, 18)), days: "18", unit: "dias" },
        { icon: Trophy, title: "Desafio Supino Máximo", date: fmtLong(addDays(today, 4)), days: "4", unit: "dias" },
        { icon: CalendarIcon, title: "Workshop de Nutrição", date: fmtLong(today), days: "0", unit: "hoje" },
        { icon: Flame, title: "Corrida de Aniversário", date: fmtLong(addDays(today, 6)), days: "6", unit: "dias" },
        { icon: Dumbbell, title: "Desafio Agachamento", date: fmtLong(addDays(today, 17)), days: "17", unit: "dias" },
      ]
    : [];

  const destaques = hasSample
    ? [
        { tag: "PROVA", color: "bg-destructive/20 text-destructive", title: "Maratona Internacional SP", date: fmtShort(addDays(today, 18)), local: "São Paulo - SP", info: "42.195 km", restante: "18 dias restantes" },
        { tag: "EVENTO", color: "bg-blue-500/20 text-blue-400", title: "Desafio Supino Máximo", date: fmtShort(addDays(today, 4)), local: "Na academia", info: "Mostre sua força e concorra a prémios incríveis!", restante: "4 dias restantes" },
        { tag: "PROVA", color: "bg-destructive/20 text-destructive", title: "Meia Maratona 21K SP", date: fmtShort(addDays(today, 11)), local: "São Paulo - SP", info: "21 km", restante: "11 dias restantes" },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <header className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="text-primary-glow" /> Calendário
            </h1>
            <p className="text-sm text-muted-foreground">Organize sua rotina e não perca nenhum compromisso.</p>
          </div>
          <div className="hidden md:flex relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar eventos, provas..."
              className="w-full rounded-full bg-card border border-border pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <HoverCard openDelay={100} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                onClick={() =>
                  toast("📅 Workshop de Nutrição hoje!", {
                    description: "Não esqueça do compromisso às 18h.",
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
                  { icon: CalendarIcon, title: "Workshop hoje!", desc: "Nutrição às 18h.", time: "agora" },
                  { icon: Trophy, title: "Maratona em 18 dias", desc: "Maratona Internacional SP.", time: "2h" },
                  { icon: Flame, title: "Corrida agendada amanhã", desc: "10 km no parque.", time: "ontem" },
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

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          {/* Calendar column */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <button className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:border-primary/50 transition">
                    <ChevronLeft size={14} />
                  </button>
                  <button className="h-8 w-8 rounded-md border border-border flex items-center justify-center hover:border-primary/50 transition">
                    <ChevronRight size={14} />
                  </button>
                  <span className="text-sm font-semibold ml-1 capitalize">{monthLabel}</span>
                  <button className="h-8 px-3 rounded-md border border-border text-xs hover:border-primary/50 transition ml-2">Hoje</button>
                </div>
                <div className="flex items-center gap-1 rounded-md border border-border p-1">
                  <button className="text-xs px-3 py-1 rounded bg-primary/30 text-primary-glow">Mês</button>
                  <button className="text-xs px-3 py-1 rounded hover:bg-primary/10 transition">Semana</button>
                  <button className="text-xs px-3 py-1 rounded hover:bg-primary/10 transition">Agenda</button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary-glow" /> Treinos</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Provas</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400" /> Eventos</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400" /> Outros</span>
              </div>

              {/* Calendar grid */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="grid grid-cols-7 text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border bg-secondary/40">
                  {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((d) => (
                    <div key={d} className="px-2 py-2 text-center">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-[88px]">
                  {leading.map((n) => (
                    <div key={`l${n}`} className="border-b border-r border-border p-1.5 text-xs text-muted-foreground/50">{n}</div>
                  ))}
                  {monthDays.map((n) => {
                    const evs = eventsByDay[n] || [];
                    const selected = n === SELECTED;
                    return (
                      <div
                        key={n}
                        className={`border-b border-r border-border p-1.5 text-xs hover:bg-primary/5 transition ${
                          selected ? "ring-2 ring-primary-glow ring-inset bg-primary/5" : ""
                        }`}
                      >
                        <div className="font-medium">{n}</div>
                        <div className="space-y-0.5 mt-0.5">
                          {evs.slice(0, 2).map((e, i) => (
                            <div key={i} className="flex items-center gap-1 truncate text-[10px]">
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${typeDot[e.type]}`} />
                              <span className="truncate">{e.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {trailing.map((n) => (
                    <div key={`t${n}`} className="border-b border-r border-border p-1.5 text-xs text-muted-foreground/50">{n}</div>
                  ))}
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground mt-3">{fmtLong(today)}</div>
            </div>

            {/* Destaques */}
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold mb-4">Destaques do mês</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {destaques.map((d) => (
                  <div key={d.title} className="rounded-xl bg-secondary/40 border border-border overflow-hidden hover:border-primary/50 transition">
                    <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-background border-b border-border flex items-center justify-center">
                      {d.tag === "PROVA" ? <Flame className="text-destructive" size={28} /> : <Dumbbell className="text-primary-glow" size={28} />}
                    </div>
                    <div className="p-3 space-y-2">
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${d.color}`}>{d.tag}</span>
                      <h3 className="font-semibold text-sm">{d.title}</h3>
                      <div className="text-[11px] text-muted-foreground space-y-0.5">
                        <div className="flex items-center gap-1"><CalendarIcon size={10} /> {d.date}</div>
                        <div className="flex items-center gap-1"><MapPin size={10} /> {d.local}</div>
                        <div>{d.info}</div>
                      </div>
                      <div className="text-[11px] text-primary-glow">⏳ {d.restante}</div>
                      <button className="w-full text-xs rounded-lg border border-primary/40 py-1.5 hover:bg-primary/10 transition">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm">Próximos lembretes</h2>
                <button className="text-[11px] text-muted-foreground hover:text-foreground transition">Ver todos</button>
              </div>
              <div className="space-y-3">
                {lembretes.map((l) => {
                  const Icon = l.icon;
                  return (
                    <div key={l.title} className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/15 text-primary-glow flex items-center justify-center">
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{l.title}</div>
                        <div className="text-[11px] text-muted-foreground">{l.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold leading-none">{l.days}</div>
                        <div className="text-[10px] text-muted-foreground">{l.unit}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-semibold">Não perca nada!</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Ative os lembretes e receba alertas sobre provas e eventos.
                </p>
                <button className="mt-4 w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold shadow-glow hover:opacity-90 transition">
                  Ativar lembretes
                </button>
              </div>
              <Bell size={80} className="absolute -right-4 -bottom-4 text-primary-glow/20" />
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold text-sm mb-3">Resumo do mês</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={[{ v: 71 }, { v: 29 }]} dataKey="v" innerRadius={30} outerRadius={42} startAngle={90} endAngle={-270} stroke="none">
                        <Cell fill="oklch(0.62 0.24 295)" />
                        <Cell fill="oklch(0.25 0.04 285)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-base font-bold">71%</div>
                    <div className="text-[9px] text-muted-foreground">concluída</div>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><Dumbbell size={12} className="text-primary-glow" /> Treinos planejados</span><span className="font-semibold">23</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><UtensilsCrossed size={12} className="text-primary-glow" /> Eventos academia</span><span className="font-semibold">4</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><Flame size={12} className="text-destructive" /> Provas / Corridas</span><span className="font-semibold">3</span></div>
                  <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><CalendarIcon size={12} className="text-muted-foreground" /> Dias de descanso</span><span className="font-semibold">7</span></div>
                </div>
              </div>
              <div className="text-center text-xs text-primary-glow mt-3">Você está no caminho certo! 💪</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
