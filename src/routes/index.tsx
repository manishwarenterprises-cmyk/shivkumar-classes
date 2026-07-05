import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, ArrowRight, MessageCircle, BookOpen, Trophy, Users, Sparkles, GraduationCap, CheckCircle2, MapPin, Phone } from "lucide-react";
import { Section, Reveal, SectionHeader, Eyebrow } from "@/components/primitives";
import { Counter, FloatingParticles } from "@/components/Counter";
import { SITE, COURSES, TESTIMONIALS } from "@/lib/site";
import { ParallaxCard } from "@/components/ParallaxCard";
import { Magnetic } from "@/components/MagneticButton";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { CommerceStaircase } from "@/components/CommerceStaircase";
import { RocketLaunch } from "@/components/RocketLaunch";
import { CertificateCard } from "@/components/CertificateCard";
import { AnnouncementsStrip } from "@/components/AnnouncementsStrip";
import { AmbientOrbs } from "@/components/AmbientOrbs";
import { ConversationCTA } from "@/components/ConversationCTA";
import shivSir from "@/assets/shiv-sir-new.png.asset.json";


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
      <AnnouncementsStrip audience="home" />
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero -mt-24 pt-32 pb-24 md:pt-44 md:pb-32">

        <HeroBackdrop />
        <FloatingParticles />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <Eyebrow>Est. 2012 · Nagpur, Maharashtra</Eyebrow>
          </Reveal>
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.98] text-balance max-w-5xl tracking-[-0.04em]"
          >
            Building <span className="gold-text italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60' }}>Future Commerce</span>
            <br className="hidden md:block" />
            Leaders <span className="text-muted-foreground/70 italic font-light">since</span> 2012
          </motion.h1>
          <Reveal delay={0.4}>
            <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              Trusted commerce coaching for 11th, 12th, B.Com and BBA students in Nagpur — taught with the calm, depth and rigour your future deserves.
            </p>
          </Reveal>
          <Reveal delay={0.55}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic>
                <Link to="/admission" className="group inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-6 py-3.5 text-sm font-medium shadow-luxe hover:scale-[1.02] transition neon-gold">
                  Book Free Demo
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a href={`https://wa.me/${SITE.whatsapp}`} className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-6 py-3.5 text-sm font-medium hover:shadow-soft transition">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </Magnetic>
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

      {/* FOUNDER STRIP */}
      <Section className="overflow-hidden">
        <AmbientOrbs
          orbs={[
            { size: 360, top: "-8%", right: "-6%", color: "rgba(155,120,230,0.28)", parallax: -70 },
            { size: 260, top: "55%", left: "-4%", color: "rgba(198,169,105,0.22)", parallax: 50, delay: -3 },
          ]}
        />
        <div className="grid lg:grid-cols-5 gap-10 items-center relative">
          <Reveal className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2.5rem] gradient-lavender opacity-30 blur-2xl" />
              <div className="relative aspect-[4/5] rounded-[2rem] ring-1 ring-border shadow-luxe overflow-hidden">
                <img src={shivSir.url} alt="Shiv Sir — Founder of Education Hub" className="absolute inset-0 h-full w-full object-cover object-top" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur ring-1 ring-border px-4 py-3 shadow-soft">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-luxury font-bold">Founder & Mentor</div>
                  <div className="font-display text-xl font-extrabold uppercase tracking-wide">Shiv Kumar Dubey</div>
                </div>
              </div>
            </motion.div>
          </Reveal>
          <Reveal className="lg:col-span-3" delay={0.1}>
            <Eyebrow>Meet the founder</Eyebrow>
              <h2 className="mt-5 font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
                13 Years Of <span className="gold-text">Commerce Mastery</span>, Taught With Calm & Care.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                <span className="font-bold uppercase text-foreground tracking-wide">Prof. Shiv Kumar Dubey</span> began this journey in 2012 with one mission — to make commerce education feel meaningful, not mechanical. With an M.Com qualification and over a decade of dedicated classroom teaching, he has personally mentored 850+ students across 11th, 12th, B.Com and BBA.
              </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              His teaching blends rigorous board preparation with real Indian business stories, while his calm, patient approach has earned the trust of parents across Nagpur — reflected in a perfect 5.0 Google rating and 62+ verified reviews.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-5 py-3 text-sm font-medium shadow-luxe">
                Read full story <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/admission" className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-5 py-3 text-sm font-medium hover:shadow-soft">
                Book Free Demo
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* COURSES PREVIEW */}
      <Section className="overflow-hidden">
        <AmbientOrbs />
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

          {/* Climbing staircase: Learn → Practice → Test → Improve → Succeed */}
          <Reveal>
            <div className="mt-16 text-[11px] uppercase tracking-[0.3em] text-luxury">The Five-Step Climb</div>
            <CommerceStaircase />
          </Reveal>
        </div>
      </section>

      {/* RESULTS — Rocket Launch */}
      <Section>
        <SectionHeader
          eyebrow="Student Success"
          title={<>The <span className="gold-text">launch sequence</span> of every commerce career</>}
          subtitle="Scroll — and watch the rocket of growth take off."
        />
        <RocketLaunch />
      </Section>

      {/* TESTIMONIAL PREVIEW */}
      <Section className="overflow-hidden">
        <AmbientOrbs
          orbs={[
            { size: 320, top: "-5%", left: "-4%", color: "rgba(198,169,105,0.22)", parallax: -50 },
            { size: 280, top: "60%", right: "-6%", color: "rgba(155,120,230,0.24)", parallax: 60, delay: -3 },
          ]}
        />
        <SectionHeader
          eyebrow="Trusted by Parents & Students"
          title={<>Real reviews from real <span className="gold-text">Google</span> students</>}
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 perspective-1000">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <CertificateCard>
                <div className="text-[10px] uppercase tracking-[0.3em] text-luxury font-bold">Certificate of Trust</div>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-luxury text-luxury" />
                  ))}
                </div>
                <p className="mt-5 text-sm text-foreground leading-relaxed text-pretty italic">"{t.content}"</p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-luxury/20">
                  <div className="h-9 w-9 rounded-full gradient-luxe grid place-items-center text-white text-xs font-medium">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-wide">{t.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-luxury">Verified Review</div>
                  </div>
                </div>
              </CertificateCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/testimonials" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent">
            Read all reviews <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* VISIT / MAP */}
      <Section>
        <SectionHeader eyebrow="Visit Us" title={<>Drop by the <span className="gold-text">classroom</span></>} subtitle="Centrally located in Duttawadi, Wadi — easy to reach from every commerce school in Nagpur." />
        <div className="mt-12 grid lg:grid-cols-5 gap-6">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-3xl gradient-luxe text-white p-8 shadow-luxe">
              <h3 className="font-display text-2xl">Shiv Sir's Education Hub</h3>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-luxury mt-0.5 shrink-0"/><span className="text-white/80 leading-relaxed">{SITE.address}</span></div>
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 hover:text-luxury transition"><Phone className="h-5 w-5 text-luxury"/>{SITE.phone}</a>
                <a href={`https://wa.me/${SITE.whatsapp}`} className="flex items-center gap-3 hover:text-luxury transition"><MessageCircle className="h-5 w-5 text-luxury"/>Chat on WhatsApp</a>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Balaji+Complex+Blue+Bells+Convent+School+Duttawadi+Wadi+Nagpur+440023"
                target="_blank" rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-luxury text-luxury-foreground px-5 py-3 text-sm font-medium"
              >
                Get directions <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-3" delay={0.1}>
            <div className="rounded-3xl overflow-hidden ring-1 ring-border shadow-luxe aspect-[16/11] lg:aspect-auto lg:h-full bg-white">
              <iframe
                src={SITE.mapsEmbed}
                className="w-full h-full"
                loading="lazy"
                title="Shiv Sir's Education Hub Location"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* CONVERSATIONAL CTA */}
      <ConversationCTA />

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
