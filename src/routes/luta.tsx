import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Swords, Flame, Clock, Target, CheckCircle2, Trophy } from "lucide-react";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { TopBar } from "@/components/shapeup/TopBar";

export const Route = createFileRoute("/luta")({
  head: () => ({
    meta: [
      { title: "Luta — Muay Thai, Judô e Jiu-Jitsu | ShapeUp" },
      {
        name: "description",
        content:
          "Acompanhe seus treinos de Muay Thai, Judô e Jiu-Jitsu no ShapeUp: aulas da semana, técnicas do momento e progresso de graduação.",
      },
      { property: "og:title", content: "Luta — Muay Thai, Judô e Jiu-Jitsu | ShapeUp" },
      {
        property: "og:description",
        content: "Aulas, técnicas e evolução nas artes marciais dentro do ShapeUp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LutaPage,
});

type Art = "muaythai" | "judo" | "jiujitsu";

const ARTS: Record<
  Art,
  {
    label: string;
    tag: string;
    belt: string;
    beltPct: number;
    schedule: { day: string; time: string; focus: string }[];
    techniques: { name: string; detail: string }[];
    focus: string[];
  }
> = {
  muaythai: {
    label: "Muay Thai",
    tag: "Arte das oito armas",
    belt: "Faixa / Prajioud vermelho",
    beltPct: 45,
    schedule: [
      { day: "Segunda", time: "19:00 • 1h", focus: "Chutes e joelhos" },
      { day: "Quarta", time: "19:00 • 1h", focus: "Clinch e cotoveladas" },
      { day: "Sexta", time: "20:00 • 1h30", focus: "Sparring leve" },
    ],
    techniques: [
      { name: "Teep (chute frontal)", detail: "Controle de distância e quebra de ritmo" },
      { name: "Low kick", detail: "Rotação de quadril e apoio na planta do pé" },
      { name: "Joelhada no clinch", detail: "Postura ereta, controle da nuca" },
      { name: "Cotovelada horizontal", detail: "Curta distância, guarda alta" },
    ],
    focus: ["Condicionamento", "Explosão", "Resistência de pernas"],
  },
  judo: {
    label: "Judô",
    tag: "Caminho suave",
    belt: "Faixa verde",
    beltPct: 60,
    schedule: [
      { day: "Terça", time: "19:30 • 1h30", focus: "Nage-waza (projeções)" },
      { day: "Quinta", time: "19:30 • 1h30", focus: "Ne-waza (solo)" },
      { day: "Sábado", time: "10:00 • 2h", focus: "Randori" },
    ],
    techniques: [
      { name: "O-goshi", detail: "Projeção de quadril, entrada profunda" },
      { name: "Seoi-nage", detail: "Carga de ombro, tração no kumi-kata" },
      { name: "Uchi-mata", detail: "Varrida interna de coxa" },
      { name: "Kesa-gatame", detail: "Imobilização lateral no solo" },
    ],
    focus: ["Força de pegada", "Equilíbrio", "Quedas seguras (ukemi)"],
  },
  jiujitsu: {
    label: "Jiu-Jitsu",
    tag: "Jogo de solo",
    belt: "Faixa azul • 2 graus",
    beltPct: 35,
    schedule: [
      { day: "Segunda", time: "20:30 • 1h30", focus: "Guarda fechada" },
      { day: "Quarta", time: "20:30 • 1h30", focus: "Passagens de guarda" },
      { day: "Sábado", time: "11:00 • 2h", focus: "Rolas / sparring" },
    ],
    techniques: [
      { name: "Armlock da guarda", detail: "Quadril alinhado, controle do punho" },
      { name: "Triângulo", detail: "Ângulo e fechamento do canal" },
      { name: "Raspagem de gancho", detail: "Elevação com o pé no quadril" },
      { name: "Mata-leão", detail: "Costas com ganchos travados" },
    ],
    focus: ["Mobilidade de quadril", "Core", "Resistência isométrica"],
  },
};

const ORDER: Art[] = ["muaythai", "judo", "jiujitsu"];

function LutaPage() {
  const [art, setArt] = useState<Art>("muaythai");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const data = ARTS[art];

  const totalAulas = ORDER.reduce((acc, a) => acc + ARTS[a].schedule.length, 0);
  const feitas = Object.values(done).filter(Boolean).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        <TopBar title="Luta" subtitle="Muay Thai, Judô e Jiu-Jitsu em um só lugar." />

        {/* seleção de modalidade */}
        <section className="flex flex-wrap gap-3">
          {ORDER.map((a) => {
            const active = a === art;
            return (
              <button
                key={a}
                onClick={() => setArt(a)}
                className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                  active
                    ? "bg-sidebar-active border-primary/50 shadow-glow"
                    : "bg-gradient-card border-border hover:border-primary/40 hover:bg-primary/10"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Swords size={16} className="text-primary-glow" /> {ARTS[a].label}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{ARTS[a].tag}</div>
              </button>
            );
          })}
        </section>

        {/* resumo */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: Flame, l: "Aulas marcadas", v: `${data.schedule.length}/semana` },
            { i: CheckCircle2, l: "Aulas concluídas", v: `${feitas} de ${totalAulas}` },
            { i: Trophy, l: "Graduação", v: data.belt },
            { i: Target, l: "Foco físico", v: data.focus[0] },
          ].map((s) => {
            const Icon = s.i;
            return (
              <div
                key={s.l}
                className="rounded-2xl bg-gradient-card border border-border p-4 shadow-card"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon size={14} className="text-primary-glow" /> {s.l}
                </div>
                <div className="text-lg font-bold mt-1">{s.v}</div>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* agenda */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card space-y-4 xl:col-span-2">
            <h2 className="font-semibold">Aulas de {data.label}</h2>
            <div className="space-y-3">
              {data.schedule.map((s) => {
                const key = `${art}-${s.day}`;
                const isDone = !!done[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl bg-secondary/40 border border-border p-4 flex items-center gap-4"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Clock size={18} className="text-primary-glow" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">
                        {s.day} — {s.focus}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{s.time}</div>
                    </div>
                    <button
                      onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        isDone
                          ? "bg-primary/20 text-primary-glow border border-primary/40"
                          : "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                      }`}
                    >
                      {isDone ? "Concluída" : "Marcar aula"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progresso da graduação</span>
                <span className="font-semibold">{data.beltPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-primary" style={{ width: `${data.beltPct}%` }} />
              </div>
            </div>
          </div>

          {/* técnicas */}
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card space-y-4">
            <h2 className="font-semibold">Técnicas em treino</h2>
            <div className="space-y-3">
              {data.techniques.map((t) => (
                <div key={t.name} className="rounded-xl bg-secondary/40 border border-border p-3">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t.detail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-primary/10 border border-primary/30 p-3">
              <div className="text-xs font-semibold text-primary-glow">Foco físico</div>
              <p className="text-xs text-muted-foreground mt-1">{data.focus.join(" • ")}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
