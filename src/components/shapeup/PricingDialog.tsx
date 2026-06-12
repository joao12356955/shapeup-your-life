import { Check, Lock, Star, Crown, Shield, RefreshCw, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PricingDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl bg-gradient-card border-border p-0 overflow-hidden">
        <div className="p-6 lg:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Escolha seu plano e <span className="text-gradient-primary">evolua sem limites</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Todos os planos incluem o Shappinho AI, seu assistente pessoal 24h por dia.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* FREE */}
            <PlanCard
              tag="FREE"
              name="ShapeUp Free"
              tagline="Comece sua evolução"
              price="0"
              priceSuffix="/mês"
              extra="Ideal para quem está começando e quer criar o hábito."
              features={[
                "Dashboard completo",
                "Treinos",
                "Dieta",
                "Evolução corporal",
                "Calendário",
                "Desafios básicos",
                "Registro de peso e medidas",
                "Ranking da academia",
                "Shappinho AI (5 perguntas/dia)",
              ]}
              limits={[
                "5 perguntas por dia ao Shappinho AI",
                "Histórico de 30 dias",
                "Sem análise de fotos",
                "Sem integração Strava e smartwatch",
              ]}
              cta="Começar grátis"
              ctaClass="bg-secondary text-foreground hover:bg-secondary/80 border border-border"
            />

            {/* PRO */}
            <PlanCard
              tag="PRO"
              name="ShapeUp Pro"
              tagline="Evolução inteligente"
              price="19,90"
              priceSuffix="/mês"
              extra="ou R$ 199,90/ano (economize 16%)"
              popular
              features={[
                "Shappinho AI ilimitado",
                "Integração Strava",
                "Integração Smartwatch",
                "Histórico ilimitado",
                "Comparação de fotos",
                "Relatórios avançados",
                "Exportação PDF",
                "Sugestões de treino personalizadas",
                "Ajuste automático de metas",
                "Desafios exclusivos",
                "Ranking regional",
              ]}
              cta="Assinar Pro"
              ctaClass="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            />

            {/* ELITE */}
            <PlanCard
              tag="ELITE"
              name="ShapeUp Elite"
              tagline="Seu coach digital completo"
              price="49,90"
              priceSuffix="/mês"
              extra="ou R$ 499,90/ano (economize 17%)"
              elite
              features={[
                "Shappinho AI Coach Premium",
                "Análise física por foto",
                "Projeção de evolução corporal",
                "Planejamento para corridas e maratonas",
                "Sugestão automática de cargas",
                "Identificação de platôs de treino",
                "Planejamento alimentar inteligente",
                "Avatar e itens exclusivos",
                "Desafios VIP",
                "Novidades antecipadas",
              ]}
              cta="Assinar Elite"
              ctaClass="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:opacity-90"
            />
          </div>

          {/* Footer benefits */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl bg-secondary/40 border border-border p-4">
            {[
              { icon: Shield, t: "7 DIAS GRÁTIS", d: "Teste o Pro ou Elite sem compromisso" },
              { icon: Lock, t: "PAGAMENTO SEGURO", d: "Seus dados protegidos com criptografia de ponta" },
              { icon: RefreshCw, t: "CANCELE QUANDO QUISER", d: "Sem burocracia e sem fidelidade" },
              { icon: Trophy, t: "FOCO NO RESULTADO", d: "Tecnologia + acompanhamento para você chegar lá" },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.t} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary-glow">
                    <Icon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{b.t}</div>
                    <div className="text-[11px] text-muted-foreground">{b.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PlanCard({
  tag,
  name,
  tagline,
  price,
  priceSuffix,
  extra,
  features,
  limits,
  cta,
  ctaClass,
  popular,
  elite,
}: {
  tag: string;
  name: string;
  tagline: string;
  price: string;
  priceSuffix: string;
  extra?: string;
  features: string[];
  limits?: string[];
  cta: string;
  ctaClass: string;
  popular?: boolean;
  elite?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-5 flex flex-col gap-4 ${
        popular
          ? "border-primary bg-primary/5 shadow-glow"
          : elite
          ? "border-amber-400/60 bg-amber-500/5"
          : "border-border bg-secondary/30"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-bold flex items-center gap-1">
          <Star size={10} fill="currentColor" /> MAIS POPULAR
        </span>
      )}
      {elite && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-3 py-1 text-[10px] font-bold flex items-center gap-1">
          <Crown size={10} fill="currentColor" /> RECOMENDADO
        </span>
      )}
      <div>
        <div className={`text-xs font-bold ${popular ? "text-primary-glow" : elite ? "text-amber-400" : "text-muted-foreground"}`}>
          {tag}
        </div>
        <div className="text-xl font-bold mt-1">{name}</div>
        <div className="text-xs text-muted-foreground">{tagline}</div>
      </div>
      <div className="border-y border-border py-3">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">R$</span>
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-sm text-muted-foreground">{priceSuffix}</span>
        </div>
        {extra && <div className="text-xs text-muted-foreground mt-1">{extra}</div>}
      </div>
      <ul className="space-y-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check size={14} className={`mt-0.5 shrink-0 ${elite ? "text-amber-400" : "text-primary-glow"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {limits && (
        <div className="space-y-1.5 border-t border-border pt-3">
          <div className="text-[10px] font-bold text-muted-foreground uppercase">Limitações:</div>
          {limits.map((l) => (
            <div key={l} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock size={11} className="mt-0.5 shrink-0" />
              <span>{l}</span>
            </div>
          ))}
        </div>
      )}
      <button className={`w-full rounded-lg py-2.5 text-sm font-semibold transition ${ctaClass}`}>
        {cta}
      </button>
    </div>
  );
}
