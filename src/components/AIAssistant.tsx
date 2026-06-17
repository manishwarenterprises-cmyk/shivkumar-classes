import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/chat.functions";

type Msg = { role: "assistant" | "user"; content: string };

const SUGGESTIONS = [
  "What courses do you offer?",
  "Explain Journal Entry with example",
  "Admission process?",
  "Difference between B.Com and BBA?",
  "Class timings & location?",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Namaste! 🙏 I'm the AI assistant for Shiv Sir's Education Hub. Ask me anything — about courses, fees, admissions, or even commerce concepts like journal entries, GST or supply & demand. How can I help?",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askAssistant);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [msgs, open, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const { reply } = await ask({ data: { messages: next } });
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Connection issue. Please try again.";
      setMsgs((m) => [...m, { role: "assistant", content: `⚠️ ${msg}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 grid place-items-center rounded-full gradient-luxe text-white shadow-luxe hover:scale-105 transition"
        aria-label="Open AI assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div key="m" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <MessageCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full gradient-gold ring-2 ring-white animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[min(400px,calc(100vw-2rem))] glass shadow-luxe rounded-3xl overflow-hidden"
          >
            <div className="gradient-luxe text-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20">
                  <Sparkles className="h-4 w-4 text-luxury" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-wide">Commerce AI Assistant</div>
                  <div className="text-[11px] text-white/70">Powered by Lovable AI · Trained on Education Hub</div>
                </div>
              </div>
            </div>
            <div ref={scrollRef} className="max-h-[380px] overflow-y-auto p-4 space-y-3 bg-background/50">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-white shadow-soft text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-soft rounded-2xl px-3.5 py-2.5 text-sm text-muted-foreground inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-luxury" />
                    Thinking…
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={busy}
                  className="text-[11px] rounded-full bg-white ring-1 ring-border px-2.5 py-1 hover:bg-muted transition disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 p-3 border-t border-border bg-white"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about courses, admission or commerce…"
                disabled={busy}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="h-8 w-8 grid place-items-center rounded-full gradient-luxe text-white disabled:opacity-50"
                aria-label="Send"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
