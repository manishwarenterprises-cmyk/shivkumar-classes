import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus, Trash2, ArrowLeft, ShieldAlert, Megaphone, Edit3 } from "lucide-react";
import { Section } from "@/components/primitives";
import { getAccountSummary } from "@/lib/account.functions";
import { adminListAnnouncements, upsertAnnouncement, deleteAnnouncement } from "@/lib/store-admin.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/admin/announcements")({
  head: () => ({ meta: [{ title: "Admin · Announcements" }] }),
  component: AdminAnnouncementsPage,
});

const inputCls = "w-full rounded-xl border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-luxury/50";

function AdminAnnouncementsPage() {
  const fetchAcct = useServerFn(getAccountSummary);
  const acct = useQuery({ queryKey: ["account-summary"], queryFn: () => fetchAcct({}) });
  const staff = acct.data?.roles.includes("admin") || acct.data?.roles.includes("teacher");

  const listFn = useServerFn(adminListAnnouncements);
  const upsert = useServerFn(upsertAnnouncement);
  const remove = useServerFn(deleteAnnouncement);
  const q = useQuery({ queryKey: ["admin-announcements"], queryFn: () => listFn({}), enabled: !!staff });

  const empty = { title: "", body: "", audience: "all" as const, is_published: true };
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);

  if (acct.isLoading) return <Section className="min-h-[60vh] grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></Section>;
  if (!staff) return (
    <Section className="min-h-[60vh] grid place-items-center text-center">
      <div>
        <ShieldAlert className="h-12 w-12 text-luxury mx-auto" />
        <h1 className="mt-5 font-display text-3xl font-bold">Staff access only</h1>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-2xl gradient-luxe text-white px-5 py-2.5 text-sm">Back</Link>
      </div>
    </Section>
  );

  const submit = async () => {
    if (!form.title || !form.body) return toast.error("Title and body required");
    try {
      await upsert({ data: editing ? { ...form, id: editing } : form });
      toast.success(editing ? "Updated" : "Published");
      setForm(empty); setEditing(null);
      q.refetch();
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Admin</Link>
        <div className="mt-4">
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold flex items-center gap-2"><Megaphone className="h-3.5 w-3.5" /> Announcements</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Publish news</h1>
          <p className="mt-2 text-muted-foreground text-sm">Announcements automatically appear on the homepage and student dashboard.</p>
        </div>
      </Section>

      <Section className="!pt-0 grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="rounded-3xl bg-white ring-1 ring-border p-5 space-y-3 shadow-soft h-fit">
          <h2 className="font-display text-lg">{editing ? "Edit announcement" : "New announcement"}</h2>
          <input className={inputCls} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea rows={4} className={inputCls} placeholder="Body" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
          <select className={inputCls} value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
            <option value="all">Everyone (home + dashboard)</option>
            <option value="home">Homepage only</option>
            <option value="students">Student dashboard only</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
          <div className="flex gap-2">
            <button onClick={submit} className="rounded-xl gradient-luxe text-white px-4 py-2 text-sm font-bold inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> {editing ? "Save" : "Publish"}</button>
            {editing && <button onClick={() => { setEditing(null); setForm(empty); }} className="rounded-xl bg-muted px-4 py-2 text-sm">Cancel</button>}
          </div>
        </div>
        <div className="space-y-3">
          {q.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> :
            (q.data ?? []).length === 0 ? <p className="text-muted-foreground text-sm">No announcements yet.</p> :
            q.data!.map((a: any) => (
              <div key={a.id} className="rounded-2xl bg-white ring-1 ring-border p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider font-bold gold-text">{a.audience} · {a.is_published ? "Live" : "Draft"}</div>
                  <div className="mt-1 font-display text-lg">{a.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{a.body}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditing(a.id); setForm({ title: a.title, body: a.body, audience: a.audience, is_published: a.is_published }); }} className="p-1.5 rounded hover:bg-muted"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={async () => { if (confirm("Delete?")) { await remove({ data: { id: a.id } }); q.refetch(); } }} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
        </div>
      </Section>
    </>
  );
}
