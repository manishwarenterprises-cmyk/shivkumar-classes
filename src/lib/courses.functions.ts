import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type CourseRow = {
  id: string;
  slug: string;
  title: string;
  tag: string | null;
  duration: string | null;
  summary: string | null;
  description: string | null;
  cover_url: string | null;
  price_inr: number;
  is_published: boolean;
};

export type LectureRow = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_path: string | null;
  duration_seconds: number;
  order_index: number;
  is_free: boolean;
};

export type ProgressRow = {
  lecture_id: string;
  watched_seconds: number;
  completed: boolean;
};

// === Public: list published courses (auth client; RLS lets anon read published rows) ===
export const listPublishedCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CourseRow[]> => {
    const { data, error } = await context.supabase
      .from("courses")
      .select("id, slug, title, tag, duration, summary, description, cover_url, price_inr, is_published")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// === My enrollments ===
export const listMyEnrollments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("enrollments")
      .select("course_id, enrolled_at, courses(id, slug, title, tag, duration, cover_url, summary)")
      .eq("user_id", context.userId)
      .order("enrolled_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((e) => ({
      enrolledAt: e.enrolled_at,
      course: e.courses as unknown as CourseRow,
    }));
  });

// === Enroll — free courses only; paid courses require a verified purchase ===
export const enrollInCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    // Server-side price check — never trust the client
    const { data: course, error: courseErr } = await context.supabase
      .from("courses")
      .select("id, price_inr, is_published")
      .eq("id", data.courseId)
      .maybeSingle();
    if (courseErr) throw new Error(courseErr.message);
    if (!course || !course.is_published) throw new Error("Course not available");

    if ((course.price_inr ?? 0) > 0) {
      // Paid course: require a completed purchase via the store/Razorpay flow.
      // Direct enrollment is blocked; enrollment is granted by the payment
      // verification handler after a successful gateway callback.
      throw new Error(
        "This is a paid course. Please complete payment from the Store to enroll."
      );
    }

    const { error } = await context.supabase
      .from("enrollments")
      .insert({ user_id: context.userId, course_id: data.courseId });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });


// === Course + lectures + progress (auth) ===
export const getCourseDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: course, error: cErr } = await context.supabase
      .from("courses")
      .select("id, slug, title, tag, duration, summary, description, cover_url, price_inr, is_published")
      .eq("slug", data.slug)
      .maybeSingle();
    if (cErr) throw new Error(cErr.message);
    if (!course) return null;

    const { data: enr } = await context.supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", context.userId)
      .eq("course_id", course.id)
      .maybeSingle();
    const enrolled = !!enr;

    const { data: lectures } = await context.supabase
      .from("lectures")
      .select("id, course_id, title, description, video_path, duration_seconds, order_index, is_free")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true });

    const { data: progress } = await context.supabase
      .from("lecture_progress")
      .select("lecture_id, watched_seconds, completed")
      .eq("user_id", context.userId)
      .eq("course_id", course.id);

    return {
      course: course as CourseRow,
      enrolled,
      lectures: (lectures ?? []) as LectureRow[],
      progress: (progress ?? []) as ProgressRow[],
    };
  });

// === Signed URL for video playback ===
export const getLectureVideoUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ lectureId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: lec, error } = await context.supabase
      .from("lectures")
      .select("video_path, course_id, is_free")
      .eq("id", data.lectureId)
      .maybeSingle();
    if (error || !lec || !lec.video_path) throw new Error("Lecture not found");
    const { data: signed, error: sErr } = await context.supabase
      .storage.from("course-videos")
      .createSignedUrl(lec.video_path, 60 * 60);
    if (sErr) throw new Error(sErr.message);
    return { url: signed.signedUrl };
  });

// === Save progress ===
export const saveProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      lectureId: z.string().uuid(),
      courseId: z.string().uuid(),
      watchedSeconds: z.number().int().min(0),
      completed: z.boolean().optional(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("lecture_progress")
      .upsert({
        user_id: context.userId,
        lecture_id: data.lectureId,
        course_id: data.courseId,
        watched_seconds: data.watchedSeconds,
        completed: data.completed ?? false,
        last_watched_at: new Date().toISOString(),
      }, { onConflict: "user_id,lecture_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
