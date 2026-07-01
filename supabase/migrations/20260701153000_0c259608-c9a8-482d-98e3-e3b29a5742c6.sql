CREATE OR REPLACE FUNCTION public.admin_list_store_items(_chapter_id UUID)
RETURNS SETOF public.store_items
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher')) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  RETURN QUERY SELECT * FROM public.store_items WHERE chapter_id = _chapter_id ORDER BY order_index ASC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.admin_list_store_items(UUID) TO authenticated;