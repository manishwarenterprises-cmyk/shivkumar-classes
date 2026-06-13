import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BookOpen, PenTool, FileCheck2, TrendingUp, GraduationCap } from "lucide-react";

const STEPS = [
  { label: "Learn", icon: BookOpen, desc: "Concepts taught from scratch" },
  { label: "Practice", icon: PenTool, desc: "Daily drills & worksheets" },
  { label: "Test", icon: FileCheck2, desc: "Weekly mock examinations" },
  { label: "Improve", icon: TrendingUp, desc: "Personal feedback loops" },
  { label: "Succeed", icon: GraduationCap, desc: "90+ board scores" },
];

/** A 5-step staircase the user "climbs" as they scroll. */
export function CommerceStaircase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const climb = useTransform(scrollYProgress, [0.1, 0.9], [0, 100]);

  return (
    <div ref={ref} className="relative mt-16">
      <div className="relative flex items-end justify-between gap-2 md:gap-4 h-[320px] md:h-[420px]">
        {STEPS.map((s, i) => {
          const stepH = 16 + i * 16; // % from bottom
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="flex-1 relative flex flex-col items-center justify-end"
              style={{ height: `${stepH + 20}%` }}
            >
              <div className="w-full rounded-t-2xl ring-1 ring-luxury/40 shadow-luxe overflow-hidden bg-white/5 backdrop-blur" style={{ height: "100%" }}>
                <div className="h-full w-full" style={{
                  background: `linear-gradient(180deg, rgba(198,169,105,${0.05 + i * 0.06}) 0%, rgba(198,169,105,${0.18 + i * 0.08}) 100%)`,
                }}>
                  <div className="p-3 md:p-4 h-full flex flex-col justify-end">
                    <s.icon className="h-4 w-4 md:h-5 md:w-5 text-luxury" />
                    <div className="mt-2 font-display text-sm md:text-lg font-extrabold uppercase text-white tracking-wide">{s.label}</div>
                    <div className="hidden md:block text-[10px] uppercase tracking-wider text-white/60 mt-1">{s.desc}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Climbing student / graduate cap */}
        <motion.div
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: useTransform(climb, (v) => `calc(${v}% - 24px)`),
            bottom: useTransform(climb, (v) => `${v * 0.85}%`),
          }}
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-luxury/40 blur-xl" />
            <div className="relative h-12 w-12 rounded-full bg-luxury grid place-items-center ring-2 ring-white/40 shadow-[0_0_30px_rgba(198,169,105,0.7)]">
              <GraduationCap className="h-6 w-6 text-luxury-foreground" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
