import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeader, Reveal } from "@/components/primitives";

export type FAQ = { q: string; a: string };

export function FAQBlock({ eyebrow = "FAQ", title, subtitle, faqs }: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  faqs: FAQ[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-3xl bg-white ring-1 ring-border shadow-soft">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 group"
                aria-expanded={isOpen}
              >
                <h3 className="font-display text-lg leading-snug">{f.q}</h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 mt-1 text-luxury transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 -mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

export function faqSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
