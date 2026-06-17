import { createFileRoute, Link, useNavigate, useServerFn } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Video, GraduationCap, Award, FileText, Calendar, LogOut, Shield, Loader2 } from "lucide-react";
import { Section } from "@/components/primitives";
import { COURSES } from "@/lib/site";
import { getAccountSummary } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard · Shiv Sir's Education Hub" }] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchSummary = useServerFn(getAccountSummary);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["account-summary"],
    queryFn: () => fetchSummary({}),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  const isAdmin = data?.roles.includes("admin");
  const displayName = data?.fullName || data?.email?.split("@")[0] || "Student";

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Student Portal</div>
            <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight">
              {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-luxury" /> : <>Welcome, <span className="gold-text">{displayName}</span></>}
            </h1>
            <p className="mt-3 text-muted-foreground">Your commerce journey, all in one place.</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Link to="/admin" className="inline-flex items-center gap-2 rounded-2xl bg-foreground text-background px-5 py-2.5 text-sm font-medium shadow-soft">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-5 py-2.5 text-sm font-medium hover:bg-muted/50">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </motion.div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BookOpen, label: "Enrolled Courses", value: "—", note: "Coming in Phase 3" },
            { icon: Video, label: "Lectures Watched", value: "—", note: "Coming in Phase 3" },
            { icon: Calendar, label: "Next Live Class", value: "—", note: "Coming in Phase 4" },
            { icon: Award, label: "Certificates", value: "—", note: "Coming in Phase 4" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-3xl bg-white ring-1 ring-border p-6 shadow-soft hover:shadow-luxe transition"
            >
              <div className="h-10 w-10 rounded-2xl gradient-luxe grid place-items-center text-white">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              <div className="mt-2 text-[10px] uppercase tracking-wider text-luxury/80">{s.note}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Explore</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Available courses</h2>
          </div>
          <Link to="/courses" className="text-sm font-medium hover:gold-text transition">View all →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.slice(0, 6).map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="block h-full rounded-3xl bg-white ring-1 ring-border p-6 hover:shadow-luxe transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] gold-text">{c.tag}</span>
                  <GraduationCap className="h-5 w-5 text-luxury" />
                </div>
                <h3 className="mt-4 font-display text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-3xl gradient-luxe text-white p-8 md:p-12 shadow-luxe">
          <FileText className="h-8 w-8 text-luxury" />
          <h3 className="mt-4 font-display text-2xl md:text-3xl">More features rolling out soon</h3>
          <p className="mt-3 text-white/80 max-w-xl text-sm leading-relaxed">
            Recorded lectures, live class scheduling, MCQ tests, PDF notes and certificates will be available in the next phases. Your account is already set up — you'll see new tools appear here as we ship them.
          </p>
        </div>
      </Section>
    </>
  );
}
