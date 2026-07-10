import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Ruler,
  Dumbbell,
  UtensilsCrossed,
  ClipboardCheck,
  Flame,
  Brain,

} from "lucide-react";
import { Sidebar } from "@/components/shapeup/Sidebar";
import {
  updateCurrentUser,
  useCurrentUser,
  type Objetivo,
  type Sexo,
  type NivelAtividade,
  type PlanoTreino,
  type PlanoDieta,
  type Medidas,
} from "@/lib/user-store";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Configuração — ShapeUp" }] }),
  component: OnboardingPage,
});

type Form = {
  name: string;
  dataNascimento: string;
  sexo: Sexo | "";
  altura: string;
  peso: string;
  pesoMeta: string;
  nivelAtividade: NivelAtividade | "";
  objetivo: Objetivo | "";
  dataMeta: string;
  medidas: { cintura: string; quadril: string; peito: string; braco: string; coxa: string };
  treino: {
    diasPorSemana: string;
    local: PlanoTreino["local"] | "";
    duracao: string;
    experiencia: PlanoTreino["experiencia"] | "";
  };
  dieta: { refeicoesPorDia: string; restricoes: string; metaCalorica: string };
};

const STEPS = [
  { key: "pessoais", label: "Dados pessoais", sub: "Informações básicas", icon: User },
  { key: "medidas", label: "Medidas corporais", sub: "Opcional", icon: Ruler },
  { key: "treinos", label: "Treinos", sub: "Monte seu plano", icon: Dumbbell },
  { key: "alimentacao", label: "Alimentação", sub: "Suas preferências", icon: UtensilsCrossed },
  { key: "revisao", label: "Revisão", sub: "Tudo pronto!", icon: ClipboardCheck },
] as const;

function OnboardingPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(() => ({
    name: user?.name ?? "",
    dataNascimento: user?.dataNascimento ?? "",
    sexo: user?.sexo ?? "",
    altura: user?.altura ? String(user.altura) : "",
    peso: user?.peso ? String(user.peso) : "",
    pesoMeta: user?.pesoMeta ? String(user.pesoMeta) : "",
    nivelAtividade: user?.nivelAtividade ?? "",
    objetivo: user?.objetivo ?? "",
    dataMeta: user?.dataMeta ?? "",
    medidas: {
      cintura: user?.medidas?.cintura?.toString() ?? "",
      quadril: user?.medidas?.quadril?.toString() ?? "",
      peito: user?.medidas?.peito?.toString() ?? "",
      braco: user?.medidas?.braco?.toString() ?? "",
      coxa: user?.medidas?.coxa?.toString() ?? "",
    },
    treino: {
      diasPorSemana: user?.treino?.diasPorSemana?.toString() ?? "",
      local: user?.treino?.local ?? "",
      duracao: user?.treino?.duracao?.toString() ?? "",
      experiencia: user?.treino?.experiencia ?? "",
    },
    dieta: {
      refeicoesPorDia: user?.dieta?.refeicoesPorDia?.toString() ?? "",
      restricoes: user?.dieta?.restricoes ?? "",
      metaCalorica: user?.dieta?.metaCalorica?.toString() ?? "",
    },
  }));

  const trackedFields = useMemo(
    () => [
      form.altura,
      form.peso,
      form.pesoMeta,
      form.nivelAtividade,
      form.objetivo,
      form.dataMeta,
      form.medidas.cintura,
      form.medidas.quadril,
      form.medidas.peito,
      form.medidas.braco,
      form.medidas.coxa,
      form.treino.diasPorSemana,
      form.treino.local,
      form.treino.duracao,
      form.treino.experiencia,
      form.dieta.refeicoesPorDia,
      form.dieta.restricoes,
      form.dieta.metaCalorica,
    ],
    [form],
  );
  const filled = trackedFields.filter((v) => v && String(v).trim() !== "").length;
  const progress = Math.round((filled / trackedFields.length) * 100);

  // save partial after each step
  const persist = () => {
    updateCurrentUser({
      name: form.name || undefined,
      dataNascimento: form.dataNascimento || undefined,
      sexo: (form.sexo || undefined) as Sexo | undefined,
      altura: form.altura ? Number(form.altura) : undefined,
      peso: form.peso ? Number(form.peso) : undefined,
      pesoMeta: form.pesoMeta ? Number(form.pesoMeta) : undefined,
      nivelAtividade: (form.nivelAtividade || undefined) as NivelAtividade | undefined,
      objetivo: (form.objetivo || undefined) as Objetivo | undefined,
      dataMeta: form.dataMeta || undefined,
      medidas: {
        cintura: form.medidas.cintura ? Number(form.medidas.cintura) : undefined,
        quadril: form.medidas.quadril ? Number(form.medidas.quadril) : undefined,
        peito: form.medidas.peito ? Number(form.medidas.peito) : undefined,
        braco: form.medidas.braco ? Number(form.medidas.braco) : undefined,
        coxa: form.medidas.coxa ? Number(form.medidas.coxa) : undefined,
      } as Medidas,
      treino: {
        diasPorSemana: form.treino.diasPorSemana ? Number(form.treino.diasPorSemana) : undefined,
        local: (form.treino.local || undefined) as PlanoTreino["local"],
        duracao: form.treino.duracao ? Number(form.treino.duracao) : undefined,
        experiencia: (form.treino.experiencia || undefined) as PlanoTreino["experiencia"],
      },
      dieta: {
        refeicoesPorDia: form.dieta.refeicoesPorDia ? Number(form.dieta.refeicoesPorDia) : undefined,
        restricoes: form.dieta.restricoes || undefined,
        metaCalorica: form.dieta.metaCalorica ? Number(form.dieta.metaCalorica) : undefined,
      } as PlanoDieta,
    });
  };

  const next = () => {
    persist();
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const prev = () => setStep(Math.max(0, step - 1));

  const finish = () => {
    persist();
    updateCurrentUser({ onboardingCompleto: true });
    toast.success("Perfil configurado! Bora treinar 💪");
    navigate({ to: "/dashboard" });
  };

  const skip = () => {
    updateCurrentUser({ onboardingCompleto: true });
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <header className="pl-14 lg:pl-0">
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
            Vamos começar! <span>👋</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Vamos configurar seu perfil e plano para você alcançar seus objetivos.
          </p>
        </header>

        {/* Stepper */}
        <div className="rounded-2xl border border-border bg-gradient-card p-4 sm:p-5 shadow-card">
          <div className="flex items-center gap-2 overflow-x-auto">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <div key={s.key} className="flex items-center gap-2 shrink-0">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
                      done
                        ? "bg-primary/30 text-primary-glow"
                        : active
                          ? "bg-gradient-primary text-primary-foreground shadow-glow"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? <Check size={16} /> : i + 1}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </div>
                    <div className={`text-xs ${active ? "text-primary-glow" : "text-muted-foreground"}`}>{s.sub}</div>
                  </div>
                  {i < STEPS.length - 1 && <div className="mx-1 sm:mx-3 h-px w-6 sm:w-10 bg-border" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          {/* Step content */}
          <div className="rounded-2xl border border-border bg-gradient-card p-5 sm:p-6 shadow-card space-y-5">
            <div>
              <h2 className="text-lg font-bold">
                {step + 1}. {STEPS[step].label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step === 0 && "Estas informações são importantes para personalizar sua experiência."}
                {step === 1 && "Opcional — nos ajuda a medir sua evolução com mais precisão."}
                {step === 2 && "Monte a estrutura ideal para seus treinos."}
                {step === 3 && "Vamos ajustar suas metas alimentares."}
                {step === 4 && "Revise seus dados e finalize a configuração."}
              </p>
            </div>

            {step === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Nome">
                  <Input
                    placeholder="Ex.: João Victor"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>
                <Field label="Data de nascimento">
                  <Input
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                  />
                </Field>
                <Field label="Sexo">
                  <Select
                    value={form.sexo}
                    onChange={(v) => setForm({ ...form, sexo: v as Sexo })}
                    options={["Masculino", "Feminino", "Outro"]}
                  />
                </Field>
                <Field label="Altura" suffix="cm">
                  <Input type="number" value={form.altura} onChange={(e) => setForm({ ...form, altura: e.target.value })} />
                </Field>
                <Field label="Peso atual" suffix="kg">
                  <Input type="number" step="0.1" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
                </Field>
                <Field label="Peso meta" suffix="kg">
                  <Input
                    type="number"
                    step="0.1"
                    value={form.pesoMeta}
                    onChange={(e) => setForm({ ...form, pesoMeta: e.target.value })}
                  />
                </Field>
                <div className="sm:col-span-3 grid gap-4 sm:grid-cols-2">
                  <Panel title="Nível de atividade">
                    {(["Sedentário", "Levemente ativo", "Moderado", "Muito ativo"] as NivelAtividade[]).map((opt) => (
                      <Radio
                        key={opt}
                        label={opt}
                        selected={form.nivelAtividade === opt}
                        onClick={() => setForm({ ...form, nivelAtividade: opt })}
                      />
                    ))}
                  </Panel>
                  <Panel title="Objetivo principal">
                    {([
                      { v: "emagrecimento" as Objetivo, l: "Emagrecimento", i: Flame },
                      { v: "ganho de massa muscular" as Objetivo, l: "Ganho de massa", i: Dumbbell },
                      { v: "foco" as Objetivo, l: "Foco / Performance", i: Brain },
                    ]).map((o) => (
                      <Radio
                        key={o.v}
                        label={o.l}
                        icon={o.i}
                        selected={form.objetivo === o.v}
                        onClick={() => setForm({ ...form, objetivo: o.v })}
                      />
                    ))}
                  </Panel>
                </div>
                <Field label="Data para atingir a meta">
                  <Input
                    type="date"
                    value={form.dataMeta}
                    onChange={(e) => setForm({ ...form, dataMeta: e.target.value })}
                  />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(
                  [
                    ["cintura", "Cintura"],
                    ["quadril", "Quadril"],
                    ["peito", "Peito"],
                    ["braco", "Braço"],
                    ["coxa", "Coxa"],
                  ] as const
                ).map(([k, l]) => (
                  <Field key={k} label={l} suffix="cm">
                    <Input
                      type="number"
                      value={form.medidas[k]}
                      onChange={(e) => setForm({ ...form, medidas: { ...form.medidas, [k]: e.target.value } })}
                    />
                  </Field>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Dias por semana">
                  <Input
                    type="number"
                    min={1}
                    max={7}
                    value={form.treino.diasPorSemana}
                    onChange={(e) => setForm({ ...form, treino: { ...form.treino, diasPorSemana: e.target.value } })}
                  />
                </Field>
                <Field label="Duração média" suffix="min">
                  <Input
                    type="number"
                    value={form.treino.duracao}
                    onChange={(e) => setForm({ ...form, treino: { ...form.treino, duracao: e.target.value } })}
                  />
                </Field>
                <Panel title="Onde você treina?">
                  {(["Academia", "Casa", "Ar livre"] as const).map((o) => (
                    <Radio
                      key={o}
                      label={o}
                      selected={form.treino.local === o}
                      onClick={() => setForm({ ...form, treino: { ...form.treino, local: o } })}
                    />
                  ))}
                </Panel>
                <Panel title="Experiência">
                  {(["Iniciante", "Intermediário", "Avançado"] as const).map((o) => (
                    <Radio
                      key={o}
                      label={o}
                      selected={form.treino.experiencia === o}
                      onClick={() => setForm({ ...form, treino: { ...form.treino, experiencia: o } })}
                    />
                  ))}
                </Panel>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Refeições por dia">
                  <Input
                    type="number"
                    min={1}
                    max={8}
                    value={form.dieta.refeicoesPorDia}
                    onChange={(e) => setForm({ ...form, dieta: { ...form.dieta, refeicoesPorDia: e.target.value } })}
                  />
                </Field>
                <Field label="Meta calórica" suffix="kcal">
                  <Input
                    type="number"
                    value={form.dieta.metaCalorica}
                    onChange={(e) => setForm({ ...form, dieta: { ...form.dieta, metaCalorica: e.target.value } })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Restrições alimentares">
                    <Input
                      placeholder="Ex.: sem lactose, vegetariano..."
                      value={form.dieta.restricoes}
                      onChange={(e) => setForm({ ...form, dieta: { ...form.dieta, restricoes: e.target.value } })}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Review label="Nome" value={form.name} />
                <Review label="Sexo" value={form.sexo} />
                <Review label="Nascimento" value={form.dataNascimento} />
                <Review label="Altura" value={form.altura ? `${form.altura} cm` : ""} />
                <Review label="Peso atual" value={form.peso ? `${form.peso} kg` : ""} />
                <Review label="Peso meta" value={form.pesoMeta ? `${form.pesoMeta} kg` : ""} />
                <Review label="Objetivo" value={form.objetivo} />
                <Review label="Nível atividade" value={form.nivelAtividade} />
                <Review label="Data da meta" value={form.dataMeta} />
                <Review label="Local do treino" value={form.treino.local} />
                <Review label="Dias/semana" value={form.treino.diasPorSemana} />
                <Review label="Duração" value={form.treino.duracao ? `${form.treino.duracao} min` : ""} />
                <Review label="Refeições/dia" value={form.dieta.refeicoesPorDia} />
                <Review label="Meta calórica" value={form.dieta.metaCalorica ? `${form.dieta.metaCalorica} kcal` : ""} />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60 disabled:opacity-40"
              >
                <ArrowLeft size={14} /> Voltar
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={skip}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary/60"
                >
                  Pular configuração
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow hover:opacity-90"
                  >
                    Continuar <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finish}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-glow hover:opacity-90"
                  >
                    Concluir <Check size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress side panel */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
              <div className="font-semibold">Seu progresso na configuração</div>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="url(#pg)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${progress} 100`}
                    />
                    <defs>
                      <linearGradient id="pg" x1="0" x2="1">
                        <stop offset="0" stopColor="oklch(0.62 0.24 295)" />
                        <stop offset="1" stopColor="oklch(0.78 0.18 320)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-lg font-bold">{progress}%</div>
                    <div className="text-[9px] text-muted-foreground">Concluído</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Preencha os campos para desbloquear sua experiência completa.
                </p>
              </div>
              <ol className="mt-4 space-y-2">
                {STEPS.map((s, i) => {
                  const active = i === step;
                  const done = i < step;
                  return (
                    <li key={s.key} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                          done
                            ? "bg-primary/30 text-primary-glow"
                            : active
                              ? "bg-gradient-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {done ? <Check size={12} /> : i + 1}
                      </span>
                      <span className={active ? "font-semibold" : "text-muted-foreground"}>{s.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-card p-5 shadow-card">
              <div className="font-semibold">O que você terá acesso</div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[
                  "Planos de treino personalizados",
                  "Controle de dieta e macros",
                  "Acompanhamento de evolução",
                  "Desafios e conquistas",
                  "Relatórios avançados",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary-glow">
                      <Check size={12} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, suffix, children }: { label: string; suffix?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="relative">
        {children}
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg bg-secondary/60 border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
    >
      <option value="">Selecione</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
      <div className="text-sm font-semibold">{title}</div>
      <div className="grid gap-1.5">{children}</div>
    </div>
  );
}

function Radio({
  label,
  selected,
  onClick,
  icon: Icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition ${
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-transparent text-muted-foreground hover:border-primary/50"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          selected ? "border-primary" : "border-muted-foreground"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-primary-glow" />}
      </span>
      {Icon && <Icon size={14} className={selected ? "text-primary-glow" : ""} />}
      {label}
    </button>
  );
}

function Review({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium truncate">{value || <span className="text-muted-foreground/60">—</span>}</span>
    </div>
  );
}
