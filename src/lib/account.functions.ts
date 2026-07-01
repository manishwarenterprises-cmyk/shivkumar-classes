import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type AccountSummary = {
  userId: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  roles: Array<"admin" | "teacher" | "student">;
};

export const getAccountSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccountSummary> => {
    const { supabase, userId, claims } = context;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    return {
      userId,
      email: (claims as { email?: string }).email ?? null,
      fullName: profile?.full_name ?? null,
      phone: profile?.phone ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      roles: (roles ?? []).map((r: any) => r.role) as AccountSummary["roles"],
    };
  });

export type FullProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  address: string | null;
  school_college: string | null;
  class_level: string | null;
  board: string | null;
};

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<FullProfile> => {
    const { data } = await context.supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url, date_of_birth, parent_name, parent_phone, address, school_college, class_level, board")
      .eq("id", context.userId).maybeSingle();
    return (data as FullProfile) ?? {
      id: context.userId, full_name: null, phone: null, avatar_url: null,
      date_of_birth: null, parent_name: null, parent_phone: null,
      address: null, school_college: null, class_level: null, board: null,
    };
  });

const profileInput = z.object({
  full_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(), // YYYY-MM-DD
  parent_name: z.string().optional().nullable(),
  parent_phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  school_college: z.string().optional().nullable(),
  class_level: z.string().optional().nullable(),
  board: z.string().optional().nullable(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => profileInput.parse(d))
  .handler(async ({ context, data }) => {
    const payload = {
      id: context.userId,
      full_name: data.full_name || null,
      phone: data.phone || null,
      avatar_url: data.avatar_url || null,
      date_of_birth: data.date_of_birth || null,
      parent_name: data.parent_name || null,
      parent_phone: data.parent_phone || null,
      address: data.address || null,
      school_college: data.school_college || null,
      class_level: data.class_level || null,
      board: data.board || null,
    };
    const { error } = await context.supabase
      .from("profiles").upsert(payload, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
