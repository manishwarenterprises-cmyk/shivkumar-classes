import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ehLogo from "@/assets/eh-logo.png.asset.json";

const SESSION_KEY = "eh_ledger_shown";

/**
 * Cinematic commerce ledger opening sequence:
 * dark stage → ledger book appears → covers flip open →
 * golden light bursts → logo + headline reveal → curtain lifts.
 * Total runtime ~3.6s.
 */
export function LedgerIntro() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setOpen(true);
    const t = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setOpen(false);
    }, 3600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, #1a1530 0%, #0a0814 60%, #050309 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {/* floating commerce symbols */}
          {["₹", "%", "Σ", "∫", "₹", "+", "=", "%"].map((s, i) => (
            <motion.span
              key={i}
              className="absolute font-display text-luxury/30 text-3xl select-none"
              style={{
                left: `${10 + ((i * 11) % 80)}%`,
                top: `${15 + ((i * 17) % 70)}%`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 0.6, 0], y: [-20, -80] }}
              transition={{
                duration: 3,
                delay: 0.2 + i * 0.12,
                repeat: 0,
                ease: "easeOut",
              }}
            >
              {s}
            </motion.span>
          ))}

          {/* Ledger book stage */}
          <div
            className="absolute inset-0 grid place-items-center"
            style={{ perspective: "1600px" }}
          >
            <motion.div
              className="relative"
              style={{ width: "min(560px, 78vw)", height: "min(360px, 50vw)" }}
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* spine + pages */}
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  background:
                    "linear-gradient(180deg, #faf6ec 0%, #f1e9d2 100%)",
                  boxShadow:
                    "0 30px 80px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(198,169,105,0.4)",
                }}
              />
              {/* ledger ruled lines */}
              <div
                className="absolute inset-0 rounded-md opacity-50"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0 22px, rgba(60,40,90,0.18) 22px 23px), linear-gradient(90deg, transparent 49%, rgba(198,80,80,0.4) 49.5%, transparent 50.5%)",
                }}
              />

              {/* LEFT cover flipping open */}
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-1/2 origin-right rounded-l-md"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1432 0%, #2a1f55 50%, #100a26 100%)",
                  borderRight: "1px solid rgba(198,169,105,0.5)",
                  boxShadow:
                    "inset -10px 0 30px rgba(0,0,0,0.6), 0 8px 30px rgba(0,0,0,0.5)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -170 }}
                transition={{ duration: 1.2, delay: 0.9, ease: [0.86, 0, 0.07, 1] }}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-luxury font-display text-[10px] uppercase tracking-[0.4em] opacity-70">
                    Ledger
                  </div>
                </div>
              </motion.div>

              {/* RIGHT cover flipping open */}
              <motion.div
                className="absolute top-0 bottom-0 right-0 w-1/2 origin-left rounded-r-md"
                style={{
                  background:
                    "linear-gradient(225deg, #1a1432 0%, #2a1f55 50%, #100a26 100%)",
                  borderLeft: "1px solid rgba(198,169,105,0.5)",
                  boxShadow:
                    "inset 10px 0 30px rgba(0,0,0,0.6), 0 8px 30px rgba(0,0,0,0.5)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 170 }}
                transition={{ duration: 1.2, delay: 0.9, ease: [0.86, 0, 0.07, 1] }}
              />

              {/* golden light burst */}
              <motion.div
                className="absolute inset-0 rounded-md pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,215,140,0.95) 0%, rgba(198,169,105,0.5) 25%, transparent 60%)",
                  mixBlendMode: "screen",
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 0.6], scale: [0.4, 2.4, 3] }}
                transition={{ duration: 1.6, delay: 1.5, ease: "easeOut" }}
              />

              {/* logo emerges */}
              <motion.div
                className="absolute inset-0 grid place-items-center"
                initial={{ opacity: 0, scale: 0.3, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative">
                  <div
                    className="absolute -inset-6 rounded-full blur-2xl"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,215,140,0.7), transparent 70%)",
                    }}
                  />
                  <div className="relative h-40 w-40 md:h-52 md:w-52 rounded-full grid place-items-center overflow-hidden">
                    <img
                      src={ehLogo.url}
                      alt="Shiv Sir's Education Hub"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Wordmark below */}
          <motion.div
            className="absolute left-0 right-0 bottom-[18%] text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.2 }}
          >
            <div className="font-display text-xl md:text-2xl font-extrabold uppercase tracking-[0.32em] text-white">
              Shiv <span className="text-luxury">Sir's</span> Education Hub
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.5em] text-luxury/80">
              Knowledge · Discipline · Success
            </div>
          </motion.div>

          {/* final curtain lift */}
          <motion.div
            className="absolute inset-x-0 bottom-0 origin-bottom"
            style={{
              height: "100%",
              background:
                "linear-gradient(180deg, transparent 0%, #050309 30%, #050309 100%)",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 0, 1] }}
            transition={{ duration: 0.8, delay: 3.0, times: [0, 0.5, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
