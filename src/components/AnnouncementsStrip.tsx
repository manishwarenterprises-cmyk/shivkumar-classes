import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone } from "lucide-react";
import { listAnnouncements } from "@/lib/store-admin.functions";

export function AnnouncementsStrip({ audience = "home" }: { audience?: "home" | "students" | "all" }) {
  const fetch = useServerFn(listAnnouncements);
  const q = useQuery({
    queryKey: ["announcements", audience],
    queryFn: () => fetch({ data: { audience } }),
    // works only when signed in (middleware requires auth); harmless failure otherwise
    retry: false,
  });
  const items = q.data ?? [];
  if (!items.length) return null;
  return (
    <div className="mx-auto max-w-7xl px-4 mt-2">
      <div className="rounded-2xl gradient-luxe text-white shadow-luxe overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <Megaphone className="h-4 w-4 shrink-0 text-luxury" />
          <div className="relative flex-1 overflow-hidden h-5">
            <AnimatePresence mode="wait">
              {items.map((a: any, i: number) => (
                <motion.div
                  key={a.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, delay: i * 4 }}
                  className="absolute inset-0 text-xs sm:text-sm font-medium truncate"
                >
                  <span className="gold-text font-bold uppercase tracking-wider mr-2">{a.title}</span>
                  <span className="text-white/80">{a.body}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
