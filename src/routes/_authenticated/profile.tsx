import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Save, KeyRound } from "lucide-react";
import { Section } from "@/components/primitives";
import { getMyProfile, updateMyProfile } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile · Shiv Sir's Education Hub" }] }),
  component: ProfilePage,
});

const inputCls = "w-full rounded-xl border border-input bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-luxury/50";

function ProfilePage() {
  const fetch = useServerFn(getMyProfile);
  const save = useServerFn(updateMyProfile);
  const q = useQuery({ queryKey: ["my-profile"], queryFn: () => fetch({}) });

  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (q.data) setForm(q.data); }, [q.data]);

  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdBusy, setPwdBusy] = useState(false);

  const doSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await save({ data: {
        full_name: form.full_name, phone: form.phone, avatar_url: form.avatar_url,
        date_of_birth: form.date_of_birth, parent_name: form.parent_name,
        parent_phone: form.parent_phone, address: form.address,
        school_college: form.school_college, class_level: form.class_level, board: form.board,
      }});
      toast.success("Profile saved");
    } catch (e) { toast.error((e as Error).message); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (pwd.length < 6) return toast.error("Password must be at least 6 characters");
    setPwdBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      setPwd("");
      toast.success("Password updated");
    } catch (e) { toast.error((e as Error).message); }
    finally { setPwdBusy(false); }
  };

  if (q.isLoading || !form) return <Section className="min-h-[60vh] grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-luxury" /></Section>;

  return (
    <>
      <Toaster richColors position="top-center" />
      <Section className="pt-10">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className="text-xs uppercase tracking-[0.3em] gold-text font-bold">Student Profile</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight">Your <span className="gold-text">account</span></h1>
        </motion.div>
      </Section>

      <Section className="!pt-0 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-3xl bg-white ring-1 ring-border p-6 space-y-4 shadow-soft">
          <h2 className="font-display text-xl">Personal details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full name"><input className={inputCls} value={form.full_name ?? ""} onChange={e => setForm({ ...form, full_name: e.target.value })} /></Field>
            <Field label="Mobile number"><input className={inputCls} value={form.phone ?? ""} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91…" /></Field>
            <Field label="Date of birth"><input type="date" className={inputCls} value={form.date_of_birth ?? ""} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></Field>
            <Field label="Profile photo URL"><input className={inputCls} value={form.avatar_url ?? ""} onChange={e => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://…" /></Field>
            <Field label="Parent's name"><input className={inputCls} value={form.parent_name ?? ""} onChange={e => setForm({ ...form, parent_name: e.target.value })} /></Field>
            <Field label="Parent's mobile"><input className={inputCls} value={form.parent_phone ?? ""} onChange={e => setForm({ ...form, parent_phone: e.target.value })} /></Field>
            <Field label="School / College"><input className={inputCls} value={form.school_college ?? ""} onChange={e => setForm({ ...form, school_college: e.target.value })} /></Field>
            <Field label="Class"><input className={inputCls} value={form.class_level ?? ""} onChange={e => setForm({ ...form, class_level: e.target.value })} placeholder="11th / 12th / B.Com…" /></Field>
            <Field label="Board"><input className={inputCls} value={form.board ?? ""} onChange={e => setForm({ ...form, board: e.target.value })} placeholder="Maharashtra / CBSE…" /></Field>
          </div>
          <Field label="Address"><textarea rows={2} className={inputCls} value={form.address ?? ""} onChange={e => setForm({ ...form, address: e.target.value })} /></Field>
          <div className="pt-2">
            <button onClick={doSave} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-5 py-2.5 text-sm font-bold shadow-luxe disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save profile
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white ring-1 ring-border p-6 shadow-soft">
            <h2 className="font-display text-xl flex items-center gap-2"><KeyRound className="h-5 w-5 text-luxury" /> Change password</h2>
            <p className="mt-1 text-xs text-muted-foreground">Choose a new password (min 6 characters).</p>
            <input type="password" className={inputCls + " mt-4"} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="New password" />
            <button onClick={changePassword} disabled={pwdBusy} className="mt-3 w-full rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-bold">
              {pwdBusy ? "Updating…" : "Update password"}
            </button>
          </div>
          <Link to="/my-purchases" className="block rounded-3xl gradient-luxe text-white p-6 shadow-luxe hover:opacity-95 transition">
            <div className="text-xs uppercase tracking-[0.3em] text-luxury font-bold">Purchases</div>
            <div className="mt-2 font-display text-2xl">View my learning →</div>
          </Link>
        </div>
      </Section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>{children}</div>;
}
