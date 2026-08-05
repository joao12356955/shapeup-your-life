import { Sparkles, Droplet, UtensilsCrossed, Star } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useCurrentUser, initialsOf } from "@/lib/user-store";
import {
  useXp,
  dayXp,
  XP_ALL_MEALS,
  XP_WATER_GOAL,
  XP_EXTRA_BOTTLE,
  XP_PER_LEVEL,
} from "@/lib/xp";
import { dateKey, emptyDay } from "@/lib/daily-store";

export function LevelCard() {
  const user = useCurrentUser();
  const xp = useXp(user?.email);
  const today = dayXp(xp.logs[dateKey()] ?? emptyDay);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full text-left flex items-center gap-3 border-t border-border pt-4 hover:opacity-90 transition">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-primary flex items-center justify-center font-semibold">
            {user ? (user.initials ?? initialsOf(user.name)) : "--"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user?.name ?? "Visitante"}</div>
            <div className="text-xs text-muted-foreground">
              Nível {xp.level} • {xp.inLevel}/{XP_PER_LEVEL} XP
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: `${xp.pct}%` }} />
            </div>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent side="top" align="start" className="w-80 p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Sparkles size={14} className="text-primary-glow" /> Seus ganhos de XP
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Nível {xp.level} — faltam {xp.toNext} XP para o nível {xp.level + 1}.
          </p>
        </div>

        <div className="px-4 py-3 border-b border-border space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Hoje</div>
          {today.items.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nenhum XP hoje ainda. Registre água e refeições no dashboard.
            </p>
          ) : (
            today.items.map((i) => (
              <div key={i.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{i.label}</span>
                <span className="font-semibold text-success">+{i.xp} XP</span>
              </div>
            ))
          )}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
            <span className="font-medium">Total hoje</span>
            <span className="font-bold">{today.total} XP</span>
          </div>
        </div>

        <div className="px-4 py-3 space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Como ganhar
          </div>
          <div className="flex items-center gap-2 text-xs">
            <UtensilsCrossed size={13} className="text-primary-glow" /> Todas as refeições do dia
            <span className="ml-auto font-semibold">+{XP_ALL_MEALS} XP</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Droplet size={13} className="text-primary-glow" /> Meta de 3 L de água
            <span className="ml-auto font-semibold">+{XP_WATER_GOAL} XP</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Star size={13} className="text-primary-glow" /> Cada 500 ml extra
            <span className="ml-auto font-semibold">+{XP_EXTRA_BOTTLE} XP</span>
          </div>
          <div className="pt-2 text-[11px] text-muted-foreground">
            XP acumulado: <span className="font-semibold text-foreground">{xp.total}</span> •{" "}
            {xp.history.length} dia(s) com ganhos
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
