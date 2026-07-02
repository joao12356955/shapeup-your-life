import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Weight,
  Ruler,
  Target,
  BarChart3,
  Building2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Dumbbell,
  Utensils,
} from "lucide-react";
import logoAsset from "@/assets/shapeup-logo-hero.png.asset.json";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Crie sua conta — ShapeUp" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/dashboard" });
          }}
          className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-8 lg:p-10 shadow-elegant space-y-6"
        >
          <div className="flex items-start justify-between">
            <img src={logoAsset.url} alt="ShapeUp" className="h-12 w-auto" />
            <div className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/" className="text-primary-glow font-semibold hover:underline">
                Entrar
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">Crie sua conta</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-gradient-primary" />
            <p className="mt-3 text-sm text-muted-foreground">
              Preencha seus dados para começar sua jornada e alcançar seus melhores resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <IconField icon={User} placeholder="Nome completo" />
            <IconField icon={Mail} type="email" placeholder="E-mail" />
            <IconField
              icon={Lock}
              type={showPwd ? "text" : "password"}
              placeholder="Senha"
              right={
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <IconField
              icon={Lock}
              type={showPwd2 ? "text" : "password"}
              placeholder="Confirmar senha"
              right={
                <button type="button" onClick={() => setShowPwd2((s) => !s)} className="text-muted-foreground hover:text-foreground">
                  {showPwd2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <IconField icon={Calendar} type="date" placeholder="Data de nascimento" />
            <IconSelect icon={User} label="Sexo" options={["Masculino", "Feminino", "Outro"]} />
            <IconField icon={Weight} type="number" placeholder="Peso atual (kg)" />
            <IconField icon={Ruler} type="number" placeholder="Altura (cm)" />
            <IconSelect icon={Target} label="Objetivo principal" options={["Perder peso", "Ganhar massa", "Definição", "Condicionamento"]} />
            <IconSelect icon={BarChart3} label="Nível de treino" options={["Iniciante", "Intermediário", "Avançado"]} />
            <div className="sm:col-span-2">
              <IconField icon={Building2} placeholder="Código da academia (opcional)" />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" required className="mt-0.5 accent-primary" />
            <span>
              Aceito os{" "}
              <a href="#" className="text-primary-glow hover:underline">termos de uso</a> e{" "}
              <a href="#" className="text-primary-glow hover:underline">política de privacidade</a>.
            </span>
          </label>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3.5 font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition"
          >
            Criar minha conta <ArrowRight size={16} />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { i: ShieldCheck, t: "Seus dados protegidos", d: "Tecnologia de ponta para manter suas informações 100% seguras." },
              { i: TrendingUp, t: "Acompanhe seu progresso", d: "Insights completos sobre sua evolução e conquistas." },
              { i: Trophy, t: "Conquiste seus objetivos", d: "Planos personalizados para te levar ao próximo nível." },
            ].map((b) => {
              const Icon = b.i;
              return (
                <div key={b.t} className="flex gap-2">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon size={16} className="text-primary-glow" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{b.t}</div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{b.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </form>

        {/* Right: Brand panel */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-card p-8 lg:p-10 shadow-elegant flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <img src={logoAsset.url} alt="ShapeUp" className="h-40 w-auto" />
            <div className="mt-2 h-0.5 w-40 bg-gradient-primary rounded-full" />
            <p className="mt-2 text-sm text-primary-glow tracking-wide">
              Track your progress. Shape your future.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { i: Dumbbell, t: "Treinos personalizados", d: "Planos adaptados para o seu objetivo e nível." },
              { i: Utensils, t: "Nutrição inteligente", d: "Dietas personalizadas e acompanhamento completo." },
              { i: TrendingUp, t: "Evolução real", d: "Métricas precisas para você ver sua transformação." },
            ].map((b) => {
              const Icon = b.i;
              return (
                <div key={b.t} className="flex gap-3 items-start rounded-xl bg-secondary/40 border border-border p-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Icon size={18} className="text-primary-glow" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{b.t}</div>
                    <p className="text-xs text-muted-foreground">{b.d}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-secondary/50 border border-border p-5 mt-auto">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Seu progresso</div>
              <span className="text-xs text-muted-foreground">Esta semana</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="url(#g)" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray="78 100"
                  />
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0" stopColor="hsl(270 95% 65%)" />
                      <stop offset="1" stopColor="hsl(320 85% 60%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">78%</div>
                  <div className="text-[9px] text-muted-foreground">Meta semanal</div>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-sm">
                <Row label="Treinos" value="5/6" />
                <Row label="Calorias" value="2.450/3.200" />
                <Row label="Peso" value="-1,2kg" positive />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconField({
  icon: Icon,
  right,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ComponentType<{ size?: number; className?: string }>; right?: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-glow" />
      <input
        {...props}
        className="w-full rounded-lg bg-secondary/60 border border-border pl-10 pr-10 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
      />
      {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  );
}

function IconSelect({
  icon: Icon,
  label,
  options,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-glow z-10" />
      <select
        defaultValue=""
        className="w-full appearance-none rounded-lg bg-secondary/60 border border-border pl-10 pr-8 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
      >
        <option value="" disabled>{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Row({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${positive ? "text-primary-glow" : ""}`}>{value}</span>
    </div>
  );
}
