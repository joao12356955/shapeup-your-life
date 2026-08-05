import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  ChevronDown,
  Trophy,
  Check,
  X,
  Circle,
  ChevronRight,
  LogOut,
  User,
  Flame,
  Dumbbell,
  Star,
  Award,
  Sparkles,
} from "lucide-react";
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

export const Route = createFileRoute("/desafios")({
  head: () => ({ meta: [{ title: "Desafios — ShapeUp" }] }),
  component: DesafiosPage,
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

const buildStats = (hasSample: boolean, xpTotal: number) => [
  { icon: Trophy, label: "Desafios ativos", value: hasSample ? "2" : "0", hint: "Participe e evolua" },
  {
    icon: Check,
    label: "Desafios concluídos",
    value: hasSample ? "7" : "0",
    hint: hasSample ? "Parabéns pela dedicação!" : "Seu primeiro está a um clique",
  },
  {
    icon: Flame,
    label: "Sequência atual",
    value: hasSample ? "12 dias" : "0 dias",
    hint: hasSample ? "Continue assim!" : "Comece hoje",
  },
  {
    icon: Star,
    label: "Pontos conquistados",
    value: `${xpTotal} XP`,
    hint: "Ganhe XP com água e refeições",
  },
];

const ativos = [
  {
    name: "Desafio 30 Dias",
    desc: "30 dias de disciplina para transformar seu corpo e mente.",
    start: "01/06/2024",
    end: "30/06/2024",
    progress: 90,
    progressLabel: "27 / 30 dias",
    reward: "+500 XP",
  },
  {
    name: "Desafio 75 HARD",
    desc: "75 dias de foco total: treino, dieta, leitura e disciplina.",
    start: "25/05/2024",
    end: "07/08/2024",
    progress: 30,
    progressLabel: "23 / 75 dias",
    reward: "+1.000 XP",
  },
];

const disponiveis = [
  { name: "Desafio da Academia", desc: "Seja o aluno mais dedicado da sua academia.", days: "14 dias", type: "Competitivo", xp: "+300 XP" },
  { name: "Desafio de Casais", desc: "Evoluam juntos e fortaleçam seu vínculo.", days: "21 dias", type: "Dupla", xp: "+500 XP" },
  { name: "Desafio 7 Dias", desc: "Uma semana para criar hábitos imbatíveis.", days: "7 dias", type: "Iniciante", xp: "+150 XP" },
  { name: "Desafio Cardio", desc: "Queime calorias e melhore seu condicionamento.", days: "10 dias", type: "Cardio", xp: "+250 XP" },
];

// 30-day calendar: 23 done, 1 today, rest pending
const dayStatus = (n: number): "done" | "today" | "pending" => {
  if (n <= 22) return "done";
  if (n === 23) return "today";
  return "pending";
};

function DesafiosPage() {
  const user = useCurrentUser();
  const xp = useXp(user?.email);
  const hasSample = !!user?.hasSampleData;
  const stats = buildStats(hasSample, xp.total);
  const ativosDoUsuario = hasSample ? ativos : [];
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        {/* Top bar */}
        <header className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
              <Trophy className="text-primary-glow" /> Desafios
            </h1>
            <p className="text-sm text-muted-foreground">Supere seus limites e conquiste recompensas incríveis.</p>
          </div>
          <div className="hidden md:flex relative w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar desafios, participantes..."
              className="w-full rounded-full bg-card border border-border pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <HoverCard openDelay={100} closeDelay={150}>
            <HoverCardTrigger asChild>
              <button
                onClick={() =>
                  toast("🏆 Novo desafio disponível!", {
                    description: "Veja os desafios da semana e participe.",
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
                  { icon: Trophy, title: "Novo desafio disponível!", desc: "Desafio Cardio: queime calorias.", time: "agora" },
                  { icon: Flame, title: "Sequência de 12 dias 🔥", desc: "Continue para bater seu recorde!", time: "2h" },
                  { icon: Award, title: "Você subiu no ranking!", desc: "Top 12% da comunidade.", time: "ontem" },
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card hover:shadow-elegant transition flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-2xl font-bold mt-0.5">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.hint}</div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            );
          })}
        </div>

        {/* Active + Calendar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card space-y-4">
            <h2 className="font-semibold">Desafios ativos</h2>
            {ativosDoUsuario.length === 0 && (
              <p className="text-sm text-muted-foreground rounded-xl bg-secondary/40 border border-dashed border-border p-6 text-center">
                Você ainda não participa de nenhum desafio. Escolha um abaixo para começar.
              </p>
            )}
            {ativosDoUsuario.map((a) => (
              <div key={a.name} className="rounded-xl bg-secondary/40 border border-border p-4 hover:border-primary/50 transition">
                <div className="flex gap-4">
                  <div className="h-24 w-32 shrink-0 rounded-lg bg-gradient-to-br from-primary/40 via-primary/20 to-background border border-primary/30 flex items-center justify-center">
                    <Dumbbell className="text-primary-glow" size={36} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{a.name}</h3>
                          <span className="text-[10px] uppercase tracking-wider rounded-full bg-primary/20 text-primary-glow px-2 py-0.5">Em andamento</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground">Iniciado em</div>
                        <div className="font-medium">{a.start}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Termina em</div>
                        <div className="font-medium">{a.end}</div>
                      </div>
                      <div className="md:col-span-1">
                        <div className="text-muted-foreground">Progresso</div>
                        <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-gradient-primary" style={{ width: `${a.progress}%` }} />
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1">{a.progressLabel}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground">Recompensa</div>
                        <div className="text-success font-semibold">{a.reward}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm">Calendário do desafio 30 dias</h2>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary-glow" /> Concluído</span>
                <span className="flex items-center gap-1"><Circle size={8} /> Parcial</span>
                <span className="flex items-center gap-1"><X size={10} /> Perdido</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
                  const s = hasSample ? dayStatus(n) : "pending";
                  return (
                    <div key={n} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-muted-foreground">{n}</span>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] ${
                        s === "done" ? "bg-primary/30 text-primary-glow border border-primary/40" :
                        s === "today" ? "bg-primary text-primary-foreground ring-2 ring-primary-glow" :
                        "border border-border text-muted-foreground"
                      }`}>
                        {s === "done" ? <Check size={10} /> : s === "today" ? n : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Recompensa em andamento</h3>
                  <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary"
                      style={{ width: `${Math.min(100, Math.round((xp.total / 3000) * 100))}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{xp.total} / 3.000 XP</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Faltam {Math.max(0, 3000 - xp.total)} XP para desbloquear
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center">
                    <Sparkles className="text-primary-glow" size={24} />
                  </div>
                  <div className="text-xs font-semibold mt-1">Baú Épico</div>
                  <div className="text-[10px] text-muted-foreground">Contém itens exclusivos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available */}
        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Desafios disponíveis</h2>
            <button className="text-xs text-muted-foreground flex items-center gap-1 rounded-md border border-border px-2 py-1 hover:border-primary/50 transition">
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {disponiveis.map((d) => (
              <div key={d.name} className="rounded-xl bg-secondary/40 border border-border overflow-hidden hover:border-primary/50 transition">
                <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-background flex items-center justify-center border-b border-border">
                  <Trophy className="text-primary-glow" size={32} />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-sm">{d.name}</h3>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                    <span>⏱ {d.days}</span>
                    <span>👥 {d.type}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-success font-semibold text-sm">{d.xp}</span>
                    <button className="text-xs rounded-lg bg-gradient-primary px-3 py-1.5 font-semibold shadow-glow hover:opacity-90 transition">
                      Participar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            Desafios atualizados toda semana. Participe e evolua! 🚀
          </div>
        </div>
      </main>
    </div>
  );
}
