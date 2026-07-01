
-- Store hierarchy: courses -> subjects -> chapters -> store_items
-- (courses table already exists)

CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_id, slug)
);
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published subjects are viewable by everyone" ON public.subjects
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins and teachers manage subjects" ON public.subjects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE TRIGGER trg_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subject_id, slug)
);
GRANT SELECT ON public.chapters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapters TO authenticated;
GRANT ALL ON public.chapters TO service_role;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published chapters are viewable by everyone" ON public.chapters
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins and teachers manage chapters" ON public.chapters
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE TRIGGER trg_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TYPE public.store_item_kind AS ENUM ('lecture','notes','test','bundle');

CREATE TABLE public.store_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  kind public.store_item_kind NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_paise INT NOT NULL DEFAULT 0,
  preview_url TEXT,           -- free preview video (lecture)
  content_url TEXT,           -- Classplus/YouTube/external premium link
  file_url TEXT,              -- notes/tests PDF url
  bundle_item_ids UUID[] NOT NULL DEFAULT '{}',
  order_index INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.store_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_items TO authenticated;
GRANT ALL ON public.store_items TO service_role;
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
-- Public sees rows but NEVER content_url/file_url via a view (see below)
CREATE POLICY "Published items are viewable by everyone" ON public.store_items
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins and teachers manage store items" ON public.store_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));
CREATE TRIGGER trg_store_items_updated_at BEFORE UPDATE ON public.store_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Purchases
CREATE TYPE public.purchase_status AS ENUM ('pending','paid','failed','refunded');

CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.store_items(id) ON DELETE CASCADE,
  amount_paise INT NOT NULL,
  status public.purchase_status NOT NULL DEFAULT 'pending',
  payment_provider TEXT NOT NULL DEFAULT 'mock',
  payment_ref TEXT,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX purchases_paid_unique ON public.purchases (user_id, item_id) WHERE status = 'paid';
GRANT SELECT, INSERT, UPDATE ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own purchases" ON public.purchases
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own purchases" ON public.purchases
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update purchases" ON public.purchases
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_purchases_updated_at BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Access check: direct purchase OR bundle-containing purchase
CREATE OR REPLACE FUNCTION public.has_item_access(_user_id UUID, _item_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.purchases p
    WHERE p.user_id = _user_id AND p.status = 'paid' AND p.item_id = _item_id
  ) OR EXISTS (
    SELECT 1 FROM public.purchases p
    JOIN public.store_items si ON si.id = p.item_id
    WHERE p.user_id = _user_id AND p.status = 'paid'
      AND si.kind = 'bundle'
      AND _item_id = ANY(si.bundle_item_ids)
  );
$$;

CREATE INDEX subjects_course_idx ON public.subjects(course_id, order_index);
CREATE INDEX chapters_subject_idx ON public.chapters(subject_id, order_index);
CREATE INDEX store_items_chapter_idx ON public.store_items(chapter_id, order_index);
CREATE INDEX purchases_user_idx ON public.purchases(user_id, status);
