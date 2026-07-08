import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `children` only after its placeholder scrolls near the viewport,
 * or on first user interaction — whichever happens first. Reserves layout
 * space via `minHeight` so nothing shifts (CLS-safe).
 */
export function DeferredMount({
  children,
  rootMargin = "400px",
  minHeight,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number | string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    const onInteract = () => setVisible(true);
    window.addEventListener("scroll", onInteract, { once: true, passive: true });
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("pointerdown", onInteract);
    };
  }, [rootMargin, visible]);

  const Wrapper = Tag as any;
  return (
    <Wrapper ref={ref as any} className={className} style={minHeight ? { minHeight } : undefined}>
      {visible ? children : null}
    </Wrapper>
  );
}
