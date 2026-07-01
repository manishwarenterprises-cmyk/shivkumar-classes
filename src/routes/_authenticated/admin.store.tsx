import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus, Trash2, ArrowLeft, ShieldAlert, ChevronDown, ChevronRight } from "lucide-react";
import { Section } from "@/components/primitives";
import { getAccountSummary } from "@/lib/account.functions";
import { adminListCourses } from "@/lib/lms-admin.functions";
import {
  adminListSubjects, upsertSubject, deleteSubject,
  adminListChapters, upsertChapter, deleteChapter,
  adminListItems, upsertItem, deleteItem,
} from "@/lib/store-admin.functions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/admin/store")({
  head: () => ({ meta: [{ title: "Admin · Store" }] }),
  component: AdminStorePage,
});

const inputCls = "w-full rounded-xl border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-luxury/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</label>{children}</div>;
}

function AdminStorePage() {
  const fetchAcct = useServerFn(getAccountSummary);
  const acct = useQuery({ queryKey: ["account-summary"], queryFn: () => fetchAcct({}) });
  const staff = acct.data?.roles.includes("admin") || acct.data?.roles.includes("teacher");

  const fetchCourses = useServerFn(adminListCourses);
  const courses = useQuery({ queryKey: ["admin-courses"], queryFn: () => fetchCourses({}), enabled: !!staff });

  const [openCourse, setOpenCourse] = useState<string | null>(null);

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

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Admin</Link>
        <div className="mt-4">
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Admin · Store</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Manage store content</h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-2xl">Course → Subject → Chapter → Content. Add lectures, notes and tests with individual pricing, or bundle them at a discount.</p>
        </div>
      </Section>

      <Section className="!pt-0 space-y-3">
        {courses.isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> :
          (courses.data ?? []).length === 0 ? (
            <div className="rounded-3xl bg-white ring-1 ring-border p-8 text-center">
              <p className="text-muted-foreground">Create a course first in <Link className="underline" to="/admin/courses">Admin · Courses</Link>.</p>
            </div>
          ) : courses.data!.map((c: any) => (
            <div key={c.id} className="rounded-3xl bg-white ring-1 ring-border overflow-hidden">
              <button onClick={() => setOpenCourse(openCourse === c.id ? null : c.id)} className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/40">
                <div>
                  <div className="text-[10px] gold-text font-bold uppercase tracking-wider">{c.tag ?? "Course"}</div>
                  <div className="mt-1 font-display text-xl">{c.title}</div>
                </div>
                {openCourse === c.id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
              {openCourse === c.id && <SubjectsPanel courseId={c.id} />}
            </div>
          ))
        }
      </Section>
    </>
  );
}

function SubjectsPanel({ courseId }: { courseId: string }) {
  const listFn = useServerFn(adminListSubjects);
  const upsert = useServerFn(upsertSubject);
  const remove = useServerFn(deleteSubject);
  const q = useQuery({ queryKey: ["admin-subjects", courseId], queryFn: () => listFn({ data: { courseId } }) });
  const [draft, setDraft] = useState({ slug: "", title: "" });
  const [open, setOpen] = useState<string | null>(null);

  const add = async () => {
    if (!draft.slug || !draft.title) return;
    try {
      await upsert({ data: { course_id: courseId, slug: draft.slug, title: draft.title, order_index: q.data?.length ?? 0, is_published: true } });
      setDraft({ slug: "", title: "" });
      q.refetch();
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="border-t border-border bg-muted/30 p-4 space-y-2">
      {q.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (q.data ?? []).map((s: any) => (
        <div key={s.id} className="rounded-2xl bg-white ring-1 ring-border overflow-hidden">
          <div className="p-4 flex items-center justify-between flex-wrap gap-2">
            <button onClick={() => setOpen(open === s.id ? null : s.id)} className="text-left min-w-0 flex-1">
              <div className="font-display text-lg">{s.title}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">/{s.slug}</div>
            </button>
            <button onClick={async () => { if (confirm("Delete subject?")) { await remove({ data: { id: s.id } }); q.refetch(); } }} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button>
          </div>
          {open === s.id && <ChaptersPanel subjectId={s.id} />}
        </div>
      ))}
      <div className="rounded-2xl bg-white ring-1 ring-border p-3 grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
        <Field label="Slug"><input className={inputCls} placeholder="book-keeping" value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value })} /></Field>
        <Field label="Subject title"><input className={inputCls} placeholder="Book Keeping" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field>
        <button onClick={add} className="rounded-xl gradient-luxe text-white px-4 py-2 text-sm font-bold inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add subject</button>
      </div>
    </div>
  );
}

