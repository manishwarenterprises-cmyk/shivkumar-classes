import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Award } from "lucide-react";

/** Achievement-certificate card with 3D tilt + gold seal. */
export function CertificateCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-50, 50], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-50, 50], [-10, 10]), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(e.clientX - r.left - r.width / 2);
        y.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="relative h-full"
    >
      <div
        className="relative h-full rounded-3xl p-7 ring-1 ring-luxury/40 shadow-luxe overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #fffdf6 0%, #f8efd8 100%)",
        }}
      >
        {/* gold border frame */}
        <div
          className="absolute inset-2 rounded-2xl pointer-events-none"
          style={{
            border: "1px dashed rgba(198,169,105,0.4)",
          }}
        />
        {/* gold seal */}
        <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-gradient-to-br from-luxury to-[#8a6b2a] grid place-items-center ring-2 ring-white shadow-md">
          <Award className="h-5 w-5 text-white" />
        </div>
        <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-luxury/10 blur-2xl pointer-events-none" />
        <div className="relative">{children}</div>
      </div>
    </motion.div>
  );
}
