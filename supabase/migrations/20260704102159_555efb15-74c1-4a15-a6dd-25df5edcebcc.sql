
REVOKE EXECUTE ON FUNCTION public.is_admin_email(TEXT) FROM anon, authenticated, PUBLIC;
DROP FUNCTION IF EXISTS public.is_admin_email(TEXT);
