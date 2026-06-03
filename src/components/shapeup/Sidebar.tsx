import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Trophy,
  Calendar,
  BarChart3,
  Settings,
  Crown,
} from "lucide-react";
import sidebarLogo from "@/assets/shapeup-logo-sidebar.png.asset.json";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard", label: "Treinos", icon: Dumbbell },
  { to: "/dashboard", label: "Dieta", icon: UtensilsCrossed },
  { to: "/dashboard", label: "Evolução", icon: TrendingUp },
  { to: "/dashboard", label: "Desafios", icon: Trophy },
  { to: "/dashboard", label: "Calendário", icon: Calendar },
  { to: "/dashboard", label: "Relatórios", icon: BarChart3 },
  { to: "/dashboard", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar border-r border-border p-6 gap-8">
      <img src={sidebarLogo.url} alt="ShapeUp" className="h-16 w-auto self-start" />

      <nav className="flex-1 flex flex-col gap-1">
        {nav.map((item, i) => {
          const active = i === 0 && location.pathname === "/dashboard";
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-active text-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl bg-gradient-card border border-border p-4 space-y-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
          <Crown size={18} className="text-primary-glow" />
        </div>
        <div>
          <div className="font-semibold">Seja Premium</div>
          <p className="text-xs text-muted-foreground mt-1">
            Acesse recursos exclusivos e potencialize seus resultados.
          </p>
        </div>
        <button className="w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition">
          Assinar agora
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center font-semibold">
          JV
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">João Victor</div>
          <div className="text-xs text-muted-foreground">Nível 12</div>
          <div className="mt-1 h-1 w-full rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-primary" />
          </div>
        </div>
      </div>
    </aside>
  );
}
