import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { FAQBlock, faqSchema, type FAQ } from "@/components/FAQBlock";
import { SITE } from "@/lib/site";
import { CheckCircle2, IndianRupee, Wallet, ShieldCheck } from "lucide-react";

const CANONICAL = "https://shivkumar-classes.lovable.app/fees";

const FEES = [
  { course: "11th Commerce", fee: "₹28,000 / year", includes: ["All 5 subjects", "Weekly tests", "Printed notes", "Doubt sessions"] },
  { course: "12th Commerce", fee: "₹32,000 / year", includes: ["Board-focused revision", "10+ mock boards", "Chapter tests", "1:1 mentoring"] },
  { course: "CBSE Commerce (11th & 12th)", fee: "₹30,000 / year", includes: ["NCERT-aligned drills", "Sample paper practice", "Applied Maths add-on"] },
  { course: "Maharashtra Board (11th & 12th)", fee: "₹26,000 / year", includes: ["HSC board pattern", "Marathi + English medium", "Weightage-based drills"] },
  { course: "B.Com Tuition", fee: "₹18,000 / semester", includes: ["Semester-wise coverage", "Nagpur University pattern", "Journal & viva prep"] },
  { course: "BBA Tuition", fee: "₹20,000 / semester", includes: ["Case-study sessions", "Marketing + Finance focus", "Presentation coaching"] },
];

const FAQS: FAQ[] = [
  { q: "Are the fees payable in instalments?", a: "Yes. All annual programmes can be paid in two equal instalments — 50% at admission and 50% before the second term begins. No processing charges." },
  { q: "Is there a sibling or early-bird discount?", a: "Yes. Siblings get a flat 10% off on tuition, and admissions confirmed before April 30 receive a 5% early-bird discount." },
  { q: "What is the refund policy?", a: "Full refund within 7 days of joining if you attend fewer than 3 classes. After that, refunds are pro-rated for the classes not yet delivered." },
  { q: "Are printed notes and test papers included?", a: "Yes — every course fee includes printed notes, chapter tests, mock boards and doubt sessions. There are no hidden material charges." },
  { q: "Do you offer scholarships?", a: "Toppers of Class 10 (85%+) receive an automatic 15% scholarship on 11th Commerce fees. Financial-need scholarships are reviewed case by case." },
  { q: "Can I pay online?", a: "Yes. We accept UPI, net banking, all major debit/credit cards and cheque. A signed receipt is issued the same day." },
];

export const Route = createFileRoute("/fees")({
  head: () => ({
    meta: [
      { title: "Commerce Coaching Fees in Nagpur — Shiv Sir's Education Hub" },
      { name: "description", content: "Transparent fee structure for 11th, 12th, CBSE, HSC, B.Com and BBA commerce coaching in Nagpur. Instalments, scholarships and refund policy explained." },
      { property: "og:title", content: "Fees Structure — Shiv Sir's Education Hub, Nagpur" },
      { property: "og:description", content: "See our transparent fees for 11th, 12th, CBSE, HSC, B.Com and BBA commerce coaching in Nagpur." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema(FAQS)) }],
  }),
  component: FeesPage,
});

function FeesPage() {
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Fees Structure"
          title={<>Transparent, <span className="gold-text">honest</span> fees</>}
          subtitle="No inflated MRPs, no hidden material charges. What you see is what you pay — with easy instalments and a clear refund policy."
        />
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {FEES.map((f, i) => (
            <Reveal key={f.course} delay={i * 0.05}>
              <article className="rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft h-full">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-2xl leading-tight">{f.course}</h2>
                  <div className="inline-flex items-center gap-1 rounded-full gradient-gold px-3 py-1.5 text-luxury-foreground text-sm font-medium">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {f.fee.replace("₹", "")}
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {f.includes.map((line) => (
                    <li key={line} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-luxury shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: Wallet, t: "Easy Instalments", d: "Pay in 2 equal parts across the academic year — no processing fees." },
            { icon: ShieldCheck, t: "7-Day Refund", d: "Full refund within 7 days of joining if fewer than 3 classes attended." },
            { icon: IndianRupee, t: "Scholarships", d: "Class 10 toppers (85%+) get 15% off. Sibling discount of 10%." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl bg-white ring-1 ring-border p-6">
              <b.icon className="h-5 w-5 text-luxury" />
              <h3 className="mt-4 font-display text-lg">{b.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <FAQBlock
        eyebrow="Fees FAQ"
        title={<>Everything about <span className="gold-text">payment & refunds</span></>}
        subtitle="Straight answers to the questions parents ask us most often."
        faqs={FAQS}
      />

      <Section className="!pt-0">
        <div className="rounded-3xl gradient-luxe p-8 md:p-10 text-white text-center shadow-luxe">
          <h2 className="font-display text-2xl md:text-3xl">Need a fees quote for your batch?</h2>
          <p className="mt-3 text-sm md:text-base opacity-90">
            Call {SITE.phone} or WhatsApp us — we'll share the exact fees, instalment plan and available scholarships for your course.
          </p>
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=Hi%20Shiv%20Sir%2C%20please%20share%20the%20fees%20structure.`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-foreground px-6 py-3 text-sm font-medium hover:shadow-luxe transition"
          >
            WhatsApp for fees
          </a>
        </div>
      </Section>
    </>
  );
}
