import { type LucideIcon, TrendingDown } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  trend?: string;
}

export function StatCard({ icon: Icon, label, value, unit, hint, trend }: Props) {
  return (
    <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card hover:shadow-elegant transition">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1 text-xs text-success">
              <TrendingDown size={12} />
              <span className="font-medium">{trend}</span>
              {hint && <span className="text-muted-foreground ml-1">{hint}</span>}
            </div>
          )}
          {!trend && hint && (
            <div className="mt-2 text-xs text-muted-foreground">{hint}</div>
          )}
        </div>
      </div>
    </div>
  );
}
