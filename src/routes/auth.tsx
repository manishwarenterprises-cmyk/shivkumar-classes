import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Section } from "@/components/primitives";
import { Toaster } from "@/components/ui/sonner";
import ehLogo from "@/assets/eh-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/dashboard",
  }),
  head: () => ({
    meta: [
      { title: "Sign In · Shiv Sir's Education Hub" },
      { name: "description", content: "Sign in to access your student dashboard, courses, live classes and study material." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().email("Enter a valid email").max(255);
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .max(72, "Too long");
const nameSchema = z.string().trim().min(2, "Enter your full name").max(100);

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in → bounce
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: search.redirect || "/dashboard", replace: true });
    });
  }, [navigate, search.redirect]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (mode === "signup") nameSchema.parse(name);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0]?.message ?? "Invalid input");
        return;
      }
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Welcome! Account created.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      navigate({ to: search.redirect || "/dashboard", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        setBusy(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: search.redirect || "/dashboard", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg);
      setBusy(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="min-h-[80vh] grid place-items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass shadow-luxe rounded-3xl p-8 md:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-black ring-2 ring-luxury grid place-items-center overflow-hidden shadow-[0_0_30px_rgba(198,169,105,0.5)]">
                <img src={ehLogo.url} alt="Education Hub" className="h-[115%] w-[115%] object-cover" />
              </div>
              <h1 className="mt-5 font-display text-3xl font-bold uppercase tracking-wide gold-text">
                {mode === "signin" ? "Welcome Back" : "Join the Hub"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to access your courses, classes & notes."
                  : "Create your student account in 30 seconds."}
              </p>
            </div>

            <button
              onClick={handleGoogle}
              disabled={busy}
              className="mt-7 w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-white ring-1 ring-border px-4 py-3 text-sm font-medium hover:bg-muted/50 transition disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-4z"/>
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              OR
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleEmail} className="space-y-3">
              {mode === "signup" && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full rounded-2xl bg-white ring-1 ring-border pl-10 pr-4 py-3 text-sm outline-none focus:ring-luxury transition"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  className="w-full rounded-2xl bg-white ring-1 ring-border pl-10 pr-4 py-3 text-sm outline-none focus:ring-luxury transition"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={72}
                  className="w-full rounded-2xl bg-white ring-1 ring-border pl-10 pr-4 py-3 text-sm outline-none focus:ring-luxury transition"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl gradient-luxe text-white px-4 py-3 text-sm font-semibold shadow-luxe hover:opacity-95 transition disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={async () => {
                    try { emailSchema.parse(email); } catch { return toast.error("Enter your email above first"); }
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/profile`,
                    });
                    if (error) toast.error(error.message);
                    else toast.success("Password reset link sent to your email");
                  }}
                  className="w-full text-center text-xs text-muted-foreground hover:text-luxury transition"
                >
                  Forgot password?
                </button>
              )}
            </form>


            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "New student?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-semibold text-foreground hover:text-luxury transition"
              >
                {mode === "signin" ? "Create account" : "Sign in"}
              </button>
            </div>

            <div className="mt-3 text-center">
              <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
                ← Back to home
              </Link>
            </div>
          </div>
        </motion.div>
      </Section>
    </>
  );
}
