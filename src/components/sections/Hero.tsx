"use client";

import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
// import { CasaLogoWhite } from "@/components/icons/CasaLogoWhite";
import heroLogoWebp from "@/components/icons/CasaLogoWhiteShadowWithBorder.webp";

// Custom hook for responsive design
function useResponsiveSize() {
  // Default to larger size for server-side rendering
  const [logoSize, setLogoSize] = useState(400);
  
  useEffect(() => {
    // Function to update size based on window width
    const updateSize = () => {
      setLogoSize(window.innerWidth <= 400 ? 300 : 400);
    };
    
    // Set initial size
    updateSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateSize);
    
    // Clean up
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return logoSize;
}

export function Hero() {
  // Using state to handle client/server rendering mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  // State to control the transition from text to logo
  const [showTextFirst, setShowTextFirst] = useState(true);
  
  // Get responsive logo size
  const logoSize = useResponsiveSize();
  
  // Only render the dynamic content after component has mounted on client
  useEffect(() => {
    setIsMounted(true);
    
    // Set a timeout to transition from text to logo after a delay
    const timer = setTimeout(() => {
      setShowTextFirst(false);
    }, 2500); // 2.5 seconds delay before showing the logo
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center pt-32 pb-24 md:py-0 relative overflow-hidden">
      {/* Hero background - rendered unconditionally for instant SSR paint */}
      <div
        className="absolute inset-0 -z-20 hero-bg"
      />
      
      {/* Decorative background elements (none to keep background fully crisp) */}
      <div className="absolute inset-0 -z-10" />
      
      <Container>
        <div className="flex flex-col items-center justify-center">
          {/* Static placeholder shown during server-side rendering */}
          {!isMounted && (
            <div className="relative">
              <div className="w-[300px] h-[225px] bg-lion/20 rounded-full animate-pulse"></div>
              <div className="mt-12 h-6 bg-gunmetal/10 rounded w-64 mx-auto animate-pulse"></div>
            </div>
          )}
          
          {/* Dynamic logo and content only rendered on client side */}
          {isMounted && (
            <>
              {/* First block: Logo or text based on state - with fixed height */}
              <div style={{ height: logoSize * 0.75 }} className="w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {showTextFirst ? (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.25, 0.1, 0.25, 1.0]
                      }}
                    >
                      <motion.h1 
                        className="font-serif text-5xl md:text-7xl font-medium text-center"
                        animate={{ y: [5, 0, 5] }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut" 
                        }}
                      >
                        <span className="text-lion">CASA</span>{" "}
                        <span className="text-blue-green">bombora</span>
                      </motion.h1>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="logo"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 1.2,
                        ease: [0.25, 0.1, 0.25, 1.0],
                        delay: 0.2
                      }}
                    >
                      <Image
                        src={heroLogoWebp}
                        alt="Casa Bombora Logo"
                        priority
                        loading="eager"
                        sizes="400px"
                        style={{ width: logoSize, height: "auto", opacity: 0.7 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Second block: Animated text tagline - always completely separate */}
              <motion.div
                className="mt-8 md:mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <motion.p 
                  className="text-2xl md:text-5xl text-white text-center font-serif drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1, 
                    delay: 0.8,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }}
                >
                  Luxury Villa Investment in Uluwatu, Bali
                </motion.p>
              </motion.div>
            </>
          )}
        </div>
      </Container>
      
      {/* Scroll indicator - only rendered on client */}
      {isMounted && (
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            y: [0, 10, 20] 
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            delay: 1
          }}
        >
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="38" rx="11" stroke="#BF9880" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="#BF9880" />
          </svg>
        </motion.div>
      )}
    </section>
  );
}
