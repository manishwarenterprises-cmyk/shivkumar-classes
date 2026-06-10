import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { FAQS, SITE, COURSES } from "@/lib/site";

type Msg = { role: "bot" | "user"; text: string };

const SUGGESTIONS = [
  "What are the fees?",
  "What courses do you offer?",
  "Admission process?",
  "Class timings?",
  "Where are you located?",
];

function answer(q: string): string {
  const s = q.toLowerCase();
  if (/(fee|cost|price|charge)/.test(s))
    return "Our fees vary by course and are kept transparent and competitive. Please book a free demo or message us on WhatsApp at " + SITE.phone + " for a personalised quote.";
  if (/(course|class|subject|stream)/.test(s))
    return "We offer specialised commerce coaching for: " + COURSES.map((c) => c.title).join(", ") + ". Each course is taught personally by Shiv Sir.";
  if (/(admission|enroll|join|register)/.test(s))
    return "Admission is simple — 1) Book a free demo class, 2) Meet Shiv Sir for orientation, 3) Complete registration. It takes just one visit.";
  if (/(career|future|scope|job)/.test(s))
    return "Commerce opens doors to CA, CS, CMA, B.Com, BBA, MBA, Data Analytics, Banking, Finance and Entrepreneurship. Visit our Blog for detailed career guides.";
  if (/(location|where|address|map|reach)/.test(s))
    return "We are centrally located in " + SITE.city + ", easily reachable from all major commerce schools. See our Contact page for directions.";
  if (/(timing|schedule|hour|when)/.test(s))
    return "Morning, afternoon and evening batches are available. The evening batch (5:00 PM – 8:00 PM) is most popular with school students.";
  if (/(demo|trial|free)/.test(s))
    return "Yes! We offer a free demo class so you can experience the teaching style before enrolling. Book it from the Admission page.";
  const faq = FAQS.find((f) => s.split(" ").some((w) => w.length > 3 && f.q.toLowerCase().includes(w)));
  if (faq) return faq.a;
  return "Great question. I'd love to help — please WhatsApp us at " + SITE.phone + " or visit our Contact page and the team will respond personally within minutes.";
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hi! I'm the Commerce Assistant for Shiv Sir's Education Hub. Ask me about courses, fees, admissions, timings or career paths.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [msgs, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: answer(text) }]);
    }, 450);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 grid place-items-center rounded-full gradient-luxe text-white shadow-luxe hover:scale-105 transition"
        aria-label="Open assistant"
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
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full gradient-gold ring-2 ring-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))] glass shadow-luxe rounded-3xl overflow-hidden"
          >
            <div className="gradient-luxe text-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center ring-1 ring-white/20">
                  <Sparkles className="h-4 w-4 text-luxury" />
                </div>
                <div>
                  <div className="text-sm font-medium">Commerce Assistant</div>
                  <div className="text-[11px] text-white/60">Usually replies instantly</div>
                </div>
              </div>
            </div>
            <div ref={scrollRef} className="max-h-[340px] overflow-y-auto p-4 space-y-3 bg-background/50">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-white shadow-soft text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] rounded-full bg-white ring-1 ring-border px-2.5 py-1 hover:bg-muted transition"
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
                placeholder="Ask anything…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="h-8 w-8 grid place-items-center rounded-full gradient-luxe text-white">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
