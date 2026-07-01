import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, ShoppingBag, ArrowLeft, ExternalLink } from "lucide-react";
import { Section } from "@/components/primitives";
import { listMyPurchases } from "@/lib/store.functions";

export const Route = createFileRoute("/_authenticated/my-purchases")({
  head: () => ({ meta: [{ title: "My Purchases · Shiv Sir's Education Hub" }] }),
  component: MyPurchasesPage,
});

function MyPurchasesPage() {
  const fetch = useServerFn(listMyPurchases);
  const q = useQuery({ queryKey: ["my-purchases"], queryFn: () => fetch({}) });

  return (
    <>
      <Section className="pt-10">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Purchase History</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight">My <span className="gold-text">learning</span></h1>
          <p className="mt-3 text-muted-foreground">Every lecture, note-pack and test you have unlocked lives here — permanently linked to your account.</p>
        </motion.div>
      </Section>

      <Section className="!pt-0">
        {q.isLoading ? <div className="grid place-items-center py-16"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></div> :
         (q.data ?? []).length === 0 ? (
          <div className="rounded-3xl bg-white ring-1 ring-border p-10 text-center">
            <ShoppingBag className="h-10 w-10 text-luxury mx-auto" />
            <p className="mt-3 text-muted-foreground">You haven't purchased any content yet.</p>
            <Link to="/store" className="mt-5 inline-flex rounded-2xl gradient-luxe text-white px-5 py-2.5 text-sm font-bold shadow-luxe">Explore store</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {q.data!.map((p: any, i: number) => {
              const item = p.store_items;
              const ch = item?.chapters;
              const sub = ch?.subjects;
              const co = sub?.courses;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-3xl bg-white ring-1 ring-border p-5 flex flex-wrap gap-4 items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      {p.status === "paid" ? "✓ Paid" : p.status.toUpperCase()} · {new Date(p.created_at).toLocaleDateString()}
                    </div>
                    <h3 className="mt-1 font-display text-lg">{item?.title ?? "Item"}</h3>
                    <div className="text-xs text-muted-foreground truncate">
                      {co?.title} · {sub?.title} · {ch?.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-display text-xl font-bold">₹{(p.amount_paise / 100).toFixed(0)}</div>
                    {co && sub && ch && (
                      <Link
                        to="/store/$course/$subject/$chapter"
                        params={{ course: co.slug, subject: sub.slug, chapter: ch.slug }}
                        className="inline-flex items-center gap-1.5 rounded-xl gradient-luxe text-white px-4 py-2 text-xs font-bold"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
