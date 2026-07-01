import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type StoreItemKind = "lecture" | "notes" | "test" | "bundle";

export type StoreItem = {
  id: string;
  chapter_id: string;
  kind: StoreItemKind;
  title: string;
  description: string | null;
  price_paise: number;
  preview_url: string | null;
  bundle_item_ids: string[];
  order_index: number;
  is_published: boolean;
};

export type ChapterWithItems = {
  chapter: { id: string; slug: string; title: string; description: string | null; subject_id: string };
  subject: { id: string; slug: string; title: string; course_id: string };
  course: { id: string; slug: string; title: string; tag: string | null };
  items: (StoreItem & { has_access: boolean })[];
};

/* -------- Public browse (uses authed client for anon/authed users) -------- */

export const listStoreCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("courses")
      .select("id, slug, title, tag, duration, summary, cover_url, is_published")
      .eq("is_published", true)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listSubjectsByCourseSlug = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseSlug: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: course } = await context.supabase
      .from("courses")
      .select("id, slug, title, tag, duration, summary")
      .eq("slug", data.courseSlug)
      .maybeSingle();
    if (!course) return null;
    const { data: subjects, error } = await context.supabase
      .from("subjects")
      .select("id, slug, title, description, order_index, is_published")
      .eq("course_id", course.id)
      .eq("is_published", true)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return { course, subjects: subjects ?? [] };
  });

export const listChaptersBySubjectSlug = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ courseSlug: z.string(), subjectSlug: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: course } = await context.supabase.from("courses").select("id, slug, title, tag").eq("slug", data.courseSlug).maybeSingle();
    if (!course) return null;
    const { data: subject } = await context.supabase
      .from("subjects").select("id, slug, title, description, course_id")
      .eq("course_id", course.id).eq("slug", data.subjectSlug).maybeSingle();
    if (!subject) return null;
    const { data: chapters, error } = await context.supabase
      .from("chapters")
      .select("id, slug, title, description, order_index")
      .eq("subject_id", subject.id).eq("is_published", true)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    return { course, subject, chapters: chapters ?? [] };
  });

export const getChapterDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ courseSlug: z.string(), subjectSlug: z.string(), chapterSlug: z.string() }).parse(d),
  )
  .handler(async ({ context, data }): Promise<ChapterWithItems | null> => {
    const { data: course } = await context.supabase.from("courses").select("id, slug, title, tag").eq("slug", data.courseSlug).maybeSingle();
    if (!course) return null;
    const { data: subject } = await context.supabase
      .from("subjects").select("id, slug, title, course_id")
      .eq("course_id", course.id).eq("slug", data.subjectSlug).maybeSingle();
    if (!subject) return null;
    const { data: chapter } = await context.supabase
      .from("chapters").select("id, slug, title, description, subject_id")
      .eq("subject_id", subject.id).eq("slug", data.chapterSlug).maybeSingle();
    if (!chapter) return null;
    const { data: items, error } = await context.supabase
      .from("store_items")
      .select("id, chapter_id, kind, title, description, price_paise, preview_url, bundle_item_ids, order_index, is_published")
      .eq("chapter_id", chapter.id).eq("is_published", true)
      .order("order_index", { ascending: true });
    if (error) throw new Error(error.message);
    // Attach access flags
    const { data: paid } = await context.supabase
      .from("purchases")
      .select("item_id")
      .eq("user_id", context.userId)
      .eq("status", "paid");
    const paidIds = new Set((paid ?? []).map((p: any) => p.item_id));
    // Also expand bundle access
    const paidBundleItems = new Set<string>();
    for (const it of items ?? []) {
      if (it.kind === "bundle" && paidIds.has(it.id)) {
        (it.bundle_item_ids ?? []).forEach((id: string) => paidBundleItems.add(id));
      }
    }
    const withAccess = (items ?? []).map((i: any) => ({
      ...i,
      has_access: paidIds.has(i.id) || paidBundleItems.has(i.id),
    }));
    return { course, subject, chapter, items: withAccess as any };
  });

/* -------- Purchases -------- */

export const listMyPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("purchases")
      .select("id, item_id, amount_paise, status, payment_provider, payment_ref, purchased_at, created_at, store_items(id, kind, title, chapter_id, chapters(id, slug, title, subjects(id, slug, title, courses(id, slug, title))))")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Razorpay stub: creates an order (mock) and returns payment info.
export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ itemId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: item, error } = await context.supabase
      .from("store_items")
      .select("id, title, price_paise, is_published")
      .eq("id", data.itemId).maybeSingle();
    if (error || !item) throw new Error("Item not found");
    if (!item.is_published) throw new Error("Item not available");
    // Insert pending purchase
    const { data: p, error: pErr } = await context.supabase
      .from("purchases")
      .insert({
        user_id: context.userId,
        item_id: item.id,
        amount_paise: item.price_paise,
        status: "pending",
        payment_provider: "razorpay",
        payment_ref: `mock_${Date.now()}`,
      })
      .select().single();
    if (pErr) throw new Error(pErr.message);
    return {
      purchaseId: p.id,
      amountPaise: item.price_paise,
      // Razorpay stub — replace with real order key from Razorpay API in production
      razorpayOrderId: `order_stub_${p.id.slice(0, 8)}`,
      currency: "INR",
      itemTitle: item.title,
    };
  });

// Mark purchase paid. In production this must be a signature-verified webhook.
export const confirmPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      purchaseId: z.string().uuid(),
      razorpayPaymentId: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: existing } = await context.supabase
      .from("purchases").select("id, user_id, status")
      .eq("id", data.purchaseId).maybeSingle();
    if (!existing || existing.user_id !== context.userId) throw new Error("Purchase not found");
    if (existing.status === "paid") return { ok: true };
    const { error } = await context.supabase
      .from("purchases")
      .update({
        status: "paid",
        purchased_at: new Date().toISOString(),
        payment_ref: data.razorpayPaymentId ?? `pay_stub_${Date.now()}`,
      })
      .eq("id", data.purchaseId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Unlock content: returns premium content_url for a paid item.
export const unlockItemContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ itemId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .rpc("get_store_item_content", { _item_id: data.itemId });
    if (error) throw new Error(error.message);
    const r = (rows as any[])?.[0];
    if (!r) throw new Error("No content available");
    return {
      contentUrl: r.content_url as string | null,
      fileUrl: r.file_url as string | null,
      previewUrl: r.preview_url as string | null,
      kind: r.kind as StoreItemKind,
      title: r.title as string,
    };
  });
