import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi Shiv Sir, I'd like to know more about admissions.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 left-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 blur-md animate-ping" />
      <span className="relative flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-4 pr-5 py-3 shadow-luxe ring-2 ring-white/70">
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
      </span>
    </motion.a>
  );
}
