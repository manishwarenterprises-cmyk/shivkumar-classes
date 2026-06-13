import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Rocket } from "lucide-react";
import { Counter } from "@/components/Counter";

const STATS = [
  { v: 850, s: "+", l: "Students" },
  { v: 94, s: "%", l: "Avg Score" },
  { v: 120, s: "+", l: "90%+ Toppers" },
  { v: 5.0, s: "", l: "Rating", d: 1 },
];

/** Scroll-driven rocket launch behind floating success statistics. */
export function RocketLaunch() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-160%"]);
  const rot = useTransform(scrollYProgress, [0, 0.3, 1], [-6, 0, 2]);
  const flame = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);
  const trailH = useTransform(scrollYProgress, [0, 1], [0, 400]);

  return (
    <div
      ref={ref}
      className="relative mt-16 rounded-[2.5rem] overflow-hidden ring-1 ring-luxury/30 shadow-luxe"
      style={{
        background:
          "linear-gradient(180deg, #0a0820 0%, #1a1442 40%, #2a1f55 100%)",
        minHeight: 480,
      }}
    >
      {/* twinkling stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-white"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
        />
      ))}

      {/* rocket trail */}
      <motion.div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-1 rounded-full"
        style={{
          height: trailH,
          background:
            "linear-gradient(180deg, transparent, rgba(255,180,80,0.8), rgba(255,80,40,0.4), transparent)",
          filter: "blur(2px)",
        }}
      />

      {/* rocket */}
      <motion.div
        className="absolute left-1/2 bottom-12 -translate-x-1/2"
        style={{ y, rotate: rot }}
      >
        <div className="relative">
          <motion.div
            className="absolute left-1/2 top-full -translate-x-1/2 w-3 h-12 rounded-b-full"
            style={{
              opacity: flame,
              background:
                "linear-gradient(180deg, #fff7d6, #ffb547 40%, #ff4c1a 80%, transparent)",
              filter: "blur(1px)",
            }}
            animate={{ scaleY: [0.9, 1.2, 0.9] }}
            transition={{ duration: 0.25, repeat: Infinity }}
          />
          <div className="h-20 w-12 rounded-full bg-gradient-to-b from-white via-luxury to-[#8a6b2a] ring-2 ring-luxury shadow-[0_0_40px_rgba(198,169,105,0.7)] grid place-items-center">
            <Rocket className="h-6 w-6 text-luxury-foreground rotate-[-45deg]" />
          </div>
        </div>
      </motion.div>

      {/* floating statistics */}
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-8 md:p-12">
        {STATS.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/15 p-5 text-center"
          >
            <div className="font-display text-3xl md:text-4xl text-luxury font-extrabold">
              <Counter to={s.v} suffix={s.s} decimals={s.d ?? 0} />
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] uppercase tracking-[0.4em] text-white/40">
        Scroll to launch · Student growth in motion
      </div>
    </div>
  );
}
