import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { FAQBlock, faqSchema, type FAQ } from "@/components/FAQBlock";
import { SITE } from "@/lib/site";
import { ClipboardList, IdCard, CalendarCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const CANONICAL = "https://shivkumar-classes.lovable.app/admission";

const ADMISSION_FAQS: FAQ[] = [
  { q: "When do admissions open for the new academic session?", a: "Admissions open every year on March 1 and continue on a rolling basis until seats are filled. Early admissions before April 30 get a 5% discount and first pick of batch timings." },
  { q: "Is the demo class really free?", a: "Yes. The demo is a complete 45-minute class with Shiv Sir — no sales pitch, no obligation. You experience the actual teaching style before deciding." },
  { q: "What documents are needed at admission?", a: "Aadhaar card, last school report card, 2 passport photographs and parent contact details. Marksheets for prior boards if you're joining 12th or B.Com." },
  { q: "Can I switch batches after joining?", a: "Yes. You can switch between morning, evening or weekend batches once per term based on availability, at no extra cost." },
  { q: "Do you accept mid-session admissions?", a: "Yes, for 11th Commerce and B.Com/BBA until 30 days into the term. You'll get personalised catch-up sessions to cover missed chapters at no extra fee." },
  { q: "How is the batch size decided?", a: "Every batch is capped at 20 students so Shiv Sir can personally track each student's weekly progress and doubt patterns." },
];

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [
      { title: "Commerce Coaching Admission Nagpur 2026 — Shiv Sir's Education Hub" },
      { name: "description", content: "Admissions open for 11th, 12th, CBSE, HSC, B.Com and BBA commerce coaching in Nagpur. Book a free demo class with Shiv Sir in 3 simple steps." },
      { property: "og:title", content: "Admissions Open 2026 — Shiv Sir's Education Hub, Nagpur" },
      { property: "og:description", content: "Three simple steps, one free demo, personal mentorship from day one." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema(ADMISSION_FAQS)) }],
  }),
  component: Admission,
});

const STEPS = [
  { icon: CalendarCheck, t: "Book a Free Demo", d: "Pick a time. Attend a full 45-minute class — no sales pitch, just teaching." },
  { icon: ClipboardList, t: "Meet Shiv Sir", d: "A 15-minute orientation to understand your school, board and goals." },
  { icon: IdCard, t: "Complete Registration", d: "Submit ID proof, school marksheet and the registration form. Pay fees and join your batch." },
];

const DOCS = ["Aadhaar card (student)","Last school report card","2 passport photographs","Parent contact details"];

function Admission() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Admissions Open"
          title={<>Your seat at <span className="gold-text">Shiv Sir's</span></>}
          subtitle="A calm, transparent admission process designed around the student — not the paperwork."
        />
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i*0.08}>
              <div className="relative h-full rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft">
                <div className="absolute -top-3 -left-3 h-9 w-9 rounded-2xl gradient-gold grid place-items-center text-luxury-foreground font-display text-sm shadow-luxe">{i+1}</div>
                <s.icon className="h-6 w-6 text-luxury"/>
                <h3 className="mt-5 font-display text-xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="rounded-3xl bg-white ring-1 ring-border p-8 shadow-soft h-full">
              <h3 className="font-display text-2xl">Documents Required</h3>
              <ul className="mt-6 space-y-3">
                {DOCS.map(d=>(
                  <li key={d} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-luxury"/>{d}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Pro tip</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Bring a copy of your last test paper — Shiv Sir reviews it personally during orientation to identify focus chapters.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={(e)=>{e.preventDefault(); setSent(true); setTimeout(()=>setSent(false), 4000);}}
              className="rounded-3xl gradient-luxe text-white p-8 shadow-luxe h-full"
            >
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-luxury">
                <Sparkles className="h-3 w-3"/> Free Demo Booking
              </div>
              <h3 className="mt-3 font-display text-2xl">Book your free demo</h3>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { l:"Student name", t:"text" },
                  { l:"Phone", t:"tel" },
                  { l:"Class / Course", t:"text" },
                  { l:"Preferred date", t:"date" },
                ].map(f=>(
                  <label key={f.l} className="block">
                    <span className="text-[11px] uppercase tracking-wider text-white/60">{f.l}</span>
                    <input required type={f.t}
                      className="mt-1.5 w-full rounded-xl bg-white/10 ring-1 ring-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-luxury"/>
                  </label>
                ))}
              </div>
              <button className="mt-6 w-full rounded-2xl bg-luxury text-luxury-foreground px-6 py-3 text-sm font-medium">
                Confirm Free Demo
              </button>
              {sent && <div className="mt-4 text-sm text-luxury">Booked! We'll WhatsApp you confirmation shortly.</div>}
              <div className="mt-6 text-xs text-white/50 text-center">Or WhatsApp directly: <a className="text-luxury underline" href={`https://wa.me/${SITE.whatsapp}`}>{SITE.phone}</a></div>
            </form>
          </Reveal>
        </div>
      </Section>

      <FAQBlock
        eyebrow="Admission FAQ"
        title={<>Common <span className="gold-text">admission questions</span></>}
        subtitle="What parents and students ask us most before joining."
        faqs={ADMISSION_FAQS}
      />
    </>
  );
}
