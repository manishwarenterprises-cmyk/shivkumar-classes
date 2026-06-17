import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { COURSES, SITE } from "@/lib/site";
import { ArrowLeft, BookOpen, MessageCircle, CheckCircle2, ClipboardCheck, HelpCircle, Trophy } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const course = COURSES.find((c) => c.slug === params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.title} — Shiv Sir's Education Hub` },
      { name: "description", content: loaderData?.course.summary },
      { property: "og:title", content: `${loaderData?.course.title} Coaching in Nagpur` },
      { property: "og:description", content: loaderData?.course.summary },
    ],
    links: [{ rel: "canonical", href: `/courses/${loaderData?.course.slug}` }],
  }),
  notFoundComponent: () => <div className="py-32 text-center text-muted-foreground">Course not found.</div>,
  component: CourseDetail,
});

const FAQS = [
  { q: "What is the batch size?", a: "We maintain small batches to ensure every student gets personal attention." },
  { q: "Are notes included?", a: "Yes — printed chapter notes, formula sheets and previous-year question banks are included." },
  { q: "How often are tests held?", a: "Weekly chapter tests plus monthly comprehensive mock exams." },
  { q: "What is the demo class like?", a: "A full 45-minute teaching session covering an actual chapter — not a sales pitch." },
];

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <Section className="pt-12">
        <Reveal>
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span className="text-base md:text-lg font-bold uppercase tracking-[0.22em] gold-text">{course.tag}</span>
            <span className="text-sm text-muted-foreground">· {course.duration}</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl md:text-7xl text-balance">
            {course.title}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">{course.summary}</p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/admission" className="inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-6 py-3 text-sm font-medium shadow-luxe">
              Book Free Demo Class
            </Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-6 py-3 text-sm font-medium">
              <MessageCircle className="h-4 w-4" /> WhatsApp Sir
            </a>
          </div>
        </Reveal>
      </Section>

      <Section className="!pt-0">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Overview", body: `${course.title} is structured to build deep conceptual clarity over the ${course.duration.toLowerCase()} programme. Lessons move from intuition to application.` },
            { icon: ClipboardCheck, title: "Teaching Process", body: "Daily concept lecture · Chapter notes · Practice problems · Weekly test · Doubt session · Monthly mock exam." },
            { icon: HelpCircle, title: "Doubt Solving", body: "Dedicated doubt slots, plus 1-on-1 sessions for chapters that need extra time. No question is too small." },
            { icon: Trophy, title: "Test Series", body: "Weekly tests, monthly mocks and full board-pattern exams — each followed by personalised answer-script feedback." },
            { icon: CheckCircle2, title: "Subjects Covered", body: course.subjects.join(" · ") },
            { icon: CheckCircle2, title: "Course Benefits", body: "Conceptual clarity, board-pattern mastery, free study material, parent updates and a calm learning environment." },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i*0.05}>
              <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft">
                <div className="h-10 w-10 rounded-2xl gradient-luxe grid place-items-center text-white">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl">{b.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="FAQ" title={<>Quick answers</>} />
        <div className="mt-12 max-w-2xl mx-auto space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="rounded-2xl bg-white ring-1 ring-border overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left p-5">
                <span className="font-medium text-sm">{f.q}</span>
                <span className="text-luxury">{open === i ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
