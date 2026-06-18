import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Loader2, PlayCircle } from "lucide-react";
import { Section } from "@/components/primitives";
import { listMyEnrollments, listPublishedCourses, enrollInCourse } from "@/lib/courses.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/learn")({
  head: () => ({ meta: [{ title: "My Learning · Shiv Sir's Education Hub" }] }),
  component: LearnPage,
});

function LearnPage() {
  const fetchMy = useServerFn(listMyEnrollments);
  const fetchAll = useServerFn(listPublishedCourses);
  const enroll = useServerFn(enrollInCourse);

  const my = useQuery({ queryKey: ["my-enrollments"], queryFn: () => fetchMy({}) });
  const all = useQuery({ queryKey: ["published-courses"], queryFn: () => fetchAll({}) });

  const enrolledIds = new Set((my.data ?? []).map((e) => e.course.id));

  const onEnroll = async (courseId: string) => {
    try {
      await enroll({ data: { courseId } });
      toast.success("Enrolled!");
      my.refetch();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">My Learning</div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight">
            Your enrolled <span className="gold-text">courses</span>
          </h1>
        </motion.div>
      </Section>

      <Section className="!pt-0">
        {my.isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-luxury" />
        ) : (my.data ?? []).length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-border p-10 text-center">
            <BookOpen className="h-10 w-10 text-luxury mx-auto" />
            <p className="mt-4 text-muted-foreground">You haven't enrolled in any courses yet. Browse below to get started.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {my.data!.map((e) => (
              <Link
                key={e.course.id}
                to="/learn/$slug"
                params={{ slug: e.course.slug }}
                className="rounded-3xl bg-white ring-1 ring-border p-6 hover:shadow-luxe transition hover:-translate-y-1"
              >
                {e.course.cover_url && (
                  <img src={e.course.cover_url} alt={e.course.title} className="w-full h-32 object-cover rounded-2xl mb-4" />
                )}
                <span className="text-xs font-bold uppercase tracking-[0.2em] gold-text">{e.course.tag}</span>
                <h3 className="mt-2 font-display text-xl">{e.course.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.course.summary}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-luxury">
                  <PlayCircle className="h-4 w-4" /> Continue learning
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <h2 className="font-display text-3xl mb-6">All courses</h2>
        {all.isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-luxury" />
        ) : (all.data ?? []).length === 0 ? (
          <p className="text-muted-foreground">No published courses yet. Admins can create them in the Admin → Courses panel.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {all.data!.map((c) => (
              <div key={c.id} className="rounded-3xl bg-white ring-1 ring-border p-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] gold-text">{c.tag}</span>
                <h3 className="mt-2 font-display text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{c.price_inr > 0 ? `₹${c.price_inr}` : "Free"}</span>
                  {enrolledIds.has(c.id) ? (
                    <Link to="/learn/$slug" params={{ slug: c.slug }} className="text-sm font-medium gold-text">Open →</Link>
                  ) : (
                    <button onClick={() => onEnroll(c.id)} className="rounded-xl gradient-luxe text-white px-4 py-2 text-sm font-medium">
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
