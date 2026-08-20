"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show when scrolled a bit (same idea as scroll-to-top)
  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href =
    "https://api.whatsapp.com/send?phone=61415164208&text=Hi%20Casa%20Bombora%2C%20I%27d%20like%20to%20learn%20more%20about%20investing%20in%20a%20villa.";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-20 right-4 md:right-6 z-50 p-3 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe57] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
