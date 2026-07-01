-- Harden store_items: hide premium content URLs from public/non-owner reads.
REVOKE SELECT (content_url, file_url) ON public.store_items FROM anon;
REVOKE SELECT (content_url, file_url) ON public.store_items FROM authenticated;
-- Column-level select for admins/teachers via a security-definer accessor.

CREATE OR REPLACE FUNCTION public.get_store_item_content(_item_id UUID)
RETURNS TABLE (content_url TEXT, file_url TEXT, preview_url TEXT, kind public.store_item_kind, title TEXT)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_staff BOOLEAN;
  has_access BOOLEAN;
BEGIN
  is_staff := public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher');
  has_access := public.has_item_access(auth.uid(), _item_id);
  IF NOT (is_staff OR has_access) THEN
    RAISE EXCEPTION 'Not authorized to access this item';
  END IF;
  RETURN QUERY
    SELECT si.content_url, si.file_url, si.preview_url, si.kind, si.title
    FROM public.store_items si
    WHERE si.id = _item_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_store_item_content(UUID) TO authenticated;

-- Announcements (site-wide + student dashboard)
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all', -- 'all' | 'students' | 'home'
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published announcements are viewable by everyone" ON public.announcements
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins and teachers manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE TRIGGER trg_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();