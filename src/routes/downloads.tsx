import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — Shiv Sir's Education Hub" },
      { name: "description", content: "PDF notes, sample papers, timetables and study guides — free for commerce students." },
      { property: "og:title", content: "Downloads — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Free PDFs for commerce students." },
    ],
    links: [{ rel: "canonical", href: "/downloads" }],
  }),
  component: Downloads,
});

const FILES = [
  { t: "Accountancy — Class 11 Notes (Chapter 1-7)", s: "2.4 MB", c: "Notes" },
  { t: "Economics — Microeconomics Formulas", s: "0.6 MB", c: "Formulas" },
  { t: "Business Studies — Class 12 Quick Revision", s: "1.8 MB", c: "Revision" },
  { t: "CBSE 2024 Sample Paper — Accountancy", s: "0.9 MB", c: "Sample Paper" },
  { t: "HSC Board Timetable 2025", s: "0.2 MB", c: "Timetable" },
  { t: "B.Com Sem 1 — Financial Accounting Notes", s: "3.1 MB", c: "Notes" },
  { t: "BBA — Principles of Management Guide", s: "2.0 MB", c: "Guide" },
  { t: "Last 10 Years — CBSE Commerce Papers", s: "5.7 MB", c: "PYQ" },
];

function Downloads() {
  return (
    <Section className="pt-12">
      <SectionHeader
        eyebrow="Downloads"
        title={<>PDFs, notes & <span className="gold-text">papers</span></>}
        subtitle="Click any file below to download. All resources are free for students."
      />
      <div className="mt-14 grid gap-3 max-w-3xl mx-auto">
        {FILES.map((f, i) => (
          <Reveal key={f.t} delay={i*0.03}>
            <button className="w-full flex items-center gap-4 rounded-2xl bg-white ring-1 ring-border p-5 hover:shadow-soft hover:-translate-y-0.5 transition text-left">
              <div className="h-11 w-11 rounded-xl gradient-luxe grid place-items-center text-white shrink-0">
                <FileText className="h-5 w-5"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{f.t}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{f.c} · {f.s}</div>
              </div>
              <Download className="h-4 w-4 text-muted-foreground"/>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
