import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, ArrowRight, MessageCircle, BookOpen, Trophy, Users, Sparkles, GraduationCap, CheckCircle2 } from "lucide-react";
import { Section, Reveal, SectionHeader, Eyebrow } from "@/components/primitives";
import { Counter, FloatingParticles } from "@/components/Counter";
import { SITE, COURSES, TESTIMONIALS } from "@/lib/site";
import { ParallaxCard } from "@/components/ParallaxCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shiv Sir's Education Hub — Premier Commerce Coaching in Nagpur" },
      { name: "description", content: "Trusted commerce coaching for 11th, 12th, B.Com and BBA in Nagpur. 5.0 Google rating, 13+ years building commerce leaders." },
      { property: "og:title", content: "Shiv Sir's Education Hub — Commerce Coaching in Nagpur" },
      { property: "og:description", content: "Book a free demo class today." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero -mt-24 pt-32 pb-24 md:pt-44 md:pb-32">
        <FloatingParticles />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <Eyebrow>Est. 2012 · Nagpur, Maharashtra</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] text-balance max-w-5xl">
              Building <span className="gold-text">Future Commerce</span> Leaders Since 2012
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              Trusted commerce coaching for 11th, 12th, B.Com and BBA students in Nagpur — taught with the calm, depth and rigour your future deserves.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/admission" className="group inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-6 py-3.5 text-sm font-medium shadow-luxe hover:scale-[1.02] transition">
                Book Free Demo
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <a href={`https://wa.me/${SITE.whatsapp}`} className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-6 py-3.5 text-sm font-medium hover:shadow-soft transition">
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
          </Reveal>

          {/* Trust indicators */}
          <Reveal delay={0.34}>
            <div className="mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl">
              {[
                { label: "Google Rating", value: SITE.rating.toFixed(1), suffix: "", icon: Star, decimals: 1 },
                { label: "Google Reviews", value: SITE.reviews, suffix: "+", icon: Users, decimals: 0 },
                { label: "Years Excellence", value: SITE.years, suffix: "+", icon: Trophy, decimals: 0 },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4 md:p-5 shadow-soft">
                  <s.icon className="h-4 w-4 text-luxury" />
                  <div className="mt-2 font-display text-2xl md:text-4xl text-foreground">
                    <Counter to={Number(s.value)} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <motion.div
          className="absolute -right-32 top-20 h-96 w-96 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(198,169,105,0.4), transparent 60%)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </section>

      {/* COURSES PREVIEW */}
      <Section>
        <SectionHeader
          eyebrow="What We Teach"
          title={<>A commerce curriculum, <span className="gold-text">crafted with care</span></>}
          subtitle="From your first ledger entry to your B.Com viva — every step planned, every doubt answered."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 perspective-1000">
          {COURSES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <ParallaxCard className="h-full rounded-3xl">
                <Link to="/courses/$slug" params={{ slug: c.slug }} className="group block h-full">
                  <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 hover:shadow-luxe transition-all hover:-translate-y-1 hover:ring-luxury/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-luxury">{c.tag}</span>
                      <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl text-foreground">{c.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
                    <div className="mt-6 flex items-center text-sm text-foreground font-medium">
                      Explore course <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </Link>
              </ParallaxCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PHILOSOPHY / Why Us */}
      <section className="gradient-luxe text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(198,169,105,0.4), transparent 50%)" }} />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
              <Sparkles className="h-3 w-3 text-luxury" /> The Shiv Sir Difference
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-4xl md:text-6xl text-balance max-w-4xl text-white">
              Teaching that respects your time and your <span className="gold-text">future</span>.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { title: "Personal Attention", desc: "Small batches. Every student is known by name, weakness and learning style.", icon: Users },
              { title: "Rigorous Test Series", desc: "Weekly tests, monthly mock boards, and detailed answer-script analysis.", icon: BookOpen },
              { title: "Proven Results", desc: "13 years of consistent 90+ scores and university toppers across courses.", icon: Trophy },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="rounded-3xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-7 hover:bg-white/10 transition">
                  <div className="h-11 w-11 rounded-2xl bg-luxury/20 grid place-items-center ring-1 ring-luxury/30">
                    <f.icon className="h-5 w-5 text-luxury" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-white">{f.title}</h3>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS PREVIEW */}
      <Section>
        <SectionHeader eyebrow="Student Success" title={<>Numbers that tell a quiet story</>} />
        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {[
            { v: 850, s: "+", l: "Students Taught" },
            { v: 94, s: "%", l: "Avg Board Score" },
            { v: 120, s: "+", l: "90%+ Scorers" },
            { v: 5.0, s: "", l: "Google Rating", d: 1 },
          ].map((s) => (
            <Reveal key={s.l}>
              <div className="rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft text-center">
                <div className="font-display text-4xl md:text-5xl gold-text">
                  <Counter to={s.v} suffix={s.s} decimals={s.d ?? 0} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* TESTIMONIAL PREVIEW */}
      <Section>
        <SectionHeader
          eyebrow="Trusted by Parents & Students"
          title={<>Real reviews from real <span className="gold-text">Google</span> students</>}
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-luxury text-luxury" />
                  ))}
                </div>
                <p className="mt-5 text-sm text-foreground leading-relaxed text-pretty">"{t.content}"</p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border">
                  <div className="h-9 w-9 rounded-full gradient-luxe grid place-items-center text-white text-xs font-medium">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">Google Review</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/testimonials" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent">
            Read all reviews <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] gradient-luxe text-white p-10 md:p-16">
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at top right, rgba(198,169,105,0.5), transparent 50%)" }} />
            <div className="relative max-w-3xl">
              <Eyebrow><span className="text-luxury">Start Today</span></Eyebrow>
              <h2 className="mt-5 font-display text-4xl md:text-6xl text-balance text-white">
                Your commerce success story <span className="gold-text">starts here</span>.
              </h2>
              <p className="mt-5 text-white/70 text-lg max-w-xl">
                Join hundreds of students who trusted Shiv Sir's Education Hub with their commerce journey.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/admission" className="inline-flex items-center gap-2 rounded-2xl bg-luxury text-luxury-foreground px-6 py-3.5 text-sm font-medium hover:opacity-90 transition">
                  Book Demo Class <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={`https://wa.me/${SITE.whatsapp}`} className="inline-flex items-center gap-2 rounded-2xl bg-white/10 ring-1 ring-white/20 px-6 py-3.5 text-sm font-medium hover:bg-white/15">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
                {["No registration fee","Free demo class","Personal attention","Money-back guarantee"].map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-luxury" /> {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
