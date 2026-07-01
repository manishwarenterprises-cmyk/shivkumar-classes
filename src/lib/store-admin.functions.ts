import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertStaff(context: { supabase: any; userId: string }) {
  const [{ data: a }, { data: t }] = await Promise.all([
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "teacher" }),
  ]);
  if (!a && !t) throw new Error("Forbidden");
}

/* ---------- Subjects ---------- */
export const adminListSubjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { data: rows, error } = await context.supabase
      .from("subjects")
      .select("id, course_id, slug, title, description, order_index, is_published")
      .eq("course_id", data.courseId)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const subjectInput = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  order_index: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export const upsertSubject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => subjectInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const payload = {
      course_id: data.course_id, slug: data.slug, title: data.title,
      description: data.description || null, order_index: data.order_index, is_published: data.is_published,
    };
    const q = data.id
      ? context.supabase.from("subjects").update(payload).eq("id", data.id).select().single()
      : context.supabase.from("subjects").insert(payload).select().single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteSubject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("subjects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Chapters ---------- */
export const adminListChapters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ subjectId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { data: rows, error } = await context.supabase
      .from("chapters")
      .select("id, subject_id, slug, title, description, order_index, is_published")
      .eq("subject_id", data.subjectId)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const chapterInput = z.object({
  id: z.string().uuid().optional(),
  subject_id: z.string().uuid(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  order_index: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export const upsertChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => chapterInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const payload = {
      subject_id: data.subject_id, slug: data.slug, title: data.title,
      description: data.description || null, order_index: data.order_index, is_published: data.is_published,
    };
    const q = data.id
      ? context.supabase.from("chapters").update(payload).eq("id", data.id).select().single()
      : context.supabase.from("chapters").insert(payload).select().single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteChapter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("chapters").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Store items ---------- */
export const adminListItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ chapterId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { data: rows, error } = await context.supabase
      .rpc("admin_list_store_items", { _chapter_id: data.chapterId });
    if (error) throw new Error(error.message);
    return (rows ?? []) as any[];
  });

const itemInput = z.object({
  id: z.string().uuid().optional(),
  chapter_id: z.string().uuid(),
  kind: z.enum(["lecture", "notes", "test", "bundle"]),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  price_paise: z.number().int().min(0).default(0),
  preview_url: z.string().optional().nullable(),
  content_url: z.string().optional().nullable(),
  file_url: z.string().optional().nullable(),
  bundle_item_ids: z.array(z.string().uuid()).default([]),
  order_index: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export const upsertItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => itemInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const payload = {
      chapter_id: data.chapter_id, kind: data.kind, title: data.title,
      description: data.description || null, price_paise: data.price_paise,
      preview_url: data.preview_url || null, content_url: data.content_url || null,
      file_url: data.file_url || null, bundle_item_ids: data.bundle_item_ids,
      order_index: data.order_index, is_published: data.is_published,
    };
    const q = data.id
      ? context.supabase.from("store_items").update(payload).eq("id", data.id).select("id").single()
      : context.supabase.from("store_items").insert(payload).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("store_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------- Announcements ---------- */
export const listAnnouncements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ audience: z.enum(["all", "home", "students"]).optional() }).parse(d))
  .handler(async ({ context, data }) => {
    let q = context.supabase.from("announcements")
      .select("id, title, body, audience, is_published, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (data.audience) q = q.or(`audience.eq.${data.audience},audience.eq.all`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminListAnnouncements = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("announcements").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const annInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  body: z.string().min(1),
  audience: z.enum(["all", "home", "students"]).default("all"),
  is_published: z.boolean().default(true),
});

export const upsertAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => annInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const payload = { title: data.title, body: data.body, audience: data.audience, is_published: data.is_published };
    const q = data.id
      ? context.supabase.from("announcements").update(payload).eq("id", data.id).select().single()
      : context.supabase.from("announcements").insert(payload).select().single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("announcements").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
