import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { TESTIMONIALS, SITE } from "@/lib/site";
import { Star, ThumbsUp } from "lucide-react";
import { useState, useMemo } from "react";
import { Counter } from "@/components/Counter";

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

function Testimonials() {
  const [filter, setFilter] = useState<"latest" | "top" | "helpful">("latest");
  const sorted = useMemo(() => {
    const arr = [...TESTIMONIALS];
    if (filter === "latest") arr.sort((a,b)=>+new Date(b.date)-+new Date(a.date));
    if (filter === "top") arr.sort((a,b)=>b.rating-a.rating || b.helpful-a.helpful);
    if (filter === "helpful") arr.sort((a,b)=>b.helpful-a.helpful);
    return arr;
  }, [filter]);

  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="100% Verified Google Reviews"
          title={<>Real words from <span className="gold-text">real students</span></>}
          subtitle="Every review below is sourced from our verified Google Business profile — nothing fabricated."
        />
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { l:"Rating", v:SITE.rating, d:1 },
            { l:"Reviews", v:SITE.reviews, s:"+" },
            { l:"5-Star %", v:100, s:"%" },
          ].map(s=>(
            <div key={s.l} className="text-center rounded-2xl bg-white ring-1 ring-border p-5 shadow-soft">
              <div className="font-display text-3xl gold-text"><Counter to={s.v} suffix={s.s ?? ""} decimals={s.d ?? 0} /></div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center gap-2">
          {[
            { k:"latest", l:"Latest" },
            { k:"top", l:"Top Rated" },
            { k:"helpful", l:"Most Helpful" },
          ].map(t=>(
            <button
              key={t.k}
              onClick={()=>setFilter(t.k as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm transition ${filter===t.k ? "gradient-luxe text-white shadow-soft" : "bg-white ring-1 ring-border text-muted-foreground hover:text-foreground"}`}
            >{t.l}</button>
          ))}
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((t,i)=>(
            <Reveal key={t.name} delay={i*0.04}>
              <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({length:t.rating}).map((_,k)=><Star key={k} className="h-4 w-4 fill-luxury text-luxury"/>)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</div>
                </div>
                <p className="mt-5 text-sm text-foreground leading-relaxed text-pretty">"{t.content}"</p>
                <div className="mt-6 flex items-center justify-between pt-5 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full gradient-luxe grid place-items-center text-white text-xs font-medium">
                      {t.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">Google Review</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" /> {t.helpful}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
