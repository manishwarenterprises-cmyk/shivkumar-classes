import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { Section } from "@/components/primitives";
import { listSubjectsByCourseSlug } from "@/lib/store.functions";

export const Route = createFileRoute("/_authenticated/store/$course")({
  head: () => ({ meta: [{ title: "Course Subjects · Store" }] }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const { course } = Route.useParams();
  const fetch = useServerFn(listSubjectsByCourseSlug);
  const q = useQuery({
    queryKey: ["store-subjects", course],
    queryFn: () => fetch({ data: { courseSlug: course } }),
  });

  if (q.isLoading) return <Section className="min-h-[60vh] grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></Section>;
  if (!q.data) return <Section className="min-h-[60vh] grid place-items-center"><p className="text-muted-foreground">Course not found.</p></Section>;

  const { course: c, subjects } = q.data;

  return (
    <>
      <Section className="pt-10">
        <Link to="/store" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Store</Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">{c.tag} · {c.duration}</div>
          <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold tracking-tight">{c.title}</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">{c.summary}</p>
        </motion.div>
      </Section>

      <Section className="!pt-0">
        {subjects.length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-border p-10 text-center">
            <BookOpen className="h-10 w-10 text-luxury mx-auto" />
            <p className="mt-3 text-muted-foreground">Subjects for this course are being uploaded.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s: any, i: number) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  to="/store/$course/$subject"
                  params={{ course, subject: s.slug }}
                  className="group block h-full rounded-3xl bg-white ring-1 ring-border p-6 shadow-soft hover:shadow-luxe transition hover:-translate-y-1"
                >
                  <div className="h-10 w-10 rounded-2xl gradient-luxe grid place-items-center text-white">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl">{s.title}</h3>
                  {s.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.description}</p>}
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-luxury group-hover:translate-x-1 transition">
                    Open chapters <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
