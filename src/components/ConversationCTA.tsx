import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, ArrowRight, Sparkles } from "lucide-react";
import { SITE } from "@/lib/site";
import { AmbientOrbs } from "@/components/AmbientOrbs";

type Step = {
  id: string;
  bot: string;
  chips: { label: string; next?: string; reply: string }[];
};

const FLOW: Record<string, Step> = {
  start: {
    id: "start",
    bot: "Namaste 🙏 Main Shiv Sir's Education Hub se. Aap kis class ki taiyari ker rahe ho?",
    chips: [
      { label: "11th Commerce", next: "goal", reply: "11th Commerce" },
      { label: "12th Commerce", next: "goal", reply: "12th Commerce" },
      { label: "B.Com", next: "goal", reply: "B.Com" },
      { label: "BBA", next: "goal", reply: "BBA" },
    ],
  },
  goal: {
    id: "goal",
    bot: "Behtareen! Aapka main goal kya hai?",
    chips: [
      { label: "90+ Board Score", next: "cta", reply: "90+ Board Score chahiye" },
      { label: "Concept Clarity", next: "cta", reply: "Concepts strong karne hain" },
      { label: "Career Guidance", next: "cta", reply: "Career guidance chahiye" },
    ],
  },
  cta: {
    id: "cta",
    bot: "Perfect. Ek free demo class attend keejiye — Shiv Sir se personally milna hoga. Kaise connect karein?",
    chips: [],
  },
};

export function ConversationCTA() {
  const [step, setStep] = useState<Step>(FLOW.start);
  const [replies, setReplies] = useState<string[]>([]);

  const choose = (chip: Step["chips"][number]) => {
    setReplies((r) => [...r, chip.reply]);
    if (chip.next) setTimeout(() => setStep(FLOW[chip.next!]), 350);
  };

  const reset = () => {
    setReplies([]);
    setStep(FLOW.start);
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <AmbientOrbs
        orbs={[
          { size: 380, top: "-8%", left: "-6%", color: "rgba(155,120,230,0.32)", parallax: -70 },
          { size: 300, top: "50%", right: "-4%", color: "rgba(198,169,105,0.26)", parallax: 70, delay: -3 },
        ]}
      />
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur ring-1 ring-luxury/30 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-luxury">
            <Sparkles className="h-3 w-3" /> Talk to us
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-balance">
            A conversation, not a <span className="gold-text">form</span>.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Choose an option below — we'll take it from there on WhatsApp or a quick call.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12 glass rounded-[2rem] shadow-luxe p-6 md:p-8"
        >
          <div className="flex flex-col gap-3">
            {/* Initial bot */}
            <Bubble side="left" delay={0}>
              {FLOW.start.bot}
            </Bubble>

            {replies.map((r, i) => (
              <div key={i}>
                <Bubble side="right" delay={0.05}>
                  {r}
                </Bubble>
                {i < replies.length && FLOW[Object.keys(FLOW)[i + 1]] && (
                  <Bubble side="left" delay={0.15}>
                    {FLOW[Object.keys(FLOW)[i + 1]].bot}
                  </Bubble>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step.chips.length > 0 ? (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="mt-6 flex flex-wrap gap-2 justify-end"
              >
                {step.chips.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => choose(c)}
                    className="rounded-full bg-white ring-1 ring-border px-4 py-2 text-sm font-medium hover:ring-luxury hover:bg-luxury/10 transition"
                  >
                    {c.label}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="final"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 grid gap-3 sm:grid-cols-2"
              >
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                    `Namaste Sir, I am interested — ${replies.join(", ")}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl gradient-luxe text-white px-6 py-4 text-sm font-medium shadow-luxe hover:scale-[1.02] transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  Continue on WhatsApp
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                </a>
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white ring-1 ring-border px-6 py-4 text-sm font-medium hover:shadow-soft transition"
                >
                  <Phone className="h-4 w-4 text-luxury" />
                  Call Shiv Sir
                </a>
                <button
                  onClick={reset}
                  className="sm:col-span-2 text-xs text-muted-foreground hover:text-foreground transition mt-1"
                >
                  ↻ Start over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Bubble({
  children,
  side,
  delay,
}: {
  children: React.ReactNode;
  side: "left" | "right";
  delay: number;
}) {
  const isRight = side === "right";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: isRight ? 12 : -12 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isRight ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
          isRight
            ? "gradient-luxe text-white rounded-br-sm"
            : "bg-white ring-1 ring-border text-foreground rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}
