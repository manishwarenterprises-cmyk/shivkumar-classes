import { useEffect, useRef } from "react";

/**
 * Sitewide subtle rain — canvas-based, low opacity, pointer-events none.
 * Very light on performance: ~120 drops, additive blend.
 */
export function RainOverlay() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const DROPS = Math.min(140, Math.floor((width * height) / 14000));
    const drops = Array.from({ length: DROPS }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 10 + Math.random() * 18,
      speed: 4 + Math.random() * 6,
      opacity: 0.08 + Math.random() * 0.15,
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      for (const d of drops) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(180,160,220,${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        d.x -= 0.4;
        if (d.y > height) {
          d.y = -d.len;
          d.x = Math.random() * (width + 40);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] mix-blend-multiply opacity-70"
    />
  );
}
