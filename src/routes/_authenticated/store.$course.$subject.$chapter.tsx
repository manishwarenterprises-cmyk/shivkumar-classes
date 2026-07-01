import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, ArrowLeft, Video, FileText, GraduationCap, Package, Lock, PlayCircle, Download, ExternalLink, CheckCircle2, IndianRupee } from "lucide-react";
import { Section } from "@/components/primitives";
import { getChapterDetail, createOrder, confirmPayment, unlockItemContent } from "@/lib/store.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/store/$course/$subject/$chapter")({
  head: () => ({ meta: [{ title: "Chapter · Store" }] }),
  component: ChapterDetailPage,
});

const kindMeta: Record<string, { icon: any; label: string; accent: string }> = {
  lecture: { icon: Video, label: "Video Lecture", accent: "from-indigo-500 to-purple-500" },
  notes:   { icon: FileText, label: "PDF Notes", accent: "from-amber-500 to-orange-500" },
  test:    { icon: GraduationCap, label: "Test Paper", accent: "from-emerald-500 to-teal-500" },
  bundle:  { icon: Package, label: "Complete Bundle", accent: "from-luxury to-amber-500" },
};

function rupees(paise: number) { return `₹${(paise / 100).toFixed(paise % 100 === 0 ? 0 : 2)}`; }

function ItemCard({ item, onChanged }: { item: any; onChanged: () => void }) {
  const meta = kindMeta[item.kind] ?? kindMeta.lecture;
  const Icon = meta.icon;
  const [busy, setBusy] = useState(false);
  const [unlocked, setUnlocked] = useState<{ contentUrl: string | null; fileUrl: string | null } | null>(null);
  const createOrderFn = useServerFn(createOrder);
  const confirmFn = useServerFn(confirmPayment);
  const unlockFn = useServerFn(unlockItemContent);

  const buy = async () => {
    setBusy(true);
    try {
      // Razorpay stub — in production, load checkout.js and open the checkout modal.
      const order = await createOrderFn({ data: { itemId: item.id } });
      // Simulate a Razorpay checkout confirmation
      const confirm = window.confirm(
        `Proceed with payment of ${rupees(order.amountPaise)} for "${order.itemTitle}"?\n\n` +
        `(Razorpay checkout stub — will be replaced by live Razorpay modal on production. UPI, GPay, PhonePe & cards supported.)`,
      );
      if (!confirm) {
        toast.info("Payment cancelled");
        return;
      }
      await confirmFn({ data: { purchaseId: order.purchaseId } });
      toast.success("Payment successful — content unlocked!");
      onChanged();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  const unlock = async () => {
    setBusy(true);
    try {
      const r = await unlockFn({ data: { itemId: item.id } });
      setUnlocked({ contentUrl: r.contentUrl, fileUrl: r.fileUrl });
      if (r.contentUrl) {
        window.open(r.contentUrl, "_blank", "noopener");
      } else if (r.fileUrl) {
        window.open(r.fileUrl, "_blank", "noopener");
      }
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  };

  const free = item.price_paise === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-border p-5 shadow-soft hover:shadow-luxe transition"
    >
      <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${meta.accent} opacity-10 blur-2xl`} />
      <div className="flex items-start gap-4">
        <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${meta.accent} grid place-items-center text-white shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{meta.label}</span>
            {item.has_access && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle2 className="h-3 w-3" /> UNLOCKED</span>}
            {free && !item.has_access && <span className="text-[10px] font-bold gold-text">FREE</span>}
          </div>
          <h3 className="mt-1 font-display text-lg">{item.title}</h3>
          {item.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
        </div>
        <div className="text-right shrink-0">
          {!free && <div className="inline-flex items-center gap-0.5 font-display text-2xl font-bold"><IndianRupee className="h-4 w-4" />{(item.price_paise / 100).toFixed(item.price_paise % 100 === 0 ? 0 : 2)}</div>}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {item.preview_url && (
          <a href={item.preview_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-3.5 py-2 text-xs font-medium hover:bg-muted/70">
            <PlayCircle className="h-3.5 w-3.5" /> Free preview
          </a>
        )}
        {item.has_access || free ? (
          <button
            onClick={unlock}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-xl gradient-luxe text-white px-4 py-2 text-xs font-bold shadow-soft disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : item.kind === "notes" || item.kind === "test" ? <Download className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
            {item.kind === "notes" ? "Download notes" : item.kind === "test" ? "Open test" : "Open on Classplus"}
          </button>
        ) : (
          <button
            onClick={buy}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-xs font-bold shadow-soft disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Lock className="h-3.5 w-3.5" />} Buy for {rupees(item.price_paise)}
          </button>
        )}
        {unlocked?.contentUrl && (
          <a href={unlocked.contentUrl} target="_blank" rel="noreferrer" className="text-xs text-luxury underline">Re-open link</a>
        )}
      </div>
    </motion.div>
  );
}

function ChapterDetailPage() {
  const { course, subject, chapter } = Route.useParams();
  const fetch = useServerFn(getChapterDetail);
  const q = useQuery({
    queryKey: ["store-chapter", course, subject, chapter],
    queryFn: () => fetch({ data: { courseSlug: course, subjectSlug: subject, chapterSlug: chapter } }),
  });

  if (q.isLoading) return <Section className="min-h-[60vh] grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></Section>;
  if (!q.data) return <Section className="min-h-[60vh] grid place-items-center"><p className="text-muted-foreground">Chapter not found.</p></Section>;

  const { course: c, subject: s, chapter: ch, items } = q.data;

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <Link to="/store/$course/$subject" params={{ course, subject }} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {s.title}
        </Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">{c.title} · {s.title}</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight">{ch.title}</h1>
          {ch.description && <p className="mt-3 text-muted-foreground max-w-2xl">{ch.description}</p>}
        </motion.div>
      </Section>

      <Section className="!pt-0">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-border p-10 text-center">
            <Video className="h-10 w-10 text-luxury mx-auto" />
            <p className="mt-3 text-muted-foreground">No content published for this chapter yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((it: any) => <ItemCard key={it.id} item={it} onChanged={() => q.refetch()} />)}
          </div>
        )}
      </Section>
    </>
  );
}
