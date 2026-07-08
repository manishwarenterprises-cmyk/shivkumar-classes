
-- 1) store_items: tighten SELECT so anon cannot read sensitive columns
DROP POLICY IF EXISTS "Published items are viewable by everyone" ON public.store_items;

CREATE POLICY "Published items are viewable by authenticated"
  ON public.store_items
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'teacher'::public.app_role)
  );

-- Ensure only safe columns are readable by authenticated (exclude file_url / content_url).
REVOKE ALL ON public.store_items FROM anon, authenticated, PUBLIC;
GRANT SELECT (
  id, chapter_id, kind, title, description, price_paise,
  preview_url, bundle_item_ids, order_index, is_published,
  created_at, updated_at
) ON public.store_items TO authenticated;
GRANT ALL ON public.store_items TO service_role;

-- 2) profiles: allow admins & teachers to read all rows
DROP POLICY IF EXISTS "Admins and teachers view all profiles" ON public.profiles;
CREATE POLICY "Admins and teachers view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'teacher'::public.app_role)
  );

-- 3) enrollments: allow admins to insert any enrollment row
DROP POLICY IF EXISTS "Admins can create enrollments" ON public.enrollments;
CREATE POLICY "Admins can create enrollments"
  ON public.enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) SECURITY DEFINER functions: revoke EXECUTE from authenticated,
--    add explicit _user_id parameter so trusted server code can invoke via service_role.
DROP FUNCTION IF EXISTS public.get_store_item_content(uuid);
CREATE OR REPLACE FUNCTION public.get_store_item_content(_user_id uuid, _item_id uuid)
RETURNS TABLE(content_url text, file_url text, preview_url text, kind public.store_item_kind, title text)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_staff BOOLEAN;
  has_access BOOLEAN;
BEGIN
  is_staff := public.has_role(_user_id, 'admin'::public.app_role)
              OR public.has_role(_user_id, 'teacher'::public.app_role);
  has_access := public.has_item_access(_user_id, _item_id);
  IF NOT (is_staff OR has_access) THEN
    RAISE EXCEPTION 'Not authorized to access this item';
  END IF;
  RETURN QUERY
    SELECT si.content_url, si.file_url, si.preview_url, si.kind, si.title
    FROM public.store_items si
    WHERE si.id = _item_id;
END;
$function$;
REVOKE ALL ON FUNCTION public.get_store_item_content(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_store_item_content(uuid, uuid) TO service_role;

DROP FUNCTION IF EXISTS public.admin_list_store_items(uuid);
CREATE OR REPLACE FUNCTION public.admin_list_store_items(_user_id uuid, _chapter_id uuid)
RETURNS SETOF public.store_items
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (public.has_role(_user_id, 'admin'::public.app_role)
          OR public.has_role(_user_id, 'teacher'::public.app_role)) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY SELECT * FROM public.store_items
    WHERE chapter_id = _chapter_id
    ORDER BY order_index ASC;
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_list_store_items(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_store_items(uuid, uuid) TO service_role;
