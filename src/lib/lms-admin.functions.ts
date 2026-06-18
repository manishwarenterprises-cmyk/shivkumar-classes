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

export const adminListCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("courses")
      .select("id, slug, title, tag, duration, summary, cover_url, price_inr, is_published, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const courseInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  tag: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cover_url: z.string().url().optional().nullable().or(z.literal("")),
  price_inr: z.number().int().min(0).default(0),
  is_published: z.boolean().default(false),
});

export const upsertCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => courseInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const payload = {
      slug: data.slug,
      title: data.title,
      tag: data.tag || null,
      duration: data.duration || null,
      summary: data.summary || null,
      description: data.description || null,
      cover_url: data.cover_url || null,
      price_inr: data.price_inr,
      is_published: data.is_published,
      created_by: context.userId,
    };
    const q = data.id
      ? context.supabase.from("courses").update(payload).eq("id", data.id).select().single()
      : context.supabase.from("courses").insert(payload).select().single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("courses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListLectures = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { data: rows, error } = await context.supabase
      .from("lectures")
      .select("id, course_id, title, description, video_path, duration_seconds, order_index, is_free")
      .eq("course_id", data.courseId)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const lectureInput = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  video_path: z.string().optional().nullable(),
  duration_seconds: z.number().int().min(0).default(0),
  order_index: z.number().int().min(0).default(0),
  is_free: z.boolean().default(false),
});

export const upsertLecture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => lectureInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const payload = {
      course_id: data.course_id,
      title: data.title,
      description: data.description || null,
      video_path: data.video_path || null,
      duration_seconds: data.duration_seconds,
      order_index: data.order_index,
      is_free: data.is_free,
    };
    const q = data.id
      ? context.supabase.from("lectures").update(payload).eq("id", data.id).select().single()
      : context.supabase.from("lectures").insert(payload).select().single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteLecture = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("lectures").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
