import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { COURSES } from "@/lib/site";
import { ArrowRight, GraduationCap, Clock } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Shiv Sir's Education Hub" },
      { name: "description", content: "Commerce coaching for 11th, 12th, CBSE, Maharashtra Board, B.Com and BBA students in Nagpur." },
      { property: "og:title", content: "Courses — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Explore our complete commerce coaching programmes." },
    ],
    links: [{ rel: "canonical", href: "/courses" }],
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
    </>
  );
}
