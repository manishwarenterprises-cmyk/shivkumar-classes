import { Link } from "@tanstack/react-router";
import { SITE, NAV, COURSES } from "@/lib/site";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import ehLogo from "@/assets/eh-logo.png.asset.json";
import agencyLogo from "@/assets/manishwarai-logo-new.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-32 gradient-luxe text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-black grid place-items-center overflow-hidden ring-1 ring-luxury/40">
              <img src={ehLogo.url} alt="Shiv Sir's Education Hub" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="font-display text-lg">Shiv Sir's</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                Education Hub
              </div>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/70 leading-relaxed">
            Nagpur's most trusted commerce coaching for 11th, 12th, B.Com and BBA students. Building future commerce leaders since 2012.
          </p>
          <div className="flex gap-3 mt-6">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white uppercase tracking-wider">Quick Links</h4>
          <ul className="mt-5 space-y-2.5 text-sm text-white/70">
            {NAV.slice(0, 6).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-luxury transition-colors">{n.label}</Link>
              </li>
            ))}
            <li><Link to="/faq" className="hover:text-luxury transition-colors">FAQ</Link></li>
            <li><Link to="/careers" className="hover:text-luxury transition-colors">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white uppercase tracking-wider">Courses</h4>
          <ul className="mt-5 space-y-2.5 text-sm text-white/70">
            {COURSES.map((c) => (
              <li key={c.slug}>
                <Link to="/courses/$slug" params={{ slug: c.slug }} className="hover:text-luxury transition-colors">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-white uppercase tracking-wider">Contact</h4>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-luxury" /><span>{SITE.city}</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-luxury" /><a href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-luxury" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
          </ul>
          <Link to="/admission" className="mt-6 inline-flex rounded-xl bg-luxury text-luxury-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
            Book Free Demo
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Shiv Sir's Education Hub. All rights reserved.</div>
          <a
            href="#"
            className="group flex items-center gap-5 rounded-2xl px-3 py-2 hover:bg-white/[0.04] transition"
          >
            <div className="leading-tight text-right">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-bold">
                Designed & Developed By
              </div>
              <div className="text-base text-luxury font-extrabold uppercase tracking-wide">{SITE.agency}</div>
            </div>
            <img
              src={agencyLogo.url}
              alt={SITE.agency}
              className="h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-[0_0_18px_rgba(198,169,105,0.55)]"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
