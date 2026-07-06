import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { FAQBlock, faqSchema, type FAQ } from "@/components/FAQBlock";
import { COURSES } from "@/lib/site";
import { ArrowRight, GraduationCap, Clock } from "lucide-react";

const CANONICAL = "https://shivkumar-classes.lovable.app/courses";

const COURSE_FAQS: FAQ[] = [
  { q: "Which boards do you cover for 11th and 12th Commerce?", a: "CBSE, Maharashtra State Board (HSC) and ICSE — with separate batches so teaching stays aligned to each board's pattern and weightage." },
  { q: "What subjects are taught in 11th and 12th Commerce?", a: "Accountancy, Economics, Business Studies, OCM/SP (HSC) and Mathematics or Applied Maths. English support is offered on request." },
  { q: "Do you teach B.Com and BBA at the university level?", a: "Yes. We run semester-wise tuition for B.Com and BBA students of Nagpur University — covering Financial Accounting, Business Law, Cost Accounting, Taxation, Auditing and management papers." },
  { q: "How large are the batches?", a: "Every batch is capped at 20 students. This lets Shiv Sir track individual progress every week and give personal doubt sessions when needed." },
  { q: "Are printed notes and mock tests included?", a: "Yes — all courses include printed chapter notes, weekly tests and 10+ mock boards for 12th students, at no extra cost." },
  { q: "Do you offer online classes?", a: "Yes. Live online batches run in parallel to offline classes for 11th, 12th and CBSE Commerce. Class recordings are shared within 2 hours." },
];

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Commerce Coaching Courses in Nagpur — 11th, 12th, B.Com, BBA" },
      { name: "description", content: "Complete commerce coaching in Nagpur — 11th, 12th, CBSE, Maharashtra Board, B.Com and BBA. Personal mentorship, printed notes and mock boards included." },
      { property: "og:title", content: "Commerce Coaching Courses — Shiv Sir's Education Hub, Nagpur" },
      { property: "og:description", content: "Explore our complete commerce coaching programmes for 11th, 12th, B.Com and BBA students." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema(COURSE_FAQS)) }],
  }),
  component: CoursesLayout,
});

function CoursesLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/courses") return <Outlet />;
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Our Programmes"
          title={<>Commerce coaching, <span className="gold-text">end-to-end</span></>}
          subtitle="From your first 11th Commerce class to your final B.Com semester — one trusted teacher, one consistent philosophy."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link to="/courses/$slug" params={{ slug: c.slug }} className="group block h-full">
                <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 hover:shadow-luxe transition-all hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base font-bold uppercase tracking-[0.2em] gold-text">{c.tag}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{c.duration}</span>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl gradient-luxe grid place-items-center text-white">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-2xl">{c.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {c.subjects.slice(0,3).map(s=>(
                      <span key={s} className="text-[11px] rounded-full bg-muted px-2.5 py-1 text-muted-foreground">{s}</span>
                    ))}
                  </div>
                  <div className="mt-6 inline-flex items-center text-sm font-medium text-foreground">
                    View course <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <FAQBlock
        eyebrow="Courses FAQ"
        title={<>Choosing the <span className="gold-text">right programme</span></>}
        faqs={COURSE_FAQS}
      />
    </>
  );
}
