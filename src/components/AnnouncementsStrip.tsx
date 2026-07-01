import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Ann = { id: string; title: string; body: string; audience: string };

export function AnnouncementsStrip({ audience = "home" }: { audience?: "home" | "students" | "all" }) {
  const [items, setItems] = useState<Ann[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("id, title, body, audience")
      .eq("is_published", true)
      .or(`audience.eq.${audience},audience.eq.all`)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setItems((data ?? []) as Ann[]));
  }, [audience]);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const a = items[idx];
  return (
    <div className="mx-auto max-w-7xl px-4 mt-2">
      <div className="rounded-2xl gradient-luxe text-white shadow-luxe overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <Megaphone className="h-4 w-4 shrink-0 text-luxury animate-pulse" />
          <div className="relative flex-1 overflow-hidden h-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={a.id}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 text-xs sm:text-sm font-medium truncate"
              >
                <span className="gold-text font-bold uppercase tracking-wider mr-2">{a.title}</span>
                <span className="text-white/85">{a.body}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
