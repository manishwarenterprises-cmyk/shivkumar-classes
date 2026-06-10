import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, Reveal } from "@/components/primitives";
import { BLOG_POSTS } from "@/lib/site";
import { ArrowLeft, Clock, Share2, Bookmark, Twitter, Facebook, Linkedin } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find(p => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.post.title} — Shiv Sir's Blog` },
      { name: "description", content: loaderData?.post.excerpt },
      { property: "og:title", content: loaderData?.post.title },
      { property: "og:description", content: loaderData?.post.excerpt },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/blog/${loaderData?.post.slug}` }],
  }),
  notFoundComponent: () => <div className="py-32 text-center text-muted-foreground">Article not found.</div>,
  component: BlogDetail,
});

function BlogDetail() {
  const { post } = Route.useLoaderData();
  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Section className="pt-12 max-w-3xl">
        <Reveal>
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="mt-8 inline-flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-luxury">{post.category}</span>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3"/>{post.read} min read</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-4xl md:text-6xl text-balance leading-[1.05]">{post.title}</h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-8 flex items-center justify-between pb-8 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full gradient-luxe grid place-items-center text-white text-sm font-medium">SS</div>
              <div>
                <div className="text-sm font-medium">{post.author}</div>
                <div className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {[Twitter, Facebook, Linkedin, Bookmark].map((Ic,i)=>(
                <button key={i} className="h-9 w-9 grid place-items-center rounded-full bg-white ring-1 ring-border hover:bg-muted transition">
                  <Ic className="h-4 w-4 text-muted-foreground"/>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.28}>
          <article className="mt-10 prose prose-neutral max-w-none">
            <p className="text-lg text-foreground/90 leading-relaxed">
              {post.excerpt} In this article, Shiv Sir shares the exact framework he uses with his own students — refined over 13 years of teaching commerce in Nagpur.
            </p>
            <h2 className="font-display text-2xl mt-10 mb-4">Why this matters</h2>
            <p className="text-muted-foreground leading-relaxed">
              Most commerce students focus on what to study but rarely on how. The how is what separates a 75% student from a 95% student — and the difference is almost never intelligence. It's method.
            </p>
            <h2 className="font-display text-2xl mt-10 mb-4">The framework</h2>
            <p className="text-muted-foreground leading-relaxed">
              We break every chapter into three layers: intuition, application and recall. Intuition makes the concept stick, application earns the marks, and recall ensures it lasts till the exam hall.
            </p>
            <h2 className="font-display text-2xl mt-10 mb-4">Practical next steps</h2>
            <ul className="text-muted-foreground space-y-2">
              <li>Pick one weak chapter this week.</li>
              <li>Re-read with a single question: "What is this really trying to say?"</li>
              <li>Practice five problems without notes.</li>
              <li>Teach the chapter to a friend.</li>
              <li>Take a 30-minute self-test.</li>
            </ul>
            <p className="mt-8 text-muted-foreground leading-relaxed">
              If this framework resonates, come experience it live — book a free demo class with Shiv Sir.
            </p>
          </article>
        </Reveal>
      </Section>

      {/* Comment design */}
      <Section className="!pt-0 max-w-3xl">
        <Reveal>
          <div className="rounded-3xl bg-white ring-1 ring-border p-7">
            <h3 className="font-display text-xl">Join the discussion</h3>
            <textarea
              rows={3}
              placeholder="Share your thoughts…"
              className="mt-4 w-full rounded-2xl bg-muted ring-1 ring-border p-4 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="mt-3 flex justify-between items-center">
              <input placeholder="Your name" className="rounded-xl bg-muted ring-1 ring-border px-3 py-2 text-sm outline-none flex-1 max-w-xs"/>
              <button className="rounded-xl gradient-luxe text-white px-5 py-2 text-sm font-medium">Post comment</button>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Related */}
      <Section>
        <h3 className="font-display text-3xl">Related reads</h3>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {related.map((p)=>(
            <Link key={p.slug} to="/blog/$slug" params={{slug:p.slug}} className="group block">
              <div className="aspect-video rounded-2xl gradient-luxe ring-1 ring-border"/>
              <div className="mt-3 text-[11px] uppercase tracking-wider text-luxury">{p.category}</div>
              <div className="mt-1 font-display text-lg group-hover:text-accent transition">{p.title}</div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
