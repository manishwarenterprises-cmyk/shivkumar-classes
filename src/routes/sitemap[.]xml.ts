import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://shivkumar-classes.lovable.app";

interface SitemapEntry { path: string; changefreq?: string; priority?: string; }

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/courses", changefreq: "monthly", priority: "0.9" },
          { path: "/courses/11th-commerce", changefreq: "monthly", priority: "0.8" },
          { path: "/courses/12th-commerce", changefreq: "monthly", priority: "0.8" },
          { path: "/courses/cbse-commerce", changefreq: "monthly", priority: "0.8" },
          { path: "/courses/maharashtra-board-commerce", changefreq: "monthly", priority: "0.8" },
          { path: "/courses/bcom", changefreq: "monthly", priority: "0.8" },
          { path: "/courses/bba", changefreq: "monthly", priority: "0.8" },
          { path: "/results", changefreq: "monthly", priority: "0.7" },
          { path: "/testimonials", changefreq: "weekly", priority: "0.7" },
          { path: "/gallery", changefreq: "monthly", priority: "0.6" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/blog/how-to-score-90-plus-in-accountancy", priority: "0.7" },
          { path: "/blog/commerce-after-10th-complete-guide", priority: "0.7" },
          { path: "/blog/bcom-vs-bba", priority: "0.7" },
          { path: "/blog/best-career-options-after-12th-commerce", priority: "0.7" },
          { path: "/blog/common-mistakes-commerce-students-make", priority: "0.7" },
          { path: "/blog/how-to-prepare-for-board-exams", priority: "0.7" },
          { path: "/blog/future-scope-of-commerce-in-india", priority: "0.7" },
          { path: "/resources", changefreq: "monthly", priority: "0.6" },
          { path: "/downloads", changefreq: "monthly", priority: "0.6" },
          { path: "/admission", changefreq: "monthly", priority: "0.9" },
          { path: "/fees", changefreq: "monthly", priority: "0.9" },
          { path: "/locations", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/careers", changefreq: "monthly", priority: "0.5" },
        ];
        const urls = entries.map(e=>`  <url>\n    <loc>${BASE_URL}${e.path}</loc>${e.changefreq?`\n    <changefreq>${e.changefreq}</changefreq>`:""}${e.priority?`\n    <priority>${e.priority}</priority>`:""}\n  </url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type":"application/xml", "Cache-Control":"public, max-age=3600" }});
      },
    },
  },
});
