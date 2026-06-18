import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Plus, Trash2, ArrowLeft, Video, Upload, ShieldAlert } from "lucide-react";
import { Section } from "@/components/primitives";
import { getAccountSummary } from "@/lib/account.functions";
import {
  adminListCourses,
  upsertCourse,
  deleteCourse,
  adminListLectures,
  upsertLecture,
  deleteLecture,
} from "@/lib/lms-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  head: () => ({ meta: [{ title: "Admin · Courses" }] }),
  component: AdminCoursesPage,
});

type CourseForm = {
  id?: string;
  slug: string;
  title: string;
  tag: string;
  duration: string;
  summary: string;
  description: string;
  cover_url: string;
  price_inr: number;
  is_published: boolean;
};

const emptyCourse: CourseForm = {
  slug: "", title: "", tag: "", duration: "", summary: "", description: "",
  cover_url: "", price_inr: 0, is_published: false,
};

function AdminCoursesPage() {
  const fetchAcct = useServerFn(getAccountSummary);
  const acct = useQuery({ queryKey: ["account-summary"], queryFn: () => fetchAcct({}) });
  const isStaff = acct.data?.roles.includes("admin") || acct.data?.roles.includes("teacher");

  const fetchCourses = useServerFn(adminListCourses);
  const courses = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => fetchCourses({}),
    enabled: !!isStaff,
  });

  const upsert = useServerFn(upsertCourse);
  const remove = useServerFn(deleteCourse);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyCourse);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setForm({
      id: c.id, slug: c.slug, title: c.title, tag: c.tag ?? "", duration: c.duration ?? "",
      summary: c.summary ?? "", description: c.description ?? "", cover_url: c.cover_url ?? "",
      price_inr: c.price_inr ?? 0, is_published: !!c.is_published,
    });
    setShowForm(true);
  };
  const startNew = () => { setEditingId(null); setForm(emptyCourse); setShowForm(true); };

  const submit = async () => {
    try {
      await upsert({ data: form });
      toast.success(editingId ? "Course updated" : "Course created");
      setShowForm(false);
      courses.refetch();
    } catch (e) { toast.error((e as Error).message); }
  };

  const doDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    try { await remove({ data: { id } }); toast.success("Deleted"); courses.refetch(); }
    catch (e) { toast.error((e as Error).message); }
  };

  if (acct.isLoading) return <Section className="min-h-[60vh] grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></Section>;
  if (!isStaff) {
    return <Section className="min-h-[60vh] grid place-items-center text-center"><div>
      <ShieldAlert className="h-12 w-12 text-luxury mx-auto" />
      <h1 className="mt-5 font-display text-3xl font-bold">Staff access only</h1>
      <Link to="/dashboard" className="mt-6 inline-flex rounded-2xl gradient-luxe text-white px-5 py-2.5 text-sm font-medium">Back</Link>
    </div></Section>;
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Admin
        </Link>
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Admin · Courses</div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Manage courses</h1>
          </div>
          <button onClick={startNew} className="inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-5 py-2.5 text-sm font-bold shadow-luxe">
            <Plus className="h-4 w-4" /> New course
          </button>
        </div>
      </Section>

      {showForm && (
        <Section className="!pt-0">
          <div className="rounded-3xl bg-white ring-1 ring-border p-6 space-y-4">
            <h2 className="font-display text-2xl">{editingId ? "Edit course" : "New course"}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Slug (url-friendly)"><input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="11th-commerce-pro" /></Field>
              <Field label="Title"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Tag"><input className={inputCls} value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Foundation" /></Field>
              <Field label="Duration"><input className={inputCls} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="1 Year" /></Field>
              <Field label="Cover image URL"><input className={inputCls} value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..." /></Field>
              <Field label="Price (INR, 0 = free)"><input type="number" className={inputCls} value={form.price_inr} onChange={(e) => setForm({ ...form, price_inr: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Summary"><textarea className={inputCls} rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
            <Field label="Description"><textarea className={inputCls} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Published (visible to students)
            </label>
            <div className="flex gap-3">
              <button onClick={submit} className="rounded-xl gradient-luxe text-white px-5 py-2.5 text-sm font-bold">Save</button>
              <button onClick={() => setShowForm(false)} className="rounded-xl bg-muted px-5 py-2.5 text-sm">Cancel</button>
            </div>
          </div>
        </Section>
      )}

      <Section className="!pt-0">
        {courses.isLoading ? <Loader2 className="h-8 w-8 animate-spin text-luxury" /> :
         (courses.data ?? []).length === 0 ? <p className="text-muted-foreground">No courses yet.</p> :
         <div className="space-y-3">
          {courses.data!.map((c: any) => (
            <div key={c.id} className="rounded-3xl bg-white ring-1 ring-border overflow-hidden">
              <div className="p-5 flex items-center justify-between flex-wrap gap-3">
                <div className="min-w-0">
                  <div className="text-xs gold-text font-bold uppercase tracking-wider">{c.tag} · /{c.slug}</div>
                  <h3 className="mt-1 font-display text-xl">{c.title}</h3>
                  <div className="text-xs text-muted-foreground mt-1">{c.is_published ? "✓ Published" : "Draft"} · {c.price_inr > 0 ? `₹${c.price_inr}` : "Free"}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="rounded-xl bg-muted px-4 py-2 text-sm inline-flex items-center gap-1.5">
                    <Video className="h-4 w-4" /> Lectures
                  </button>
                  <button onClick={() => startEdit(c)} className="rounded-xl bg-foreground text-background px-4 py-2 text-sm">Edit</button>
                  <button onClick={() => doDelete(c.id)} className="rounded-xl bg-destructive/10 text-destructive px-3 py-2 text-sm"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {expanded === c.id && <LecturesPanel courseId={c.id} />}
            </div>
          ))}
         </div>}
      </Section>
    </>
  );
}

const inputCls = "w-full rounded-xl border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-luxury/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>{children}</div>;
}

function LecturesPanel({ courseId }: { courseId: string }) {
  const fetchL = useServerFn(adminListLectures);
  const upsert = useServerFn(upsertLecture);
  const remove = useServerFn(deleteLecture);
  const lectures = useQuery({ queryKey: ["admin-lectures", courseId], queryFn: () => fetchL({ data: { courseId } }) });
  const [uploading, setUploading] = useState<string | null>(null);

  const [draft, setDraft] = useState({ title: "", description: "", is_free: false, duration_seconds: 0 });

  const addLecture = async () => {
    if (!draft.title.trim()) return;
    try {
      await upsert({ data: { course_id: courseId, title: draft.title, description: draft.description, is_free: draft.is_free, duration_seconds: draft.duration_seconds, order_index: (lectures.data?.length ?? 0) } });
      setDraft({ title: "", description: "", is_free: false, duration_seconds: 0 });
      lectures.refetch();
    } catch (e) { toast.error((e as Error).message); }
  };

  const uploadVideo = async (lec: any, file: File) => {
    setUploading(lec.id);
    try {
      const path = `${courseId}/${lec.id}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const { error } = await supabase.storage.from("course-videos").upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      await upsert({ data: { id: lec.id, course_id: courseId, title: lec.title, description: lec.description, is_free: lec.is_free, duration_seconds: lec.duration_seconds, order_index: lec.order_index, video_path: path } });
      toast.success("Video uploaded");
      lectures.refetch();
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(null); }
  };

  const doDelete = async (id: string) => {
    if (!confirm("Delete lecture?")) return;
    await remove({ data: { id } });
    lectures.refetch();
  };

  return (
    <div className="border-t border-border bg-muted/30 p-5 space-y-3">
      {lectures.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> :
       (lectures.data ?? []).map((l: any, i: number) => (
        <div key={l.id} className="rounded-2xl bg-white ring-1 ring-border p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{i + 1}. {l.title} {l.is_free && <span className="text-[10px] gold-text">FREE</span>}</div>
            <div className="text-xs text-muted-foreground">{l.video_path ? "✓ Video uploaded" : "No video yet"}</div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="rounded-xl bg-foreground text-background px-3 py-1.5 text-xs cursor-pointer inline-flex items-center gap-1.5">
              {uploading === l.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {l.video_path ? "Replace" : "Upload video"}
              <input type="file" accept="video/*" hidden onChange={(e) => e.target.files?.[0] && uploadVideo(l, e.target.files[0])} />
            </label>
            <button onClick={() => doDelete(l.id)} className="text-destructive p-1.5"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
      <div className="rounded-2xl bg-white ring-1 ring-border p-4 space-y-2">
        <input className={inputCls} placeholder="New lecture title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <textarea className={inputCls} rows={2} placeholder="Description (optional)" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_free} onChange={(e) => setDraft({ ...draft, is_free: e.target.checked })} />
            Free preview
          </label>
          <button onClick={addLecture} className="rounded-xl gradient-luxe text-white px-4 py-2 text-sm font-medium inline-flex items-center gap-1.5">
            <Plus className="h-4 w-4" /> Add lecture
          </button>
        </div>
      </div>
    </div>
  );
}