function ChaptersPanel({ subjectId }: { subjectId: string }) {
  const listFn = useServerFn(adminListChapters);
  const upsert = useServerFn(upsertChapter);
  const remove = useServerFn(deleteChapter);
  const q = useQuery({ queryKey: ["admin-chapters", subjectId], queryFn: () => listFn({ data: { subjectId } }) });
  const [draft, setDraft] = useState({ slug: "", title: "" });
  const [open, setOpen] = useState<string | null>(null);

  const add = async () => {
    if (!draft.slug || !draft.title) return;
    try {
      await upsert({ data: { subject_id: subjectId, slug: draft.slug, title: draft.title, order_index: q.data?.length ?? 0, is_published: true } });
      setDraft({ slug: "", title: "" });
      q.refetch();
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="border-t border-border bg-muted/40 p-3 space-y-2">
      {q.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (q.data ?? []).map((ch: any) => (
        <div key={ch.id} className="rounded-2xl bg-white ring-1 ring-border overflow-hidden">
          <div className="p-3 flex items-center justify-between flex-wrap gap-2">
            <button onClick={() => setOpen(open === ch.id ? null : ch.id)} className="text-left min-w-0 flex-1">
              <div className="font-medium">{ch.title}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">/{ch.slug}</div>
            </button>
            <button onClick={async () => { if (confirm("Delete chapter?")) { await remove({ data: { id: ch.id } }); q.refetch(); } }} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button>
          </div>
          {open === ch.id && <ItemsPanel chapterId={ch.id} />}
        </div>
      ))}
      <div className="rounded-2xl bg-white ring-1 ring-border p-3 grid md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
        <Field label="Slug"><input className={inputCls} placeholder="journal-entries" value={draft.slug} onChange={e => setDraft({ ...draft, slug: e.target.value })} /></Field>
        <Field label="Chapter title"><input className={inputCls} placeholder="Chapter 1 – Journal" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field>
        <button onClick={add} className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-bold inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add chapter</button>
      </div>
    </div>
  );
}

function ItemsPanel({ chapterId }: { chapterId: string }) {
  const listFn = useServerFn(adminListItems);
  const upsert = useServerFn(upsertItem);
  const remove = useServerFn(deleteItem);
  const q = useQuery({ queryKey: ["admin-items", chapterId], queryFn: () => listFn({ data: { chapterId } }) });
  const [draft, setDraft] = useState<any>({
    kind: "lecture", title: "", description: "", price_rupees: 10,
    preview_url: "", content_url: "", file_url: "", is_published: true,
  });

  const add = async () => {
    if (!draft.title.trim()) return;
    try {
      await upsert({ data: {
        chapter_id: chapterId, kind: draft.kind, title: draft.title,
        description: draft.description || null, price_paise: Math.round(Number(draft.price_rupees) * 100),
        preview_url: draft.preview_url || null, content_url: draft.content_url || null,
        file_url: draft.file_url || null, bundle_item_ids: [],
        order_index: q.data?.length ?? 0, is_published: draft.is_published,
      }});
      setDraft({ ...draft, title: "", description: "", preview_url: "", content_url: "", file_url: "" });
      q.refetch();
    } catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div className="border-t border-border bg-white p-3 space-y-2">
      {q.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (q.data ?? []).map((it: any) => (
        <div key={it.id} className="rounded-xl ring-1 ring-border p-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] gold-text font-bold uppercase tracking-wider">{it.kind}</div>
            <div className="font-medium truncate">{it.title}</div>
            <div className="text-xs text-muted-foreground truncate">
              ₹{(it.price_paise / 100).toFixed(0)} · {it.content_url ? "🔒 premium link set" : "no premium link"} {it.file_url ? "· 📄 file set" : ""} {it.preview_url ? "· ▶ preview" : ""}
            </div>
          </div>
          <button onClick={async () => { if (confirm("Delete item?")) { await remove({ data: { id: it.id } }); q.refetch(); } }} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
      <div className="rounded-xl ring-1 ring-border p-3 space-y-2 bg-muted/30">
        <div className="grid md:grid-cols-4 gap-2">
          <Field label="Type">
            <select className={inputCls} value={draft.kind} onChange={e => setDraft({ ...draft, kind: e.target.value })}>
              <option value="lecture">Lecture</option>
              <option value="notes">Notes</option>
              <option value="test">Test</option>
              <option value="bundle">Bundle</option>
            </select>
          </Field>
          <Field label="Title"><input className={inputCls} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Price (₹)"><input type="number" className={inputCls} value={draft.price_rupees} onChange={e => setDraft({ ...draft, price_rupees: e.target.value })} /></Field>
          <Field label="Preview URL (free)"><input className={inputCls} value={draft.preview_url} onChange={e => setDraft({ ...draft, preview_url: e.target.value })} placeholder="YouTube/Vimeo" /></Field>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          <Field label="Premium content link (Classplus / external)"><input className={inputCls} value={draft.content_url} onChange={e => setDraft({ ...draft, content_url: e.target.value })} placeholder="https://classplus.co/..." /></Field>
          <Field label="File URL (PDF for notes/tests)"><input className={inputCls} value={draft.file_url} onChange={e => setDraft({ ...draft, file_url: e.target.value })} placeholder="https://…pdf" /></Field>
        </div>
        <Field label="Description"><textarea rows={2} className={inputCls} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></Field>
        <div className="flex justify-end">
          <button onClick={add} className="rounded-xl gradient-luxe text-white px-4 py-2 text-sm font-bold inline-flex items-center gap-1.5"><Plus className="h-4 w-4" /> Add content</button>
        </div>
      </div>
    </div>
  );
}
