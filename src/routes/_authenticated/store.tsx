import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Store as StoreIcon, ArrowRight, ShoppingBag } from "lucide-react";
import { Section } from "@/components/primitives";
import { listStoreCourses } from "@/lib/store.functions";

export const Route = createFileRoute("/_authenticated/store")({
  head: () => ({ meta: [{ title: "Store · Shiv Sir's Education Hub" }] }),
  component: StorePage,
});

function StorePage() {
  const fetchCourses = useServerFn(listStoreCourses);
  const q = useQuery({ queryKey: ["store-courses"], queryFn: () => fetchCourses({}) });

  return (
    <>
      <Section className="pt-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold flex items-center gap-2">
              <StoreIcon className="h-3.5 w-3.5" /> Education Store
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight">
              Pick your <span className="gold-text">course</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">Unlock premium lectures, notes and tests — chapter by chapter, at student-friendly micro pricing.</p>
          </div>
          <Link to="/my-purchases" className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-5 py-2.5 text-sm font-medium hover:bg-muted/50">
            <ShoppingBag className="h-4 w-4" /> My purchases
          </Link>
        </motion.div>
      </Section>

      <Section className="!pt-0">
        {q.isLoading ? (
          <div className="grid place-items-center py-16"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></div>
        ) : (q.data ?? []).length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-border p-10 text-center">
            <StoreIcon className="h-10 w-10 text-luxury mx-auto" />
            <p className="mt-3 text-muted-foreground">The store is being set up. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {q.data!.map((c: any, i: number) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  to="/store/$course"
                  params={{ course: c.slug }}
                  className="group block h-full rounded-3xl bg-white ring-1 ring-border p-6 shadow-soft hover:shadow-luxe transition hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] gold-text">{c.tag ?? "Commerce"}</span>
                    <span className="text-xs text-muted-foreground">{c.duration}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{c.summary}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-luxury group-hover:translate-x-1 transition">
                    Explore subjects <ArrowRight className="h-4 w-4" />
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
