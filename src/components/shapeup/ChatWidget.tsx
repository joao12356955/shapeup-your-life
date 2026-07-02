import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "ai" | "user"; text: string };

const INITIAL: Msg[] = [
  { role: "ai", text: "Qual seu pedido de hoje, atleta? 💪" },
];

const REPLIES = [
  "Bora! Vou montar isso pra você. 🔥",
  "Ótima escolha, atleta! Foco total.",
  "Combinado! Já tô preparando seu plano.",
  "Show! Consistência é tudo. 💯",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { role: "ai", text: REPLIES[Math.floor(Math.random() * REPLIES.length)] },
      ]);
    }, 600);
  };

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
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-border p-3 bg-card"
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
