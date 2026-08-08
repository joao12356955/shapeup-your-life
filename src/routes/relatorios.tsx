import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Dumbbell,
  Flame,
  Scale,
  Droplet,
  CalendarDays,
  ChevronDown,
  TrendingUp,
  Sparkles,
  Heart,
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
import { useCurrentUser } from "@/lib/user-store";
import { useStats } from "@/lib/stats";
import { XP_WORKOUT } from "@/lib/xp";
import { useXp } from "@/lib/xp";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — ShapeUp" },
      { name: "description", content: "Relatórios de treinos, dieta e evolução corporal atualizados com os seus registros no ShapeUp." },
      { property: "og:title", content: "Relatórios — ShapeUp" },
      { property: "og:description", content: "Acompanhe treinos, calorias, água e evolução do peso com dados reais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Relatorios,
});

const tabs = ["Visão geral", "Treinos", "Dieta", "Corporal", "Desempenho", "Hábitos"];

function Relatorios() {
  const user = useCurrentUser();
  const s = useStats(user);
  const xp = useXp(user?.email);
  const [hoje, setHoje] = useState("—");
  useEffect(() => setHoje(new Date().toLocaleDateString("pt-BR")), []);

  const weight = s.weights.map((w) => ({ d: w.d, kg: w.kg }));
  const wMin = weight.length ? Math.min(...weight.map((w) => w.kg)) - 2 : 60;
  const wMax = weight.length ? Math.max(...weight.map((w) => w.kg)) + 2 : 100;
  const volume = s.weeklyWorkouts;
  const macros = s.macros.filter((m) => m.value > 0);
  const hasMacros = macros.length > 0;

  const composicao = [
    { l: "Peso atual", v: s.peso ? `${s.peso.toFixed(1)} kg` : "—", p: s.peso && s.pesoMeta ? Math.min(100, Math.round((s.pesoMeta / s.peso) * 100)) : 0 },
    { l: "Meta de peso", v: s.pesoMeta ? `${s.pesoMeta.toFixed(1)} kg` : "—", p: s.pesoMeta ? 100 : 0 },
    { l: "IMC", v: s.imc ? `${s.imc.toFixed(1)} (${s.imcLabel})` : "—", p: s.imc ? Math.min(100, Math.round((s.imc / 40) * 100)) : 0 },
    { l: "Altura", v: s.altura ? `${s.altura} cm` : "—", p: s.altura ? Math.min(100, Math.round((s.altura / 220) * 100)) : 0 },
  ];

  const insights = [
    {
      i: TrendingUp,
      t:
        s.pesoDelta !== undefined
          ? `Seu peso variou ${s.pesoDelta > 0 ? "+" : "-"}${Math.abs(s.pesoDelta).toFixed(1)} kg desde o primeiro registro.`
          : "Registre seu peso no dashboard para acompanhar sua variação.",
    },
    {
      i: CalendarDays,
      t: `Você concluiu ${s.workoutsDone} treino(s) e acumulou ${s.workoutsDone * XP_WORKOUT} XP com eles.`,
    },
    {
      i: Droplet,
      t: s.avgWaterMl
        ? `Sua média de água é de ${(s.avgWaterMl / 1000).toFixed(1)} L por dia (${s.waterGoalDays} dia(s) na meta).`
        : "Registre sua ingestão de água para receber insights de hidratação.",
    },
  ];

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
            <span className="text-xs text-muted-foreground">Atualizado em</span>
            <button className="text-xs flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5">
              {hoje} <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            icon={CheckCircle2}
            label="Treinos concluídos"
            value={String(s.workoutsDone)}
            unit={`de ${s.workoutsGoal}`}
            hint={`+${s.workoutsDone * XP_WORKOUT} XP em treinos`}
          />
          <StatCard
            icon={Dumbbell}
            label="Dias registrados"
            value={String(s.daysLogged)}
            unit="dias"
            hint={`${s.mealDays} dia(s) com refeições`}
          />
          <StatCard
            icon={Flame}
            label="Calorias médias"
            value={s.avgKcal ? s.avgKcal.toLocaleString("pt-BR") : "—"}
            unit="kcal"
            hint="média dos dias com refeições"
          />
          <StatCard
            icon={Scale}
            label="Peso atual"
            value={s.peso ? s.peso.toFixed(1) : "—"}
            unit="kg"
            trend={s.pesoDelta !== undefined ? `${Math.abs(s.pesoDelta).toFixed(1)} kg` : undefined}
            hint={s.pesoDelta !== undefined ? "desde o início" : "registre seu peso"}
          />
          <StatCard
            icon={Heart}
            label="IMC"
            value={s.imc ? s.imc.toFixed(1) : "—"}
            unit=""
            hint={s.imcLabel}
          />
          <StatCard
            icon={Flame}
            label="Streak atual"
            value={String(s.streak)}
            unit="dias"
            hint={`Melhor: ${s.best} dias`}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Evolução do peso</h2>
              <span className="text-xs text-muted-foreground">{s.weights.length} registro(s)</span>
            </div>
            <div className="h-64">
              {weight.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground text-center px-6">
                  Registre seu peso no dashboard para ver a evolução aqui.
                </div>
              ) : (
                <ResponsiveContainer>
                  <LineChart data={weight} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                    <XAxis dataKey="d" stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[Math.floor(wMin), Math.ceil(wMax)]} />
                    <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(0.62 0.24 295)", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="kg" stroke="oklch(0.62 0.24 295)" strokeWidth={3} dot={{ fill: "oklch(0.62 0.24 295)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Perfil corporal</h2>
            <div className="space-y-3">
              {composicao.map((r) => (
                <div key={r.l}>
                  <div className="flex justify-between text-xs">
                    <span>{r.l}</span>
                    <span className="text-muted-foreground">{r.v}</span>
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
            {!hasMacros ? (
              <p className="text-xs text-muted-foreground">
                Registre suas refeições para ver a distribuição de macronutrientes.
              </p>
            ) : (
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
                    <span className="text-lg font-bold">{s.avgKcal.toLocaleString("pt-BR")}</span>
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
            )}
          </div>

          <div className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
            <h2 className="font-semibold mb-4">Treinos por semana</h2>
            <div className="h-56">
              {volume.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground text-center px-6">
                  Marque seus treinos como concluídos para acompanhar o volume semanal (+{XP_WORKOUT} XP por treino).
                </div>
              ) : (
                <ResponsiveContainer>
                  <BarChart data={volume} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                    <XAxis dataKey="w" stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="oklch(0.6 0.03 285)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "oklch(0.17 0.035 280)", border: "1px solid oklch(0.62 0.24 295)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="v" fill="oklch(0.62 0.24 295)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
          <h2 className="font-semibold mb-4">Histórico de XP</h2>
          {xp.history.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Nenhum XP ainda. Conclua treinos (+{XP_WORKOUT} XP), refeições e a meta de água para pontuar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium pb-3">Dia</th>
                    <th className="text-left font-medium pb-3">Conquistas</th>
                    <th className="text-right font-medium pb-3">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {xp.history.slice(0, 10).map((h) => (
                    <tr key={h.key}>
                      <td className="py-3 font-medium">{h.key.split("-").reverse().join("/")}</td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {h.items.map((i) => i.label).join(" • ")}
                      </td>
                      <td className="py-3 text-right text-success font-semibold">+{h.total} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shrink-0">
              <Sparkles size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">Insights ShapeUp AI</div>
              <p className="text-xs text-muted-foreground mb-3">Com base nos seus registros até agora.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {insights.map((c, i) => {
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
