import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { Briefcase, Upload, GraduationCap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Shiv Sir's Education Hub" },
      { name: "description", content: "Join Nagpur's most respected commerce coaching institute. Teaching roles for commerce educators." },
      { property: "og:title", content: "Careers at Shiv Sir's Education Hub" },
      { property: "og:description", content: "Hiring commerce teachers in Nagpur." },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: Careers,
});

const ROLES = [
  { t: "Accountancy Faculty", l: "11th – 12th", k: "Full-time" },
  { t: "Economics Faculty", l: "11th – 12th", k: "Full-time" },
  { t: "B.Com Visiting Faculty", l: "Graduation", k: "Part-time" },
];

function Careers() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="We're Hiring"
          title={<>Teach with us. <span className="gold-text">Shape commerce education</span> in Nagpur.</>}
          subtitle="If you love teaching, respect students, and obsess over conceptual clarity — we'd love to meet you."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {ROLES.map((r,i)=>(
            <Reveal key={r.t} delay={i*0.06}>
              <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft hover:shadow-luxe transition">
                <Briefcase className="h-5 w-5 text-luxury"/>
                <h3 className="mt-5 font-display text-xl">{r.t}</h3>
                <div className="mt-2 text-xs text-muted-foreground">{r.l} · {r.k}</div>
                <div className="mt-5 inline-flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-muted px-2.5 py-1">Nagpur</span>
                  <span className="rounded-full bg-muted px-2.5 py-1">Experienced</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <Reveal>
          <form
            onSubmit={(e)=>{e.preventDefault();setSent(true);setTimeout(()=>setSent(false),4000);}}
            className="rounded-3xl gradient-luxe text-white p-8 md:p-12 max-w-3xl mx-auto shadow-luxe"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-luxury"/>
              <span className="text-[11px] uppercase tracking-[0.2em] text-luxury">Apply Now</span>
            </div>
            <h3 className="mt-3 font-display text-3xl">Submit your application</h3>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {["Full name","Phone","Email","Subject specialisation","Years of experience","Current institute"].map(f=>(
                <label key={f} className="block">
                  <span className="text-[11px] uppercase tracking-wider text-white/60">{f}</span>
                  <input required className="mt-1.5 w-full rounded-xl bg-white/10 ring-1 ring-white/20 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-luxury"/>
                </label>
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 cursor-pointer hover:bg-white/10">
              <Upload className="h-4 w-4 text-luxury"/>
              <span className="text-sm">Upload your resume (PDF)</span>
              <input type="file" accept="application/pdf" className="hidden"/>
            </label>
            <textarea rows={4} placeholder="A short note about your teaching philosophy…" className="mt-4 w-full rounded-xl bg-white/10 ring-1 ring-white/20 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-luxury"/>
            <button className="mt-6 rounded-2xl bg-luxury text-luxury-foreground px-6 py-3 text-sm font-medium">Submit Application</button>
            {sent && <div className="mt-4 text-sm text-luxury">Thank you — we'll get back to shortlisted candidates within 7 days.</div>}
          </form>
        </Reveal>
      </Section>
    </>
  );
}
