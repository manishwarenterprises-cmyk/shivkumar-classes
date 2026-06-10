import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Counter({
  to,
  suffix = "",
  duration = 1.6,
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 83) % 100}%`,
            top: `${(i * 47) % 100}%`,
            width: 6 + (i % 4) * 4,
            height: 6 + (i % 4) * 4,
            background:
              i % 3 === 0
                ? "radial-gradient(circle, rgba(198,169,105,0.5), transparent 70%)"
                : "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 14, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8 + (i % 5),
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
