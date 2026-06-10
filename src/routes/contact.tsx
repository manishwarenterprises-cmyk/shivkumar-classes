import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal } from "@/components/primitives";
import { SITE } from "@/lib/site";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Shiv Sir's Education Hub" },
      { name: "description", content: `Visit, call or WhatsApp Shiv Sir's Education Hub in ${SITE.city}.` },
      { property: "og:title", content: "Contact — Shiv Sir's Education Hub" },
      { property: "og:description", content: "Get in touch for admissions and inquiries." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Section className="pt-12">
        <SectionHeader
          eyebrow="Get In Touch"
          title={<>Visit us, call us, or just <span className="gold-text">say hello</span></>}
          subtitle="We respond personally to every inquiry — usually within minutes."
        />
        <div className="mt-14 grid lg:grid-cols-5 gap-8">
          <Reveal className="lg:col-span-2">
            <div className="rounded-3xl gradient-luxe text-white p-8 h-full shadow-luxe">
              <h3 className="font-display text-2xl">Contact details</h3>
              <div className="mt-8 space-y-5">
                <a href={`tel:${SITE.phone}`} className="flex items-start gap-4 hover:text-luxury transition">
                  <Phone className="h-5 w-5 text-luxury mt-0.5"/>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Call</div>
                    <div className="mt-0.5 text-sm">{SITE.phone}</div>
                  </div>
                </a>
                <a href={`https://wa.me/${SITE.whatsapp}`} className="flex items-start gap-4 hover:text-luxury transition">
                  <MessageCircle className="h-5 w-5 text-luxury mt-0.5"/>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">WhatsApp</div>
                    <div className="mt-0.5 text-sm">{SITE.phone}</div>
                  </div>
                </a>
                <a href={`mailto:${SITE.email}`} className="flex items-start gap-4 hover:text-luxury transition">
                  <Mail className="h-5 w-5 text-luxury mt-0.5"/>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Email</div>
                    <div className="mt-0.5 text-sm">{SITE.email}</div>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-luxury mt-0.5"/>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-white/60">Visit</div>
                    <div className="mt-0.5 text-sm">{SITE.city}</div>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="text-xs uppercase tracking-wider text-white/60">Class Hours</div>
                <div className="mt-3 space-y-1 text-sm text-white/80">
                  <div className="flex justify-between"><span>Mon – Sat</span><span>8 AM – 8 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span>10 AM – 2 PM</span></div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={0.1}>
            <form
              onSubmit={(e)=>{e.preventDefault(); setSent(true); setTimeout(()=>setSent(false), 4000);}}
              className="rounded-3xl bg-white ring-1 ring-border p-8 shadow-soft"
            >
              <h3 className="font-display text-2xl">Send us a message</h3>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {[
                  { l:"Full name", t:"text", p:"Your name" },
                  { l:"Phone", t:"tel", p:"+91 9876 543 210" },
                  { l:"Email", t:"email", p:"you@email.com" },
                  { l:"Course interested in", t:"text", p:"e.g. 12th Commerce" },
                ].map(f=>(
                  <label key={f.l} className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{f.l}</span>
                    <input required type={f.t} placeholder={f.p}
                      className="mt-1.5 w-full rounded-xl bg-muted ring-1 ring-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"/>
                  </label>
                ))}
              </div>
              <label className="block mt-4">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Message</span>
                <textarea required rows={4} placeholder="How can we help?"
                  className="mt-1.5 w-full rounded-xl bg-muted ring-1 ring-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"/>
              </label>
              <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-2xl gradient-luxe text-white px-6 py-3 text-sm font-medium shadow-luxe">
                <Send className="h-4 w-4"/> Send Message
              </button>
              {sent && <div className="mt-4 text-sm text-luxury">Thank you! We'll reach out within minutes.</div>}
            </form>
          </Reveal>
        </div>
      </Section>

      {/* Map */}
      <Section className="!pt-0">
        <Reveal>
          <div className="rounded-3xl overflow-hidden ring-1 ring-border shadow-soft aspect-[16/7]">
            <iframe
              src={SITE.mapsEmbed}
              className="w-full h-full"
              loading="lazy"
              title="Map"
            />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
