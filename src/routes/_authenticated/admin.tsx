import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, BookOpen, Video, MessageSquare, BarChart3, Bell, Settings, Loader2, ShieldAlert } from "lucide-react";
import { Section } from "@/components/primitives";
import { getAccountSummary } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin · Shiv Sir's Education Hub" }] }),
  component: AdminPage,
});

function AdminPage() {
  const fetchSummary = useServerFn(getAccountSummary);
  const { data, isLoading } = useQuery({
    queryKey: ["account-summary"],
    queryFn: () => fetchSummary({}),
  });

  if (isLoading) {
    return (
      <Section className="min-h-[60vh] grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-luxury" />
      </Section>
    );
  }

  if (!data?.roles.includes("admin")) {
    return (
      <Section className="min-h-[60vh] grid place-items-center text-center">
        <div>
          <ShieldAlert className="h-12 w-12 text-luxury mx-auto" />
          <h1 className="mt-5 font-display text-3xl font-bold">Admin access only</h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            This area is restricted to administrators. Ask Prof. Shiv Kumar Dubey to grant you the <code className="px-1.5 py-0.5 rounded bg-muted">admin</code> role.
          </p>
          <Link to="/dashboard" className="mt-6 inline-flex rounded-2xl gradient-luxe text-white px-5 py-2.5 text-sm font-medium">
            Back to dashboard
          </Link>
        </div>
      </Section>
    );
  }

  const tiles = [
    { icon: Users, label: "Students", value: "—", note: "Manage enrollments" },
    { icon: BookOpen, label: "Courses", value: "—", note: "Create & edit courses" },
    { icon: Video, label: "Lectures", value: "—", note: "Upload recordings" },
    { icon: MessageSquare, label: "Live Classes", value: "—", note: "Schedule Zoom/Meet" },
    { icon: BarChart3, label: "Revenue", value: "—", note: "Analytics & reports" },
    { icon: Bell, label: "Announcements", value: "—", note: "Push notifications" },
    { icon: Settings, label: "Settings", value: "—", note: "Institute settings" },
  ];

  return (
    <>
      <Section className="pt-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Admin Console</div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight">
            Welcome back, <span className="gold-text">Sir</span>
          </h1>
          <p className="mt-3 text-muted-foreground">{data.email}</p>
        </motion.div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-3xl bg-white ring-1 ring-border p-6 shadow-soft hover:shadow-luxe transition hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-2xl gradient-luxe grid place-items-center text-white">
                  <t.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-luxury/80">Phase 3+</span>
              </div>
              <div className="mt-5 font-display text-3xl font-bold">{t.value}</div>
              <div className="mt-1 text-sm font-medium">{t.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t.note}</div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
