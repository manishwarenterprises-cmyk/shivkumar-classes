
-- Admin email allowlist: only these emails can hold the admin role.
CREATE TABLE public.admin_allowlist (
  email TEXT PRIMARY KEY,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_allowlist TO service_role;
-- No grants to anon/authenticated: only the security-definer trigger reads this.

ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;
-- No policies: table is intentionally invisible to the API.

INSERT INTO public.admin_allowlist (email, note) VALUES
  ('shivd2012@gmail.com', 'Shiv Sir'),
  ('manishwarenterprises@gmail.com', 'Assistant Admin');

-- Grant admin role automatically only for users whose email is (a) in the
-- allowlist AND (b) verified via email_confirmed_at. Runs on insert (in case
-- of auto-confirm) and on the update that flips email_confirmed_at.
CREATE OR REPLACE FUNCTION public.grant_admin_if_allowlisted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND EXISTS (
       SELECT 1 FROM public.admin_allowlist
       WHERE lower(email) = lower(NEW.email)
     )
  THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_if_allowlisted();

DROP TRIGGER IF EXISTS on_auth_user_confirmed_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_if_allowlisted();

-- Backfill: if either allowlisted user already exists and is confirmed, grant now.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
JOIN public.admin_allowlist a ON lower(a.email) = lower(u.email)
WHERE u.email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Helper server-side check used by the /auth Admin tab to reject non-allowlisted
-- signups BEFORE hitting supabase.auth.signUp (so we don't create orphan accounts).
CREATE OR REPLACE FUNCTION public.is_admin_email(_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE lower(email) = lower(_email)
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin_email(TEXT) TO anon, authenticated;
