import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ehLogo from "@/assets/eh-logo.png.asset.json";

const SESSION_KEY = "eh_lift_shown";

export function LiftIntro() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setOpen(true);
    const t = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(false);
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* center logo */}
          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1.05, 1.4] }}
            transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1], ease: "easeOut" }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-70"
                style={{ background: "radial-gradient(circle, #C6A969, transparent 60%)" }}
              />
              <div className="relative h-32 w-32 rounded-full bg-black ring-2 ring-luxury/60 grid place-items-center overflow-hidden shadow-[0_0_80px_rgba(198,169,105,0.6)]">
                <img src={ehLogo.url} alt="EH" className="h-full w-full object-contain" />
              </div>
              <motion.div
                className="mt-6 text-center font-display text-luxury tracking-[0.4em] text-xs uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Shiv Sir's Education Hub
              </motion.div>
            </div>
          </motion.div>

          {/* lift doors */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1/2"
            style={{
              background:
                "linear-gradient(135deg, #0a0f1e 0%, #1a2342 50%, #0a0f1e 100%)",
              borderRight: "1px solid rgba(198,169,105,0.4)",
              boxShadow: "inset -20px 0 60px rgba(198,169,105,0.15)",
            }}
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 1.2, delay: 1.6, ease: [0.86, 0, 0.07, 1] }}
          />
          <motion.div
            className="absolute top-0 bottom-0 right-0 w-1/2"
            style={{
              background:
                "linear-gradient(225deg, #0a0f1e 0%, #1a2342 50%, #0a0f1e 100%)",
              borderLeft: "1px solid rgba(198,169,105,0.4)",
              boxShadow: "inset 20px 0 60px rgba(198,169,105,0.15)",
            }}
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, delay: 1.6, ease: [0.86, 0, 0.07, 1] }}
          />
          {/* center gold seam */}
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent, #C6A969, transparent)",
              boxShadow: "0 0 20px #C6A969",
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scaleY: [0, 1, 1, 1] }}
            transition={{ duration: 2.8, times: [0, 0.15, 0.6, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
