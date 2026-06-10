import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { SITE } from "@/lib/site";
import { ClipboardList, IdCard, CalendarCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [
      { title: "Admission — Shiv Sir's Education Hub" },
      { name: "description", content: "Three simple steps to admission. Book a free demo class with Shiv Sir today." },
      { property: "og:title", content: "Admission — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Book a free demo class." },
    ],
    links: [{ rel: "canonical", href: "/admission" }],
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
    </>
  );
}
