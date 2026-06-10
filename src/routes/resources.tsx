import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { FileText, Calculator, BookOpen, Download } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Shiv Sir's Education Hub" },
      { name: "description", content: "Free commerce notes, formulas, sample papers and exam prep resources." },
      { property: "og:title", content: "Commerce Resources — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Free study material for commerce students." },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: Resources,
});

const RESOURCES = [
  { i: BookOpen, t: "Chapter Notes", d: "Detailed chapter-wise notes for Accountancy, Economics, Business Studies and OCM.", n: 24 },
  { i: Calculator, t: "Commerce Formulas", d: "All formulas, ratios and accounting equations on one sheet.", n: 6 },
  { i: FileText, t: "Sample Papers", d: "Board pattern sample papers with marking scheme.", n: 18 },
  { i: BookOpen, t: "Previous Year Papers", d: "Last 10 years of CBSE and HSC board papers, organised.", n: 40 },
  { i: Calculator, t: "Quick Revision Sheets", d: "Last-minute one-pagers for every important chapter.", n: 32 },
  { i: FileText, t: "Career Guides", d: "PDF guides on careers after 12th commerce and graduation.", n: 8 },
];

function Resources() {
  return (
    <Section className="pt-12">
      <SectionHeader
        eyebrow="Free Resource Center"
        title={<>Study material, on the <span className="gold-text">house</span></>}
        subtitle="Free notes, formulas and sample papers — built by Shiv Sir, refined over a decade."
      />
      <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESOURCES.map((r, i) => (
          <Reveal key={r.t} delay={i*0.05}>
            <Link to="/downloads" className="group block h-full">
              <div className="h-full rounded-3xl bg-white ring-1 ring-border p-7 shadow-soft hover:shadow-luxe hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-2xl gradient-luxe grid place-items-center text-white">
                    <r.i className="h-5 w-5"/>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-luxury">{r.n} files</span>
                </div>
                <h3 className="mt-5 font-display text-xl">{r.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.d}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                  <Download className="h-4 w-4"/> Browse downloads
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
