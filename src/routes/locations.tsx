import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { FAQBlock, faqSchema, type FAQ } from "@/components/FAQBlock";
import { SITE } from "@/lib/site";
import { MapPin, Bus, Clock, Phone } from "lucide-react";

const CANONICAL = "https://shivkumar-classes.lovable.app/locations";

const AREAS = [
  { area: "Wadi", note: "Main centre. Balaji Complex, above Shree Jewellers — 2 min walk from Blue Bells Convent School." },
  { area: "Duttawadi", note: "Same building as Wadi centre. Direct auto access from Duttawadi square." },
  { area: "Hingna Road", note: "15 min drive. Auto + shared cab routes drop at Wadi square, 200 m from the centre." },
  { area: "Amravati Road", note: "20 min via city bus. Route 34 & 51 stop at Wadi crossing." },
  { area: "Gorewada", note: "18 min drive. Free evening pickup point at Gorewada Ring Road on request." },
  { area: "Katol Road", note: "25 min drive. Two shared batches (5 PM & 7 PM) run for Katol Road students." },
];

const FAQS: FAQ[] = [
  { q: "Where exactly is Shiv Sir's Education Hub located in Nagpur?", a: `${SITE.address}. Landmark: above Shree Jewellers, next to Blue Bells Convent School.` },
  { q: "Which areas of Nagpur do students come from?", a: "Most students come from Wadi, Duttawadi, Hingna Road, Amravati Road, Gorewada, Katol Road and MIHAN — all within a 25 minute commute." },
  { q: "Is there parking available at the centre?", a: "Yes. Free two-wheeler parking is available inside Balaji Complex. Four-wheeler street parking is available on the service road." },
  { q: "Do you offer online classes for students outside Nagpur?", a: "Yes. Live online batches run parallel to offline batches for 11th, 12th and CBSE Commerce. Recordings are shared within 2 hours of every class." },
  { q: "How do I reach the centre by public transport?", a: "City buses on routes 34 and 51 stop at Wadi crossing (200 m). Shared autos from Duttawadi and Hingna square run every 5 minutes." },
  { q: "What are the class timings?", a: "Weekday batches: 4 PM–8 PM. Weekend batches: 9 AM–1 PM. B.Com and BBA tuition batches run 6 PM–8 PM." },
];

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Commerce Coaching in Nagpur — Wadi, Duttawadi & Nearby Areas" },
      { name: "description", content: "Shiv Sir's Education Hub is located in Wadi, Nagpur — serving Duttawadi, Hingna Road, Amravati Road, Gorewada and Katol Road commerce students." },
      { property: "og:title", content: "Locations & Areas Served — Shiv Sir's Education Hub, Nagpur" },
      { property: "og:description", content: "Find directions, transport routes and areas served by our Nagpur commerce coaching centre." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: SITE.name,
          telephone: SITE.phone,
          email: SITE.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Balaji Complex, Above Shree Jewellers, Duttawadi",
            addressLocality: "Wadi, Nagpur",
            addressRegion: "Maharashtra",
            postalCode: "440023",
            addressCountry: "IN",
          },
          areaServed: AREAS.map((a) => a.area),
          url: CANONICAL,
        }),
      },
      { type: "application/ld+json", children: JSON.stringify(faqSchema(FAQS)) },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Find Us"
          title={<>Serving <span className="gold-text">commerce students</span> across Nagpur</>}
          subtitle={SITE.address}
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="rounded-3xl overflow-hidden ring-1 ring-border shadow-soft aspect-[4/3]">
              <iframe
                src={SITE.mapsEmbed}
                title="Shiv Sir's Education Hub location"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-3xl bg-white ring-1 ring-border p-8 shadow-soft h-full space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-luxury mt-0.5" />
                <div>
                  <h3 className="font-display text-lg">Address</h3>
                  <p className="text-sm text-muted-foreground mt-1">{SITE.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-luxury mt-0.5" />
                <div>
                  <h3 className="font-display text-lg">Class Timings</h3>
                  <p className="text-sm text-muted-foreground mt-1">Weekdays 4 PM – 8 PM · Weekends 9 AM – 1 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bus className="h-5 w-5 text-luxury mt-0.5" />
                <div>
                  <h3 className="font-display text-lg">Getting Here</h3>
                  <p className="text-sm text-muted-foreground mt-1">City bus routes 34 & 51 · Shared autos from Duttawadi & Hingna square every 5 min · Free two-wheeler parking in the building.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-luxury mt-0.5" />
                <div>
                  <h3 className="font-display text-lg">Call / WhatsApp</h3>
                  <p className="text-sm text-muted-foreground mt-1">{SITE.phone}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="!pt-0">
        <SectionHeader
          eyebrow="Areas We Serve"
          title={<>Commerce coaching for <span className="gold-text">all of west Nagpur</span></>}
          subtitle="Whether you're 200 metres away or a 25-minute drive out, we've built our batches around how Nagpur commutes."
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AREAS.map((a, i) => (
            <Reveal key={a.area} delay={i * 0.05}>
              <article className="rounded-2xl bg-white ring-1 ring-border p-6 h-full">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-luxury" />
                  <h3 className="font-display text-lg">{a.area}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <FAQBlock
        eyebrow="Location FAQ"
        title={<>Getting to <span className="gold-text">our centre</span></>}
        faqs={FAQS}
      />
    </>
  );
}
