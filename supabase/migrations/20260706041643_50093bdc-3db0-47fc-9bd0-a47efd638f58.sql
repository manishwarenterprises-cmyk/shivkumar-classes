
-- 1) admin_allowlist: add SELECT policy for admins
GRANT SELECT ON public.admin_allowlist TO authenticated;
CREATE POLICY "Admins view allowlist"
  ON public.admin_allowlist FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2) enrollments: only allow self-enroll in FREE published courses
DROP POLICY IF EXISTS "Users enroll themselves" ON public.enrollments;
CREATE POLICY "Users enroll in free courses"
  ON public.enrollments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id
        AND c.is_published = true
        AND COALESCE(c.price_inr, 0) = 0
    )
  );

-- 3) lectures: require authentication to read metadata (video_path no longer anon-visible)
DROP POLICY IF EXISTS "Lectures visible to enrolled or free" ON public.lectures;
CREATE POLICY "Lectures visible to enrolled or free"
  ON public.lectures FOR SELECT
  TO authenticated
  USING (
    is_free
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'teacher')
    OR public.is_enrolled(auth.uid(), course_id)
  );

-- 4) store_items: revoke column-level SELECT on premium URLs; keep unlock RPC as the only path
REVOKE SELECT (file_url, content_url) ON public.store_items FROM anon, authenticated;
-- service_role and function owners retain access via GRANT ALL / SECURITY DEFINER

-- 5) SECURITY DEFINER functions: tighten EXECUTE grants
-- has_role must remain SECURITY DEFINER (avoids RLS recursion on user_roles)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- is_enrolled and has_item_access can safely be SECURITY INVOKER (queried tables have owner RLS)
ALTER FUNCTION public.is_enrolled(uuid, uuid) SECURITY INVOKER;
ALTER FUNCTION public.has_item_access(uuid, uuid) SECURITY INVOKER;
REVOKE EXECUTE ON FUNCTION public.is_enrolled(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_item_access(uuid, uuid) FROM PUBLIC, anon;

-- Content unlock and admin listing: keep DEFINER, restrict to authenticated
REVOKE EXECUTE ON FUNCTION public.get_store_item_content(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_store_items(uuid) FROM PUBLIC, anon;

-- Trigger-only functions: not callable via API at all
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_if_allowlisted() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
