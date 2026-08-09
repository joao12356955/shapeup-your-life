import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import {
  BOTTLE_ML,
  MEAL_OPTIONS,
  MEAL_SLOTS,
  WATER_GOAL_ML,
  dateKey,
  emptyDay,
  sumMacros,
  useDailyLogs,
} from "@/lib/daily-store";
import { useCurrentUser } from "@/lib/user-store";
import { workoutForDay } from "@/lib/workout-split";
import type { DayLog } from "@/lib/daily-store";
import type { UserProfile } from "@/lib/user-store";

type Msg = { role: "ai" | "user"; text: string };

const INITIAL: Msg[] = [
  { role: "ai", text: "Qual seu pedido de hoje, atleta? 💪" },
];

const FALLBACK = [
  "Pode me perguntar sobre água 💧, treino 🏋️ ou alimentação 🍽️ que eu te conto como você está hoje!",
  "Tô aqui pra acompanhar seu dia! Tente: “quanto de água eu bebi?” ou “qual meu treino de amanhã?”",
];

function has(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

function litros(ml: number) {
  return (ml / 1000).toFixed(ml % 1000 === 0 ? 0 : 1).replace(".", ",");
}

function waterReply(day: DayLog) {
  const ml = day.waterMl ?? 0;
  const bottles = Math.round((ml / BOTTLE_ML) * 10) / 10;
  const pct = Math.round((ml / WATER_GOAL_ML) * 100);
  if (ml <= 0) {
    return "💧 Você ainda não registrou água hoje. Bora começar com uma garrafinha de 500ml? Sua meta é 3L (6 garrafas)!";
  }
  if (ml >= WATER_GOAL_ML) {
    return `💧 Meta batida! ${litros(ml)}L hoje (${bottles} garrafas) — ${pct}% da meta. Hidratação nível atleta! 🏆`;
  }
  const falta = WATER_GOAL_ML - ml;
  return `💧 Você bebeu ${litros(ml)}L hoje (${bottles} de 6 garrafas, ${pct}% da meta). Faltam ${litros(falta)}L — cada 500ml extra ainda rende XP! 🔥`;
}

function workoutReply(day: DayLog) {
  const now = new Date();
  const hoje = workoutForDay(now.getDay());
  const t = new Date(now);
  t.setDate(now.getDate() + 1);
  const amanha = workoutForDay(t.getDay());
  const feito = day.workoutDone
    ? `✅ Treino de hoje concluído: ${hoje.name} — ${hoje.focus} (${hoje.duration}). +300 XP na conta! 💥`
    : `🏋️ Treino de hoje: ${hoje.name} — ${hoje.focus} (${hoje.duration}). Ainda não marcado como concluído, dá tempo!`;
  const next = amanha.rest
    ? `😌 Amanhã é ${amanha.name} — ${amanha.focus} (${amanha.duration}). Recuperar também é treinar.`
    : `📅 Amanhã: ${amanha.name} — ${amanha.focus} (${amanha.duration}). Já pode separar a roupa! 😉`;
  return `${feito}\n${next}`;
}

function mealReply(day: DayLog, user?: UserProfile | null) {
  const meals = day.meals ?? [];
  const feitas = new Set(meals.map((m) => m.slot));
  const proxima = MEAL_SLOTS.find((s) => !feitas.has(s));
  const macros = sumMacros(meals);
  const meta = user?.dieta?.metaCalorica;
  const resumo = meals.length
    ? `🍽️ Hoje você registrou ${meals.length} refeição(ões): ${macros.kcal} kcal${meta ? ` de ${meta} kcal` : ""} • P ${macros.protein}g • C ${macros.carbs}g • G ${macros.fat}g.`
    : "🍽️ Nenhuma refeição registrada hoje ainda.";
  if (!proxima) {
    return `${resumo}\n🎉 Todas as refeições do dia estão completas — isso vale +100 XP. Mandou bem!`;
  }
  const sug = MEAL_OPTIONS[proxima]?.[0];
  return `${resumo}\n⏭️ Próxima refeição: ${proxima}${sug ? ` — sugestão: ${sug.name} (${sug.kcal} kcal, ${sug.protein}g de proteína)` : ""}. Bora manter o ritmo! 💪`;
}

function weightReply(day: DayLog, user?: UserProfile | null) {
  const peso = day.weightKg ?? user?.peso;
  if (!peso) return "⚖️ Você ainda não registrou seu peso. Registra que eu acompanho sua evolução!";
  const meta = user?.pesoMeta;
  return `⚖️ Peso atual: ${peso} kg${meta ? ` • meta: ${meta} kg (faltam ${Math.abs(peso - meta).toFixed(1)} kg)` : ""}. Constância vence! 📈`;
}

function reply(text: string, day: DayLog, user?: UserProfile | null) {
  const t = text.toLowerCase();
  if (has(t, ["agua", "água", "hidrat", "litro", "garrafa", "beb"])) return waterReply(day);
  if (has(t, ["treino", "treinar", "exerc", "academia", "musculac", "cardio", "amanh"]))
    return workoutReply(day);
  if (has(t, ["aliment", "comida", "refei", "dieta", "comer", "caloria", "macro", "kcal", "proteina", "proteína"]))
    return mealReply(day, user);
  if (has(t, ["peso", "emagre", "imc", "balanc"])) return weightReply(day, user);
  if (has(t, ["resumo", "dia", "como estou", "status", "hoje"]))
    return `${waterReply(day)}\n\n${workoutReply(day)}\n\n${mealReply(day, user)}`;
  if (has(t, ["oi", "ola", "olá", "bom dia", "boa noite", "boa tarde", "e ai", "e aí"]))
    return `E aí${user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋 Quer saber da sua água, do treino ou da próxima refeição?`;
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)]!;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const user = useCurrentUser();
  const { logs } = useDailyLogs(user?.email);
  const today = logs[dateKey()] ?? emptyDay;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: reply(t, today, user) }]);
    }, 500);
  };

  const quick = ["Quanto de água bebi?", "Meu treino de hoje", "Próxima refeição"];

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm rounded-2xl border border-primary/40 bg-card/95 backdrop-blur-xl shadow-elegant overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
          <div className="flex items-center gap-3 border-b border-border bg-gradient-primary/20 p-4">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles size={18} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Shappinho AI</div>
              <div className="text-[10px] text-primary-glow flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                Online agora
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition"
              aria-label="Fechar chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-background/40">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary/70 border border-border rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border px-3 pt-2 bg-card">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setMsgs((m) => [
                    ...m,
                    { role: "user", text: q },
                    { role: "ai", text: reply(q, today, user) },
                  ]);
                }}
                className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] text-primary-glow hover:bg-primary/20 transition"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 p-3 bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Envie uma mensagem..."
              className="flex-1 rounded-full bg-secondary/60 border border-border px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow hover:opacity-90 transition"
              aria-label="Enviar"
            >
              <Send size={15} className="text-primary-foreground" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center hover:scale-105 transition"
        aria-label="Abrir chat Shappinho AI"
      >
        {open ? (
          <X size={22} className="text-primary-foreground" />
        ) : (
          <MessageCircle size={22} className="text-primary-foreground" />
        )}
      </button>
    </>
  );
}
