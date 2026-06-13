import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Cinematic animated backdrop — floating orbs, aurora, parallax shapes. Pure CSS+framer. */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora layer */}
      <motion.div
        style={{ y: y3 }}
        className="absolute -top-40 -left-40 h-[55rem] w-[55rem] rounded-full opacity-60 animate-aurora"
      >
        <div
          className="h-full w-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(155,120,230,0.45), transparent 60%)", filter: "blur(60px)" }}
        />
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -right-40 h-[40rem] w-[40rem] rounded-full opacity-50"
      >
        <div
          className="h-full w-full rounded-full animate-aurora"
          style={{ background: "radial-gradient(circle, rgba(198,169,105,0.4), transparent 60%)", filter: "blur(60px)", animationDelay: "-4s" }}
        />
      </motion.div>

      {/* Floating 3D glass shapes */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-24 right-[12%] h-28 w-28 rounded-3xl"
      >
        <div className="h-full w-full rounded-3xl bg-gradient-to-br from-white/70 to-white/20 ring-1 ring-white/60 backdrop-blur-md shadow-luxe rotate-12" />
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-[8%] h-20 w-20 rounded-full ring-1 ring-luxury/40"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-br from-luxury/40 to-transparent backdrop-blur" />
      </motion.div>
      <motion.div
        style={{ y: y1 }}
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-[55%] hidden md:block h-16 w-16 rotate-45 rounded-xl bg-gradient-to-br from-accent/40 to-white/10 ring-1 ring-white/40 backdrop-blur"
      />

      {/* Commerce symbols */}
      {["₹", "%", "Σ", "∫", "★"].map((s, i) => (
        <motion.div
          key={i}
          className="absolute font-display text-2xl md:text-3xl text-luxury/40 select-none"
          style={{ left: `${10 + i * 18}%`, top: `${20 + ((i * 23) % 60)}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        >
          {s}
        </motion.div>
      ))}
    </div>
  );
}
