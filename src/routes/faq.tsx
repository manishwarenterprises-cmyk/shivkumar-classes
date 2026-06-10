import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { FAQS } from "@/lib/site";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Shiv Sir's Education Hub" },
      { name: "description", content: "Answers to common questions about admissions, fees, timings, courses and location." },
      { property: "og:title", content: "FAQ — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Everything you need to know before joining." },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map(f=>({
          "@type":"Question", name: f.q,
          acceptedAnswer: { "@type":"Answer", text: f.a }
        }))
      }),
    }],
  }),
  component: Faq,
});

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section className="pt-12">
      <SectionHeader
        eyebrow="Frequently Asked"
        title={<>Everything you need to <span className="gold-text">know</span></>}
        subtitle="Still have questions? Message us on WhatsApp — we reply within minutes."
      />
      <div className="mt-14 max-w-3xl mx-auto space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i*0.03}>
            <div className="rounded-2xl bg-white ring-1 ring-border overflow-hidden shadow-soft">
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between gap-4 text-left p-6">
                <span className="font-medium">{f.q}</span>
                <motion.span animate={{ rotate: open===i ? 45 : 0 }} className="text-luxury shrink-0">
                  <Plus className="h-5 w-5"/>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open===i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
