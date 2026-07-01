import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Section } from "@/components/primitives";
import { listChaptersBySubjectSlug } from "@/lib/store.functions";

export const Route = createFileRoute("/_authenticated/store/$course/$subject")({
  head: () => ({ meta: [{ title: "Chapters · Store" }] }),
  component: ChaptersPage,
});

function ChaptersPage() {
  const { course, subject } = Route.useParams();
  const fetch = useServerFn(listChaptersBySubjectSlug);
  const q = useQuery({
    queryKey: ["store-chapters", course, subject],
    queryFn: () => fetch({ data: { courseSlug: course, subjectSlug: subject } }),
  });

  if (q.isLoading) return <Section className="min-h-[60vh] grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></Section>;
  if (!q.data) return <Section className="min-h-[60vh] grid place-items-center"><p className="text-muted-foreground">Subject not found.</p></Section>;

  const { course: c, subject: s, chapters } = q.data;

  return (
    <>
      <Section className="pt-10">
        <Link to="/store/$course" params={{ course }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {c.title}
        </Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Subject</div>
          <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold tracking-tight">{s.title}</h1>
          {s.description && <p className="mt-3 text-muted-foreground max-w-xl">{s.description}</p>}
        </motion.div>
      </Section>

      <Section className="!pt-0">
        {chapters.length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-border p-10 text-center">
            <FileText className="h-10 w-10 text-luxury mx-auto" />
            <p className="mt-3 text-muted-foreground">Chapters coming soon.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {chapters.map((ch: any, i: number) => (
              <motion.div key={ch.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link
                  to="/store/$course/$subject/$chapter"
                  params={{ course, subject, chapter: ch.slug }}
                  className="group flex items-center gap-4 rounded-3xl bg-white ring-1 ring-border p-5 shadow-soft hover:shadow-luxe transition hover:-translate-y-0.5"
                >
                  <div className="h-11 w-11 rounded-2xl gradient-luxe grid place-items-center text-white text-sm font-bold">{i + 1}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg truncate">{ch.title}</h3>
                    {ch.description && <p className="text-sm text-muted-foreground line-clamp-1">{ch.description}</p>}
                  </div>
                  <ArrowRight className="h-5 w-5 text-luxury group-hover:translate-x-1 transition" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
