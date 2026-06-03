import { Zap } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 18, text: "text-lg" },
    md: { icon: 22, text: "text-2xl" },
    lg: { icon: 32, text: "text-4xl" },
  } as const;
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
        <Zap size={s.icon} className="text-primary-foreground" fill="currentColor" />
      </div>
      <span className={`font-display font-bold ${s.text}`}>
        Shape<span className="text-gradient-primary">Up</span>
      </span>
    </div>
  );
}
