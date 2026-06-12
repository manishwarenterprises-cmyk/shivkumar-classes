import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { TESTIMONIALS, SITE } from "@/lib/site";
import { Star, ThumbsUp, Send, CheckCircle2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Counter } from "@/components/Counter";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Shiv Sir's Education Hub" },
      { name: "description", content: "Verified Google reviews from students and parents of Shiv Sir's Education Hub, Nagpur." },
      { property: "og:title", content: "Testimonials — Shiv Sir's Education Hub" },
      { property: "og:description", content: "5.0 Google rating from 62+ verified reviews." },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});

type Review = {
  name: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  source?: "user" | "google";
};

const STORAGE_KEY = "seh_reviews_v1";

function loadUserReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function Testimonials() {
  const [filter, setFilter] = useState<"latest" | "top" | "helpful">("latest");
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    setUserReviews(loadUserReviews());
  }, []);

  const all = useMemo(() => {
    const base: Review[] = TESTIMONIALS.map((t) => ({ ...t, source: "google" as const }));
    return [...userReviews, ...base];
  }, [userReviews]);

  const sorted = useMemo(() => {
    const arr = [...all];
    if (filter === "latest") arr.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (filter === "top") arr.sort((a, b) => b.rating - a.rating || b.helpful - a.helpful);
    if (filter === "helpful") arr.sort((a, b) => b.helpful - a.helpful);
    return arr;
  }, [filter, all]);

  // Form state
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim().slice(0, 60);
    const cleanContent = content.trim().slice(0, 600);
    if (cleanName.length < 2) return setErr("Please enter your name (min 2 chars).");
    if (cleanContent.length < 10) return setErr("Please write a review (min 10 chars).");
    if (rating < 1 || rating > 5) return setErr("Please pick a rating.");
    setErr(null);

    const next: Review = {
      name: cleanName,
      rating,
      date: new Date().toISOString(),
      content: cleanContent,
      helpful: 0,
      source: "user",
    };
    const updated = [next, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setName("");
    setContent("");
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="100% Verified Google Reviews"
          title={<>Real words from <span className="gold-text">real students</span></>}
          subtitle="Every review below is sourced from our verified Google Business profile — plus the latest reviews from our community."
        />
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { l: "Rating", v: SITE.rating, d: 1 },
            { l: "Reviews", v: SITE.reviews + userReviews.length, s: "+" },
            { l: "5-Star %", v: 100, s: "%" },
          ].map((s) => (
            <div key={s.l} className="text-center rounded-2xl bg-white ring-1 ring-border p-5 shadow-soft">
              <div className="font-display text-3xl gold-text">
                <Counter to={s.v} suffix={s.s ?? ""} decimals={s.d ?? 0} />
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* SUBMIT REVIEW */}
      <Section className="!pt-0">
        <Reveal>
          <form
            onSubmit={submit}
            className="max-w-3xl mx-auto rounded-3xl gradient-luxe text-white p-8 md:p-10 shadow-luxe"
          >
            <div className="text-[11px] uppercase tracking-[0.2em] text-luxury">Share your experience</div>
            <h3 className="mt-2 font-display text-2xl md:text-3xl">Write a review</h3>
            <p className="mt-2 text-sm text-white/70">Your review appears instantly below. Be kind, be specific.</p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[11px] uppercase tracking-wider text-white/60">Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                  className="mt-1.5 w-full rounded-xl bg-white/10 ring-1 ring-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-luxury"
                  placeholder="e.g. Aarav Sharma"
                />
              </label>
              <div className="block">
                <span className="text-[11px] uppercase tracking-wider text-white/60">Your rating</span>
                <div className="mt-1.5 flex items-center gap-1.5 h-[42px]">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(n)}
                      className="transition-transform hover:scale-110"
                      aria-label={`Rate ${n} star`}
                    >
                      <Star
                        className={`h-7 w-7 transition ${
                          (hover || rating) >= n ? "fill-luxury text-luxury" : "text-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-[11px] uppercase tracking-wider text-white/60">Your review</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={600}
                rows={4}
                className="mt-1.5 w-full rounded-xl bg-white/10 ring-1 ring-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-luxury"
                placeholder="Tell others what made your experience at Shiv Sir's special…"
              />
              <div className="mt-1 text-[10px] text-white/40 text-right">{content.length}/600</div>
            </label>

            {err && <div className="mt-3 text-sm text-red-300">{err}</div>}

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-luxury text-luxury-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition"
              >
                <Send className="h-4 w-4" /> Submit Review
              </button>
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-2 text-sm text-luxury"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Posted — thank you!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </Section>

      {/* REVIEW LIST */}
      <Section className="!pt-4">
        <div className="flex justify-center gap-2">
          {[
            { k: "latest", l: "Latest" },
            { k: "top", l: "Top Rated" },
            { k: "helpful", l: "Most Helpful" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === t.k
                  ? "gradient-luxe text-white shadow-soft"
                  : "bg-white ring-1 ring-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {sorted.map((t, i) => (
              <motion.div
                key={`${t.name}-${t.date}`}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
              >
                <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft hover:shadow-luxe hover:-translate-y-0.5 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, k) => (
                        <Star key={k} className="h-4 w-4 fill-luxury text-luxury" />
                      ))}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {new Date(t.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <p className="mt-5 text-sm text-foreground leading-relaxed text-pretty">"{t.content}"</p>
                  <div className="mt-6 flex items-center justify-between pt-5 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full gradient-luxe grid place-items-center text-white text-xs font-medium">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {t.source === "user" ? "Website Review" : "Google Review"}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="h-3 w-3" /> {t.helpful}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
}
