import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { BLOG_POSTS } from "@/lib/site";
import { useState, useMemo } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Accountancy", "Economics", "Career Guidance", "Exam Preparation", "Commerce Tips"];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Shiv Sir's Education Hub" },
      { name: "description", content: "Commerce tips, exam strategy, career guidance and study material from Shiv Sir's Education Hub." },
      { property: "og:title", content: "Commerce Blog — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Insightful articles for commerce students." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogLayout,
});

function BlogLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/blog") return <Outlet />;
  return <BlogIndex />;
}

function BlogIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = useMemo(() =>
    BLOG_POSTS.filter(p =>
      (cat === "All" || p.category === cat) &&
      (p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
    ), [q, cat]);

  const featured = BLOG_POSTS[0];

  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Commerce Journal"
          title={<>Thoughtful reads on <span className="gold-text">commerce</span></>}
          subtitle="Notes, guides and honest career advice — written by Shiv Sir and the team."
        />

        {/* Featured */}
        <Reveal>
          <Link to="/blog/$slug" params={{ slug: featured.slug }} className="mt-14 block">
            <div className="relative rounded-[2rem] overflow-hidden gradient-luxe text-white p-10 md:p-16 hover:shadow-luxe transition">
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at top right, rgba(198,169,105,0.5), transparent 50%)" }} />
              <div className="relative max-w-2xl">
                <span className="text-[11px] uppercase tracking-[0.2em] text-luxury">Featured · {featured.category}</span>
                <h3 className="mt-4 font-display text-3xl md:text-5xl text-balance text-white">{featured.title}</h3>
                <p className="mt-4 text-white/70">{featured.excerpt}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-luxury">
                  Read article <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Filters */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q} onChange={(e)=>setQ(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-2xl bg-white ring-1 ring-border pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCat(c)} className={`px-3.5 py-1.5 text-xs rounded-full transition ${cat===c ? "gradient-luxe text-white" : "bg-white ring-1 ring-border text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={i*0.05}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block h-full">
                <div className="h-full rounded-3xl bg-white ring-1 ring-border p-6 shadow-soft hover:shadow-luxe hover:-translate-y-1 transition-all">
                  <div className="aspect-video rounded-2xl gradient-luxe relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 30% 30%, rgba(198,169,105,0.5), transparent 60%)` }}/>
                    <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur px-2 py-1 rounded-full ring-1 ring-white/20">{p.category}</div>
                  </div>
                  <h3 className="mt-5 font-display text-xl text-foreground group-hover:text-accent transition">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(p.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3"/>{p.read} min</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
