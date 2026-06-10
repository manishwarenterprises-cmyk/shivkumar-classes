import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Shiv Sir's Education Hub" },
      { name: "description", content: "Photos, events and classroom moments from Shiv Sir's Education Hub, Nagpur." },
      { property: "og:title", content: "Gallery — Shiv Sir's Education Hub" },
      { property: "og:description", content: "A look inside our classrooms and events." },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

const PHOTOS = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  h: 200 + ((i * 73) % 200),
  hue: 220 + ((i * 31) % 60),
  label: ["Classroom","Workshop","Award Day","Topper","Annual Function","Doubt Class","Library","Test Day"][i % 8],
}));

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Inside Our Hub"
          title={<>Quiet moments of <span className="gold-text">learning</span></>}
          subtitle="A glimpse into the classrooms, events and everyday rhythm of Shiv Sir's Education Hub."
        />
        <div className="mt-14 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 6) * 0.04}>
              <button
                onClick={() => setOpen(p.id)}
                className="block w-full overflow-hidden rounded-2xl ring-1 ring-border bg-white shadow-soft group break-inside-avoid"
              >
                <div
                  className="relative w-full transition-transform group-hover:scale-105"
                  style={{
                    height: p.h,
                    background: `linear-gradient(135deg, oklch(0.6 0.1 ${p.hue}), oklch(0.35 0.08 ${p.hue + 20}))`,
                  }}
                >
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="text-white/90 text-xs font-medium drop-shadow">{p.label}</span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={()=>setOpen(null)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur grid place-items-center p-6"
          >
            <button onClick={()=>setOpen(null)} className="absolute top-6 right-6 h-10 w-10 grid place-items-center rounded-full bg-white/10 text-white"><X/></button>
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="aspect-[4/3] w-full max-w-3xl rounded-3xl"
              style={{ background: `linear-gradient(135deg, oklch(0.6 0.1 ${220+open*31%60}), oklch(0.35 0.08 ${240+open*31%60}))` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
