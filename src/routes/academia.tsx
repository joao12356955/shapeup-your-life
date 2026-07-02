import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Building2,
  Flame,
  Trophy,
  Users,
  Dumbbell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  Link2,
} from "lucide-react";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { TopBar } from "@/components/shapeup/TopBar";
import { useGym } from "@/lib/gym-store";

export const Route = createFileRoute("/academia")({
  head: () => ({ meta: [{ title: "Academia — ShapeUp" }] }),
  component: AcademiaPage,
});

function AcademiaPage() {
  const { gym, isLinked, link } = useGym();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        <TopBar
          title={isLinked ? gym!.name : "Academia"}
          subtitle={
            isLinked
              ? `${gym!.unit ?? ""} ${gym!.city ? "• " + gym!.city : ""}`.trim()
              : "Conecte-se à comunidade da sua academia."
          }
        />

        {isLinked && gym ? <LinkedView gym={gym} /> : <UnlinkedView onQuickLink={() => link()} />}
      </main>
    </div>
  );
}

/* ---------------- UNLINKED ---------------- */

function UnlinkedView({ onQuickLink }: { onQuickLink: () => void }) {
  return (
    <section className="rounded-2xl bg-gradient-card border border-border p-8 lg:p-12 shadow-card text-center max-w-3xl mx-auto">
      <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-glow">
        <Building2 size={36} className="text-primary-glow" />
      </div>
      <h2 className="mt-6 text-2xl font-bold">Vincule-se à sua academia</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        Participe de desafios, rankings e eventos exclusivos da sua academia. Tenha
        acesso ao feed da comunidade e à evolução dos alunos.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
        <input
          placeholder="Código da academia"
          className="rounded-lg bg-secondary/60 border border-border px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={onQuickLink}
          className="rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Link2 size={16} /> Vincular agora
        </button>
      </div>

      <div className="mt-6 text-xs text-muted-foreground">
        Não tem uma academia parceira?{" "}
        <Link
          to="/cadastrar-academia"
          className="text-primary-glow font-semibold hover:underline inline-flex items-center gap-1"
        >
          <PlusCircle size={12} /> Cadastre sua academia
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {[
          { i: Trophy, t: "Desafios exclusivos", d: "Compita com outros alunos." },
          { i: Users, t: "Ranking e comunidade", d: "Veja o feed e o ranking mensal." },
          { i: CalendarDays, t: "Eventos e aulas", d: "Receba notificações dos próximos eventos." },
        ].map((b) => {
          const Icon = b.i;
          return (
            <div key={b.t} className="rounded-xl bg-secondary/40 border border-border p-4">
              <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                <Icon size={18} className="text-primary-glow" />
              </div>
              <div className="font-semibold text-sm">{b.t}</div>
              <p className="text-xs text-muted-foreground mt-1">{b.d}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- LINKED ---------------- */

const stats = [
  { i: Flame, l: "Sequência atual", v: "12 dias", h: "Melhor: 18 dias" },
  { i: CheckCircle2, l: "Check-in hoje", v: "Feito!", h: "08:45 • Treino de Peito" },
  { i: Dumbbell, l: "Treinos esta semana", v: "5 treinos", h: "+2 vs semana passada" },
  { i: Trophy, l: "Metas da semana", v: "3/4", h: "75% concluído" },
];

const feed = [
  { name: "Mariana Silva", time: "Há 30 min", streak: 7, msg: "Treino concluído com foco total! 💪 Costas + Bíceps" },
  { name: "Lucas T.", time: "Há 1 h", streak: 4, msg: "Check-in realizado ✅ Bora pra cima!" },
  { name: "Rafael A.", time: "Há 2 h", streak: 12, msg: "Treino de perna pesado hoje! 🦵 Foco no progresso!" },
];

const challenges = [
  { t: "Desafio Gaviões - Queima Total", end: "Termina em 18 dias", p: 126, of: 200 },
  { t: "Desafio 30 Treinos", end: "Termina em 10 dias", p: 78, of: 150 },
  { t: "Desafio Meta Batida", end: "Termina em 25 dias", p: 54, of: 120 },
];

const ranking = [
  { n: "Rafael A.", lv: 12, t: 32, xp: "2.450" },
  { n: "Mariana Silva", lv: 11, t: 28, xp: "2.120" },
  { n: "Lucas T.", lv: 10, t: 27, xp: "1.980" },
  { n: "Amanda R.", lv: 9, t: 24, xp: "1.650" },
  { n: "Felipe M.", lv: 8, t: 22, xp: "1.420" },
];

function LinkedView() {
  const { gym } = useGym();
  return (
    <>
      {/* gym header */}
      <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/30 to-pink-500/20 border border-primary/40 flex items-center justify-center shadow-glow">
          <Building2 size={28} className="text-primary-glow" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold truncate">{gym!.name}</h2>
            <BadgeCheck size={18} className="text-primary-glow" />
          </div>
          <div className="text-xs text-muted-foreground">
            {gym!.unit} {gym!.city ? "• " + gym!.city : ""}
          </div>
        </div>
        <button className="rounded-lg bg-primary/15 border border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary-glow hover:bg-primary/25 transition">
          Mudar academia
        </button>
      </section>

      {/* stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.i;
          return (
            <div key={s.l} className="rounded-2xl bg-gradient-card border border-border p-4 shadow-card">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon size={14} className="text-primary-glow" /> {s.l}
              </div>
              <div className="text-2xl font-bold mt-1">{s.v}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{s.h}</div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* feed */}
        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card space-y-4">
          <h3 className="font-semibold">Feed da Academia</h3>
          <input
            placeholder="Compartilhe algo com sua academia..."
            className="w-full rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="space-y-4">
            {feed.map((f) => (
              <div key={f.name} className="rounded-xl bg-secondary/40 border border-border p-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold">
                    {f.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {f.time} • 🔥 Sequência: {f.streak} dias
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{f.msg}</p>
              </div>
            ))}
          </div>
          <button className="w-full text-xs text-primary-glow hover:underline">
            Ver mais publicações
          </button>
        </div>

        {/* challenges */}
        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Desafios da Academia</h3>
            <button className="text-xs text-primary-glow">Ver todos</button>
          </div>
          {challenges.map((c) => {
            const pct = Math.round((c.p / c.of) * 100);
            return (
              <div key={c.t} className="rounded-xl bg-secondary/40 border border-border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm">{c.t}</div>
                    <div className="text-[10px] text-primary-glow">{c.end}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold">{c.p} / {c.of}</div>
                    <div className="text-[10px] text-muted-foreground">participantes</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <button className="w-full text-xs text-primary-glow hover:underline">
            Ver todos os desafios
          </button>
        </div>

        {/* ranking */}
        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Ranking da Academia</h3>
            <span className="text-[10px] text-muted-foreground">Este mês</span>
          </div>
          <div className="space-y-3">
            {ranking.map((r, i) => (
              <div key={r.n} className="flex items-center gap-3">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0
                      ? "bg-amber-500/20 text-amber-400"
                      : i === 1
                      ? "bg-slate-400/20 text-slate-300"
                      : i === 2
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] font-bold">
                  {r.n.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{r.n}</div>
                  <div className="text-[10px] text-muted-foreground">Nível {r.lv}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold">{r.t} treinos</div>
                  <div className="text-[10px] text-primary-glow">{r.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full text-xs text-primary-glow hover:underline">
            Ver ranking completo
          </button>
        </div>
      </section>

      {/* event banner */}
      <section className="rounded-2xl bg-gradient-to-r from-primary/15 to-pink-500/10 border border-primary/30 p-5 shadow-glow flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/30 flex items-center justify-center">
          <CalendarDays size={26} className="text-primary-glow" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">Próximo evento da academia</div>
          <div className="text-sm text-muted-foreground">
            Aula de CrossFit Especial • Sábado às 09:00 • Sala 1 — Coach Pedro
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold shadow-glow hover:opacity-90 transition">
          Ver todos eventos <ChevronRight size={14} />
        </button>
      </section>
    </>
  );
}
