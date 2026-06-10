import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { Counter } from "@/components/Counter";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Award } from "lucide-react";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — Shiv Sir's Education Hub" },
      { name: "description", content: "13 years of consistent 90+ board scores, university toppers and student success stories." },
      { property: "og:title", content: "Results — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Our student results, year after year." },
    ],
    links: [{ rel: "canonical", href: "/results" }],
  }),
  component: Results,
});

const TOPPERS = [
  { name: "Aarav S.", score: "97.2%", course: "12th CBSE Commerce", year: "2024" },
  { name: "Sanya D.", score: "96.4%", course: "12th HSC Commerce", year: "2024" },
  { name: "Rohan K.", score: "95.0%", course: "12th CBSE Commerce", year: "2023" },
  { name: "Ishita V.", score: "94.6%", course: "11th Commerce", year: "2024" },
  { name: "Karan J.", score: "9.4 CGPA", course: "B.Com Final Year", year: "2024" },
  { name: "Meera P.", score: "9.2 CGPA", course: "BBA Final Year", year: "2024" },
];

const YEARS = [
  { y: "2020", v: 88 },
  { y: "2021", v: 90 },
  { y: "2022", v: 92 },
  { y: "2023", v: 93 },
  { y: "2024", v: 94 },
  { y: "2025", v: 95 },
];

function Results() {
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Student Success"
          title={<>Numbers that tell a <span className="gold-text">quiet story</span></>}
          subtitle="No drama, no exaggeration — just consistent, hard-earned outcomes over 13 years."
        />
        <div className="mt-14 grid md:grid-cols-4 gap-6">
          {[
            { v: 850, s: "+", l: "Students Taught", i: Trophy },
            { v: 94, s: "%", l: "Avg Board Score", i: TrendingUp },
            { v: 120, s: "+", l: "90% Scorers", i: Award },
            { v: 13, s: "+", l: "Years Excellence", i: Trophy },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i*0.06}>
              <div className="rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft">
                <s.i className="h-5 w-5 text-luxury" />
                <div className="mt-3 font-display text-5xl gold-text">
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Animated graph */}
      <Section>
        <SectionHeader eyebrow="Avg Board Score Trend" title={<>Six years of <span className="gold-text">upward growth</span></>} />
        <Reveal>
          <div className="mt-14 rounded-3xl bg-white ring-1 ring-border p-8 shadow-soft">
            <div className="flex items-end justify-between gap-3 h-64">
              {YEARS.map((y, i) => (
                <div key={y.y} className="flex-1 flex flex-col items-center justify-end gap-3">
                  <div className="text-xs font-medium gold-text">{y.v}%</div>
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${y.v * 2}px` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-t-xl gradient-luxe"
                    style={{ maxHeight: 240 }}
                  />
                  <div className="text-xs text-muted-foreground">{y.y}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Toppers */}
      <Section>
        <SectionHeader eyebrow="Recent Toppers" title={<>Our students, our pride</>} />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPPERS.map((t, i) => (
            <Reveal key={t.name} delay={i*0.06}>
              <div className="rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft hover:shadow-luxe transition">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl gradient-luxe grid place-items-center text-white font-display text-lg">
                    {t.name.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.course} · {t.year}</div>
                  </div>
                </div>
                <div className="mt-6 pt-5 border-t border-border flex items-end justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Score</span>
                  <span className="font-display text-3xl gold-text">{t.score}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
