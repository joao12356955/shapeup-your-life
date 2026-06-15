import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  User as UserIcon,
  Globe,
  Users,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Sidebar } from "@/components/shapeup/Sidebar";
import { TopBar } from "@/components/shapeup/TopBar";
import { useGym } from "@/lib/gym-store";

export const Route = createFileRoute("/cadastrar-academia")({
  head: () => ({ meta: [{ title: "Cadastre sua academia — ShapeUp" }] }),
  component: CadastrarAcademia,
});

function CadastrarAcademia() {
  const navigate = useNavigate();
  const { link } = useGym();

  const [form, setForm] = useState({
    name: "",
    unit: "",
    city: "",
    address: "",
    email: "",
    phone: "",
    responsible: "",
    site: "",
    students: "",
    plan: "start",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Informe o nome da academia.");
      return;
    }
    link({
      name: form.name,
      unit: form.unit || "Unidade principal",
      city: form.city,
      code: form.name.replace(/\s+/g, "-").toUpperCase().slice(0, 12),
    });
    toast.success("Academia cadastrada e vinculada!");
    navigate({ to: "/academia" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
        <TopBar
          title="Cadastre sua academia"
          subtitle="Leve o ShapeUp para a sua academia e transforme a experiência dos alunos."
        />

        <Link
          to="/academia"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary-glow"
        >
          <ArrowLeft size={12} /> Voltar para Academia
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form
            onSubmit={submit}
            className="xl:col-span-2 rounded-2xl bg-gradient-card border border-border p-6 shadow-card space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-glow">
                <Building2 size={22} className="text-primary-glow" />
              </div>
              <div>
                <h2 className="font-semibold">Dados da academia</h2>
                <p className="text-xs text-muted-foreground">
                  Preencha as informações para criar o cadastro.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field icon={Building2} label="Nome da academia *" placeholder="Ex.: Academia Gaviões"
                value={form.name} onChange={update("name")} />
              <Field icon={Building2} label="Unidade / Filial" placeholder="Ex.: Unidade Centro"
                value={form.unit} onChange={update("unit")} />
              <Field icon={MapPin} label="Cidade / UF" placeholder="São Paulo - SP"
                value={form.city} onChange={update("city")} />
              <Field icon={MapPin} label="Endereço" placeholder="Rua, número, bairro"
                value={form.address} onChange={update("address")} />
              <Field icon={Mail} label="E-mail" type="email" placeholder="contato@academia.com"
                value={form.email} onChange={update("email")} />
              <Field icon={Phone} label="Telefone" placeholder="(11) 90000-0000"
                value={form.phone} onChange={update("phone")} />
              <Field icon={UserIcon} label="Responsável" placeholder="Nome do gestor"
                value={form.responsible} onChange={update("responsible")} />
              <Field icon={Globe} label="Site / Instagram" placeholder="@suaacademia"
                value={form.site} onChange={update("site")} />
              <Field icon={Users} label="Alunos ativos" type="number" placeholder="150"
                value={form.students} onChange={update("students")} />

              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Plano desejado</div>
                <select
                  value={form.plan}
                  onChange={update("plan")}
                  className="w-full rounded-lg bg-secondary/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="start">Academy Start — R$ 10/aluno</option>
                  <option value="pro">Academy Pro — R$ 15/aluno</option>
                  <option value="elite">Academy Elite — R$ 20/aluno</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2 border-t border-border">
              <Link
                to="/academia"
                className="rounded-lg bg-secondary/60 border border-border px-6 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="rounded-lg bg-gradient-primary px-6 py-2.5 text-sm font-semibold shadow-glow hover:opacity-90 transition inline-flex items-center justify-center gap-2"
              >
                <Sparkles size={14} /> Cadastrar academia
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <section className="rounded-2xl bg-gradient-card border border-border p-5 shadow-card">
              <h3 className="font-semibold">Por que cadastrar?</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  "Ambiente exclusivo com seus alunos",
                  "Ranking e desafios personalizados",
                  "Relatórios de retenção e engajamento",
                  "App white-label opcional",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-primary-glow mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-gradient-to-br from-primary/15 to-pink-500/10 border border-primary/40 p-5 shadow-glow space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/30 flex items-center justify-center">
                <Sparkles size={20} className="text-primary-glow" />
              </div>
              <div>
                <div className="font-bold">Suporte dedicado</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Nossa equipe ajuda na configuração inicial e migração dos seus alunos.
                </p>
              </div>
              <button className="w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold shadow-glow hover:opacity-90 transition">
                Falar com especialista
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  ...rest
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          {...rest}
          className="w-full rounded-lg bg-secondary/60 border border-border pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
