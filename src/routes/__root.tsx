import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AIAssistant } from "@/components/AIAssistant";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { LiftIntro } from "@/components/LiftIntro";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center gradient-hero px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-8xl gold-text">404</div>
        <h2 className="mt-4 font-display text-2xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-xl gradient-luxe text-white px-5 py-2.5 text-sm font-medium">
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please refresh or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-xl gradient-luxe text-white px-4 py-2 text-sm font-medium"
          >Try again</button>
          <a href="/" className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shiv Sir's Education Hub — Premier Commerce Coaching in Nagpur" },
      { name: "description", content: "Nagpur's most trusted commerce coaching for 11th, 12th, B.Com and BBA. Building future commerce leaders since 2012." },
      { name: "author", content: "Shiv Sir's Education Hub" },
      { name: "theme-color", content: "#0F172A" },
      { property: "og:title", content: "Shiv Sir's Education Hub — Premier Commerce Coaching in Nagpur" },
      { property: "og:description", content: "Trusted commerce coaching for 11th, 12th, B.Com and BBA students in Nagpur. 5.0 Google rating, 13+ years." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Shiv Sir's Education Hub" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Shiv Sir's Education Hub",
          description: "Premier commerce coaching institute in Nagpur for 11th, 12th, B.Com and BBA.",
          address: { "@type": "PostalAddress", addressLocality: "Nagpur", addressRegion: "Maharashtra", addressCountry: "IN" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "62" },
          foundingDate: "2012",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LiftIntro />
      <ScrollProgress />
      <Header />
      <main className="pt-24">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <AIAssistant />
      <BackToTop />
    </QueryClientProvider>
  );
}
