import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Video, GraduationCap, Award, FileText, Calendar, LogOut, Shield, Loader2, PlayCircle, Store as StoreIcon, ShoppingBag, User } from "lucide-react";
import { Section } from "@/components/primitives";
import { getAccountSummary } from "@/lib/account.functions";
import { listMyEnrollments } from "@/lib/courses.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AnnouncementsStrip } from "@/components/AnnouncementsStrip";


export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My Dashboard · Shiv Sir's Education Hub" }] }),
  component: Dashboard,
});

function Dashboard() {
  const fetchSummary = useServerFn(getAccountSummary);
  const fetchEnrollments = useServerFn(listMyEnrollments);
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["account-summary"],
    queryFn: () => fetchSummary({}),
  });
  const enrollments = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: () => fetchEnrollments({}),
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
      <AnnouncementsStrip audience="students" />
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
          <div className="flex gap-2 flex-wrap">
            <Link to="/store" className="inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-5 py-2.5 text-sm font-bold shadow-luxe">
              <StoreIcon className="h-4 w-4" /> Store
            </Link>
            <Link to="/my-purchases" className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-5 py-2.5 text-sm font-medium hover:bg-muted/50">
              <ShoppingBag className="h-4 w-4" /> Purchases
            </Link>
            <Link to="/profile" className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-border px-5 py-2.5 text-sm font-medium hover:bg-muted/50">
              <User className="h-4 w-4" /> Profile
            </Link>
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
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">My Learning</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Enrolled courses</h2>
          </div>
          <Link to="/learn" className="text-sm font-medium hover:gold-text transition">All courses →</Link>
        </div>
        {enrollments.isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-luxury" />
        ) : (enrollments.data ?? []).length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-border p-8 text-center">
            <BookOpen className="h-10 w-10 text-luxury mx-auto" />
            <p className="mt-3 text-muted-foreground">You haven't enrolled in any LMS courses yet.</p>
            <Link to="/learn" className="mt-4 inline-flex rounded-xl gradient-luxe text-white px-5 py-2.5 text-sm font-medium">Browse courses</Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.data!.map((e, i) => (
              <motion.div key={e.course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to="/learn/$slug" params={{ slug: e.course.slug }} className="block h-full rounded-3xl bg-white ring-1 ring-border p-6 hover:shadow-luxe transition hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-[0.2em] gold-text">{e.course.tag}</span>
                    <GraduationCap className="h-5 w-5 text-luxury" />
                  </div>
                  <h3 className="mt-4 font-display text-xl">{e.course.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.course.summary}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-luxury">
                    <PlayCircle className="h-4 w-4" /> Continue
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <div className="rounded-3xl gradient-luxe text-white p-8 md:p-12 shadow-luxe">
          <FileText className="h-8 w-8 text-luxury" />
          <h3 className="mt-4 font-display text-2xl md:text-3xl">More features rolling out soon</h3>
          <p className="mt-3 text-white/80 max-w-xl text-sm leading-relaxed">
            Live class scheduling, MCQ tests, PDF notes and certificates will be available in Phase 4. Your account is already set up.
          </p>
        </div>
      </Section>
    </>
  );
}
