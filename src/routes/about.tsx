import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { Counter } from "@/components/Counter";
import { motion } from "framer-motion";
import { Heart, Target, Eye, BookOpen } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Shiv Sir's Education Hub" },
      { name: "description", content: "Our story, mission, vision and the teaching philosophy that has built commerce leaders in Nagpur since 2012." },
      { property: "og:title", content: "About — Shiv Sir's Education Hub" },
      { property: "og:description", content: "13 years of disciplined commerce education in Nagpur." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const TIMELINE = [
  { year: "2012", title: "The Beginning", desc: "Shiv Sir opens the first batch with 12 students in a quiet Nagpur classroom." },
  { year: "2015", title: "First Toppers", desc: "First batch of 12th Commerce students cross 90% — the foundation of our reputation." },
  { year: "2018", title: "B.Com & BBA Launch", desc: "Curriculum expands to graduation-level commerce coaching." },
  { year: "2021", title: "1000+ Students", desc: "Cumulative student count crosses a thousand across all programmes." },
  { year: "2023", title: "5.0 Google Rating", desc: "Achieved a perfect rating from 60+ verified Google reviews." },
  { year: "2025", title: "Digital Hub", desc: "Launched online resources, AI assistant and a modern learning experience." },
];

function About() {
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Our Story"
          title={<>A quiet classroom, an <span className="gold-text">extraordinary mission</span></>}
          subtitle="What started as one teacher with a chalkboard in 2012 has become Nagpur's most trusted commerce coaching home."
        />
      </Section>

      <Section className="!pt-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-3xl gradient-luxe overflow-hidden shadow-luxe">
              <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 30% 30%, rgba(198,169,105,0.6), transparent 60%)" }} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center text-white">
                  <div className="font-display text-8xl gold-text">Shiv</div>
                  <div className="text-sm uppercase tracking-[0.3em] text-white/70 mt-2">Founder & Mentor</div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 glass-dark rounded-2xl p-4">
                <p className="text-white text-sm italic">"Commerce isn't about memorising — it's about understanding how the world really works."</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h3 className="font-display text-3xl md:text-4xl text-foreground">The Founder</h3>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Shiv Sir has spent over a decade refining how commerce should be taught — patiently, with depth, and with genuine care for every student who walks in. He left the corporate sector in 2012 to do what he loved most: teach.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                His classes blend rigorous board-pattern preparation with real Indian business stories, making accountancy, economics and business studies feel alive rather than abstract.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[{v:13,s:"+",l:"Years"},{v:850,s:"+",l:"Students"},{v:120,s:"+",l:"90% Scorers"}].map((s)=>(
                  <div key={s.l}>
                    <div className="font-display text-3xl gold-text"><Counter to={s.v} suffix={s.s}/></div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Mission / Vision */}
      <Section>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Mission", desc: "To make commerce education feel less like memorisation and more like understanding the real economy." },
            { icon: Eye, title: "Vision", desc: "To be Central India's most respected commerce coaching institute — known for depth, ethics and outcomes." },
            { icon: Heart, title: "Student-First", desc: "Every decision we make begins with one question — does this genuinely help the student grow?" },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i*0.08}>
              <div className="h-full rounded-3xl bg-white ring-1 ring-border p-8 shadow-soft">
                <div className="h-11 w-11 rounded-2xl gradient-luxe grid place-items-center text-white">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-2xl">{b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Methodology */}
      <Section>
        <SectionHeader eyebrow="Teaching Methodology" title={<>How we actually teach commerce</>} />
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {[
            { t: "Concept-First", d: "We start every chapter from intuition — not formulas. Students understand before they practice." },
            { t: "Indian Business Examples", d: "Every concept is rooted in companies and cases students recognise from daily life." },
            { t: "Weekly Test Series", d: "Consistent assessment with detailed answer-script reviews and individual feedback." },
            { t: "Doubt Sessions", d: "Dedicated weekly slots plus 1-on-1 sessions for chapters that need extra attention." },
            { t: "Parent Communication", d: "Regular updates so parents know exactly where their child stands and what's next." },
            { t: "Calm Environment", d: "No shouting, no fear. Just disciplined, focused learning in a respectful space." },
          ].map((m,i)=>(
            <Reveal key={m.t} delay={i*0.04}>
              <div className="rounded-2xl bg-white ring-1 ring-border p-6 hover:shadow-soft transition">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-5 w-5 text-luxury shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-lg">{m.t}</h4>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{m.d}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeader eyebrow="Our Journey" title={<>From 2012 <span className="gold-text">to today</span></>} />
        <div className="mt-16 relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i*0.06}>
              <div className={`relative mb-10 md:grid md:grid-cols-2 md:gap-12 ${i%2===0?"":"md:[&>*:first-child]:order-2"}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`ml-12 md:ml-0 ${i%2===0?"md:text-right md:pr-8":"md:text-left md:pl-8"}`}
                >
                  <div className="font-display text-3xl gold-text">{t.year}</div>
                  <div className="font-medium text-foreground mt-1">{t.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </motion.div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1.5 h-3 w-3 rounded-full gradient-gold ring-4 ring-background" />
                <div className="hidden md:block" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
