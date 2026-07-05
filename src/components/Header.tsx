import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import ehLogo from "@/assets/eh-logo.png.asset.json";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <div className="glass shadow-soft flex items-center justify-between rounded-2xl px-5 py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-full grid place-items-center overflow-hidden">
              <img src={ehLogo.url} alt="Shiv Sir's Education Hub" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-foreground tracking-tight">
                Shiv Sir's
              </div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Education Hub
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3 py-2 text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px gradient-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-3 md:px-4 py-2 text-sm font-medium hover:opacity-90 transition shadow-soft"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Book Demo</span>
            </a>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden glass shadow-luxe mt-2 rounded-2xl p-3"
            >
              <div className="grid gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm hover:bg-muted text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  className="mt-2 text-center rounded-lg bg-foreground text-background py-2.5 text-sm font-medium"
                >
                  Book Free Demo
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
