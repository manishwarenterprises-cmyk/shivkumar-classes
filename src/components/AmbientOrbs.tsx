import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";

type OrbSpec = {
  size: number;
  top: string;
  left?: string;
  right?: string;
  color: string;
  parallax?: number;
  delay?: number;
};

const DEFAULTS: OrbSpec[] = [
  { size: 420, top: "-10%", left: "-8%", color: "rgba(155,120,230,0.35)", parallax: -80 },
  { size: 340, top: "60%", right: "-6%", color: "rgba(198,169,105,0.28)", parallax: 60, delay: -4 },
  { size: 260, top: "30%", left: "60%", color: "rgba(120,180,230,0.22)", parallax: -40, delay: -2 },
];

/**
 * Subtle ambient orbs + parallax layer. Drop inside any section wrapper
 * that is `relative overflow-hidden`. Pointer-events none.
 */
export function AmbientOrbs({ orbs = DEFAULTS }: { orbs?: OrbSpec[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {orbs.map((o, i) => (
        <ParallaxOrb key={i} spec={o} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function ParallaxOrb({
  spec,
  progress,
}: {
  spec: OrbSpec;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(progress, [0, 1], [0, spec.parallax ?? -60]);
  const style: CSSProperties = {
    width: spec.size,
    height: spec.size,
    top: spec.top,
    left: spec.left,
    right: spec.right,
    background: `radial-gradient(circle, ${spec.color}, transparent 65%)`,
    filter: "blur(40px)",
  };
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ ...style, y }}
      animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: spec.delay ?? 0 }}
    />
  );
}
