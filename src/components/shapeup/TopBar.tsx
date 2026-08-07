import { useNavigate } from "@tanstack/react-router";
import { useCurrentUser, initialsOf, logout } from "@/lib/user-store";
import { useXp } from "@/lib/xp";
import { Bell, ChevronDown, LogOut, Search, User, Dumbbell, Flame, Trophy } from "lucide-react";
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
        <DropdownMenuItem onClick={() => navigate({ to: "/configuracoes" })}>
          <User size={14} className="mr-2" /> Meu perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logout();
            navigate({ to: "/", replace: true });
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut size={14} className="mr-2" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopBar({
  title,
  subtitle,
  searchPlaceholder = "Buscar...",
}: {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
}) {
  return (
    <header className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="hidden md:flex relative w-72">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder={searchPlaceholder}
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
              { icon: Flame, title: "Sequência de 8 dias 🔥", desc: "Continue assim!", time: "ontem" },
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
  );
}
