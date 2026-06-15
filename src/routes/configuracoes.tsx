import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  User as UserIcon,
  Bell,
  Shield,
  Plug,
  SlidersHorizontal,
  Flame,
  Dumbbell,
  Trophy,
  Star,
  CheckCircle2,
  Clock,
  Crown,
  Building2,
  PlusCircle,
} from "lucide-react";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { TopBar } from "@/components/shapeup/TopBar";
import { PricingDialog } from "@/components/shapeup/PricingDialog";
import { useGym } from "@/lib/gym-store";
import { toast } from "sonner";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — ShapeUp" }] }),
  component: Configuracoes,
});

const tabs = [
  { id: "perfil", label: "Perfil", icon: UserIcon },
  { id: "prefs", label: "Preferências", icon: SlidersHorizontal },
  { id: "notif", label: "Notificações", icon: Bell },
  { id: "priv", label: "Privacidade", icon: Shield },
  { id: "integ", label: "Integrações", icon: Plug },
];

const skinTones = ["#f1c7a8", "#d99875", "#a8714d", "#74442a", "#3d2515"];

function Configuracoes() {
  const [tab, setTab] = useState("perfil");
  const [muscle, setMuscle] = useState(75);
  const [bodyType, setBodyType] = useState(1);
  const [skin, setSkin] = useState(0);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        <TopBar
          title="Meu perfil"
          subtitle="Gerencie suas informações, avatar e preferências."
        />

        <div className="flex gap-6 border-b border-border overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Avatar */}
            <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold">Personalização do avatar</h2>
              <p className="text-xs text-muted-foreground mb-5">
                Crie e customize seu avatar para te representar na sua jornada.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-5">
                <div className="space-y-1">
                  {["Corpo", "Cabelo", "Rosto", "Roupas", "Acessórios", "Tatuagens"].map((c, i) => (
                    <button
                      key={c}
                      className={`w-full text-left text-sm rounded-lg px-3 py-2 transition ${
                        i === 0 ? "bg-primary/20 text-primary-glow border border-primary/40" : "hover:bg-primary/10 text-muted-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl bg-gradient-to-b from-primary/10 to-secondary/40 border border-border flex items-center justify-center min-h-[260px]">
                  <div className="text-center text-muted-foreground text-xs p-6">
                    <div className="h-32 w-32 mx-auto rounded-full bg-gradient-primary/30 border-4 border-primary/40 flex items-center justify-center">
                      <UserIcon size={48} className="text-primary-glow" />
                    </div>
                    <p className="mt-3">Pré-visualização do avatar</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Tipo de corpo</div>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((i) => (
                        <button
                          key={i}
                          onClick={() => setBodyType(i)}
                          className={`aspect-square rounded-lg border flex items-center justify-center transition ${
                            bodyType === i ? "border-primary bg-primary/15 shadow-glow" : "border-border bg-secondary/40"
                          }`}
                        >
                          <UserIcon size={22} className={bodyType === i ? "text-primary-glow" : "text-muted-foreground"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Tom de pele</div>
                    <div className="flex gap-2">
                      {skinTones.map((c, i) => (
                        <button
                          key={c}
                          onClick={() => setSkin(i)}
                          style={{ background: c }}
                          className={`h-9 w-9 rounded-full border-2 ${
                            skin === i ? "border-primary ring-2 ring-primary/40" : "border-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Musculatura</span>
                      <span className="font-semibold">{muscle}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={muscle}
                      onChange={(e) => setMuscle(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <button className="w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition">
                    Salvar alterações
                  </button>
                </div>
              </div>
            </section>

            {/* Vínculo com academia */}
            <GymSection />

            {/* Personal info */}
            <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold">Informações pessoais</h2>
              <p className="text-xs text-muted-foreground mb-5">Atualize seus dados pessoais.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Nome" defaultValue="João Victor" />
                <Field label="E-mail" defaultValue="joaovictor@email.com" type="email" />
                <Field label="Data de nascimento" defaultValue="1998-08-15" type="date" />
                <Field label="Altura" defaultValue="1,78 m" />
                <Field label="Peso atual" defaultValue="78,4 kg" />
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">Objetivo</div>
                  <select className="w-full rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary">
                    <option>Ganho de massa</option>
                    <option>Perda de gordura</option>
                    <option>Definição muscular</option>
                    <option>Performance</option>
                  </select>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button className="rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition">
                  Salvar informações
                </button>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold">Seu avatar</h2>
              <p className="text-xs text-muted-foreground mb-4">Veja como seu avatar aparece no app.</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-xl shadow-glow">
                  JV
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Nível 12</div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full w-[82%] bg-gradient-primary" />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">1.240 / 1.500 XP</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/40 border border-border p-3">
                <Trophy size={16} className="text-primary-glow" />
                <div className="text-xs">
                  <span className="font-semibold">Próximo nível</span> — 260 XP para o nível 13
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Conquistas recentes</h2>
                <button className="text-xs text-primary-glow">Ver todas</button>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { i: Flame, l: "Foco total", c: "text-orange-400 bg-orange-500/20" },
                  { i: Dumbbell, l: "Força", c: "text-cyan-400 bg-cyan-500/20" },
                  { i: Trophy, l: "Persistência", c: "text-amber-400 bg-amber-500/20" },
                  { i: Star, l: "Disciplina", c: "text-pink-400 bg-pink-500/20" },
                ].map((a) => {
                  const Icon = a.i;
                  return (
                    <div key={a.l} className="space-y-2">
                      <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${a.c}`}>
                        <Icon size={20} />
                      </div>
                      <div className="text-xs font-semibold">{a.l}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h2 className="font-semibold">Estatísticas gerais</h2>
              <p className="text-xs text-muted-foreground mb-4">Seu desempenho em números.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { i: CheckCircle2, l: "Treinos realizados", v: "128", h: "↑ 18 este mês" },
                  { i: Flame, l: "Dias consecutivos", v: "12", h: "Melhor: 18 dias" },
                  { i: Flame, l: "Calorias queimadas", v: "12.450", h: "↑ 1.250 este mês" },
                  { i: Clock, l: "Tempo de treino", v: "48h 32m", h: "↑ 5h este mês" },
                ].map((s) => {
                  const Icon = s.i;
                  return (
                    <div key={s.l} className="rounded-xl bg-secondary/40 border border-border p-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon size={14} className="text-primary-glow" /> {s.l}
                      </div>
                      <div className="text-xl font-bold mt-1">{s.v}</div>
                      <div className="text-[10px] text-success mt-1">{s.h}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-primary/15 to-pink-500/10 border border-primary/40 p-5 shadow-glow text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/30">
                <Crown size={20} className="text-primary-glow" />
              </div>
              <div>
                <div className="font-bold">Seja Premium</div>
                <p className="text-xs text-muted-foreground">
                  Desbloqueie recursos exclusivos e leve sua evolução ao próximo nível.
                </p>
              </div>
              <PricingDialog>
                <button className="w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition">
                  Ver planos
                </button>
              </PricingDialog>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function GymSection() {
  const { gym, isLinked, link, unlink } = useGym();
  return (
    <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-glow">
            <Building2 size={20} className="text-primary-glow" />
          </div>
          <div>
            <h2 className="font-semibold">Vínculo com academia</h2>
            <p className="text-xs text-muted-foreground">
              {isLinked
                ? "Você está vinculado a uma academia parceira."
                : "Vincule-se a uma academia para acessar comunidade e desafios."}
            </p>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <span className="text-xs text-muted-foreground">{isLinked ? "Vinculado" : "Sem vínculo"}</span>
          <span className="relative inline-flex h-6 w-11 items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isLinked}
              onChange={(e) => {
                if (e.target.checked) {
                  link();
                  toast.success("Academia vinculada!");
                } else {
                  unlink();
                  toast("Vínculo removido.");
                }
              }}
            />
            <span className="absolute inset-0 rounded-full bg-secondary border border-border transition peer-checked:bg-primary/40 peer-checked:border-primary/60" />
            <span className="absolute left-0.5 h-5 w-5 rounded-full bg-foreground/80 transition peer-checked:translate-x-5 peer-checked:bg-primary-glow" />
          </span>
        </label>
      </div>

      <div className="mt-4 rounded-xl bg-secondary/40 border border-border p-4">
        {isLinked ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/30 to-pink-500/20 border border-primary/40 flex items-center justify-center">
              <Building2 size={18} className="text-primary-glow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{gym!.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {gym!.unit} {gym!.city ? "• " + gym!.city : ""} {gym!.code ? "• " + gym!.code : ""}
              </div>
            </div>
            <Link to="/academia" className="text-xs text-primary-glow hover:underline">
              Abrir
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              placeholder="Código da academia"
              className="flex-1 rounded-lg bg-background/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={() => {
                link();
                toast.success("Academia vinculada!");
              }}
              className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold shadow-glow hover:opacity-90 transition"
            >
              Vincular
            </button>
            <Link
              to="/cadastrar-academia"
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-secondary border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition"
            >
              <PlusCircle size={14} /> Cadastrar
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
