import { useEffect, useRef, useState } from "react";

/** Soft luxury cursor glow — desktop only, gracefully disabled on touch. */
export function CursorGlow() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;
    setEnabled(true);

    let rx = 0, ry = 0, dx = 0, dy = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
    };
    const loop = () => {
      rx += (dx - rx) * 0.12;
      ry += (dy - ry) * 0.12;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 24}px, ${ry - 24}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-12 w-12 rounded-full mix-blend-multiply"
        style={{
          background: "radial-gradient(circle, rgba(155,120,230,0.35), transparent 65%)",
          filter: "blur(2px)",
        }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[91] h-2 w-2 rounded-full bg-luxury shadow-[0_0_12px_rgba(198,169,105,0.9)]"
      />
    </>
  );
}
