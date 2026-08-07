import { useState } from "react";
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
  Building2,
  Menu,
  Shield,
} from "lucide-react";
import sidebarLogo from "@/assets/shapeup-logo-menu.png.asset.json";
import { PricingDialog } from "@/components/shapeup/PricingDialog";
import { LevelCard } from "@/components/shapeup/LevelCard";
import { useCurrentUser } from "@/lib/user-store";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/treinos", label: "Treinos", icon: Dumbbell },
  { to: "/dieta", label: "Dieta", icon: UtensilsCrossed },
  { to: "/evolucao", label: "Evolução", icon: TrendingUp },
  { to: "/desafios", label: "Desafios", icon: Trophy },
  { to: "/calendario", label: "Calendário", icon: Calendar },
  { to: "/academia", label: "Academia", icon: Building2 },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const user = useCurrentUser();
  return (
    <div className="flex h-full flex-col gap-8">
      <img src={sidebarLogo.url} alt="ShapeUp" className="h-32 w-auto self-start -ml-2" />

      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {nav.map((item, i) => {
          const active = location.pathname === item.to && (i === 0 || item.to !== "/dashboard");
          const Icon = item.icon;
          return (
            <Link
              key={`${item.label}-${i}`}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-sidebar-active text-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-primary/15 hover:text-foreground hover:translate-x-0.5"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {user?.isAdmin && (
          <Link
            to="/admin"
            onClick={onNavigate}
            className={`mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              location.pathname === "/admin"
                ? "bg-sidebar-active text-foreground shadow-glow"
                : "text-sidebar-foreground hover:bg-primary/15 hover:text-foreground hover:translate-x-0.5"
            }`}
          >
            <Shield size={18} /> Admin
          </Link>
        )}
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
        <PricingDialog>
          <button className="w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition">
            Assinar agora
          </button>
        </PricingDialog>
      </div>

      <LevelCard />

    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar border-r border-border p-6 gap-8">
        <SidebarInner />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Abrir menu"
            className="lg:hidden fixed top-4 left-4 z-40 h-11 w-11 rounded-xl bg-card/90 backdrop-blur border border-border shadow-elegant flex items-center justify-center hover:border-primary/50 transition"
          >
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 bg-sidebar border-r border-border p-6 [&>button]:text-foreground"
        >
          <SidebarInner onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
