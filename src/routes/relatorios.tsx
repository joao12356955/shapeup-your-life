import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Dumbbell,
  Flame,
  Scale,
  Percent,
  CalendarDays,
  ChevronDown,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { TopBar } from "@/components/shapeup/TopBar";
import { StatCard } from "@/components/shapeup/StatCard";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — ShapeUp" }] }),
  component: Relatorios,
});

const weight = [
  { d: "10/04", kg: 82 }, { d: "14/04", kg: 81.4 }, { d: "18/04", kg: 80.8 },
  { d: "22/04", kg: 80.1 }, { d: "26/04", kg: 79.5 }, { d: "30/04", kg: 79.1 },
  { d: "04/05", kg: 78.7 }, { d: "08/05", kg: 78.4 },
];

const volume = [
  { w: "07/04", v: 18200 }, { w: "14/04", v: 21800 }, { w: "21/04", v: 25600 },
  { w: "28/04", v: 24100 }, { w: "05/05", v: 24700 },
];

const macros = [
  { name: "Proteínas", value: 31, color: "oklch(0.62 0.24 295)" },
  { name: "Carboidratos", value: 39, color: "oklch(0.65 0.22 340)" },
  { name: "Gorduras", value: 30, color: "oklch(0.78 0.17 70)" },
];

const tabs = ["Visão geral", "Treinos", "Dieta", "Corporal", "Desempenho", "Hábitos"];

function Relatorios() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        <TopBar
          title="Relatórios"
          subtitle="Dados que mostram sua evolução. Resultados que te motivam a continuar."
          searchPlaceholder="Buscar métricas, períodos..."
        />

        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  i === 0 ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pb-3">
            <span className="text-xs text-muted-foreground">Período</span>
            <button className="text-xs flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5">
              Últimos 30 dias <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard icon={CheckCircle2} label="Treinos concluídos" value="12" unit="de 16" hint="↑ 20% vs período anterior" />
          <StatCard icon={Dumbbell} label="Volume total (kg)" value="24.680" unit="kg" hint="↑ 18% vs período anterior" />
          <StatCard icon={Flame} label="Calorias médias" value="2.150" unit="kcal" hint="↑ 8% vs período anterior" />
          <StatCard icon={Scale} label="Peso médio" value="78.4" unit="kg" trend="2.6 kg" hint="desde o início" />
          <StatCard icon={Percent} label="% Gordura corporal" value="14.2" unit="%" trend="2.1%" hint="desde o início" />
          <StatCard icon={Flame} label="Streak atual" value="12" unit="dias" hint="Melhor: 18 dias" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Evolução do peso</h2>
              <button className="text-xs text-muted-foreground flex items-center gap-1 rounded-md border border-border px-2 py-1">
                Últimos 30 dias <ChevronDown size={12} />
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={weight} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <XAxis dataKey="d" stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[74, 82]} />
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(0.62 0.24 295)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="kg" stroke="oklch(0.62 0.24 295)" strokeWidth={3} dot={{ fill: "oklch(0.62 0.24 295)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Composição corporal</h2>
            <div className="space-y-3">
              {[
                { l: "Massa magra", v: "62.1 kg", p: 79 },
                { l: "Gordura corporal", v: "11.1 kg", p: 14 },
                { l: "Água corporal", v: "45.9 kg", p: 58 },
                { l: "Massa óssea", v: "3.2 kg", p: 4 },
              ].map((r) => (
                <div key={r.l}>
                  <div className="flex justify-between text-xs">
                    <span>{r.l}</span>
                    <span className="text-muted-foreground">{r.v} ({r.p}%)</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${r.p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Distribuição de macros</h2>
            <div className="flex items-center gap-4">
              <div className="relative h-36 w-36 shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={macros} dataKey="value" innerRadius={42} outerRadius={60} stroke="none">
                      {macros.map((m) => <Cell key={m.name} fill={m.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">2.150</span>
                  <span className="text-[10px] text-muted-foreground">kcal média</span>
                </div>
              </div>
              <div className="space-y-2 text-xs flex-1">
                {macros.map((m) => (
                  <div key={m.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
                    <span className="flex-1">{m.name}</span>
                    <span className="text-muted-foreground">{m.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Volume por semana (kg)</h2>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={volume} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                  <XAxis dataKey="w" stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(0.62 0.24 295)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="v" fill="oklch(0.62 0.24 295)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
          <h2 className="font-semibold mb-4">Recordes pessoais</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-left font-medium pb-3">Exercício</th>
                  <th className="text-right font-medium pb-3">Anterior</th>
                  <th className="text-right font-medium pb-3">Recorde atual</th>
                  <th className="text-right font-medium pb-3">Evolução</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { ex: "Supino Reto", prev: "80 kg", now: "100 kg", up: "25%" },
                  { ex: "Agachamento Smith", prev: "120 kg", now: "140 kg", up: "16%" },
                  { ex: "Leg Press 45°", prev: "200 kg", now: "260 kg", up: "30%" },
                  { ex: "Puxada Triângulo", prev: "60 kg", now: "75 kg", up: "25%" },
                  { ex: "Remada Curvada", prev: "60 kg", now: "80 kg", up: "33%" },
                ].map((r) => (
                  <tr key={r.ex}>
                    <td className="py-3 flex items-center gap-2 font-medium">
                      <Dumbbell size={14} className="text-primary-glow" /> {r.ex}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{r.prev}</td>
                    <td className="py-3 text-right font-semibold">{r.now}</td>
                    <td className="py-3 text-right text-success font-semibold">↑ {r.up}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shrink-0">
              <Sparkles size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">Insights ShapeUp AI</div>
              <p className="text-xs text-muted-foreground mb-3">Com base nos seus dados dos últimos 30 dias.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { i: TrendingUp, t: "Você aumentou 18% o volume total de treino. Continue assim!" },
                  { i: CalendarDays, t: "Sua consistência está excelente! 75% dos treinos concluídos." },
                  { i: Percent, t: "Redução de 2.1% na gordura corporal. Ótimo progresso!" },
                ].map((c, i) => {
                  const Icon = c.i;
                  return (
                    <div key={i} className="flex items-start gap-2 rounded-xl bg-secondary/40 border border-border p-3">
                      <Icon size={16} className="text-primary-glow mt-0.5 shrink-0" />
                      <p className="text-xs">{c.t}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
