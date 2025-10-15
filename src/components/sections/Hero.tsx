"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CasaLogo } from "@/components/icons/CasaLogo";

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
  
  // Get responsive logo size
  const logoSize = useResponsiveSize();
  
  // Only render the dynamic content after component has mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center pt-32 pb-24 md:py-0 relative overflow-hidden">
      {/* Hero SVG Background - positioned absolutely */}
      <div className="absolute inset-0 -z-20">
        {isMounted && (
          <>
            <div 
              className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-70"
              style={{ backgroundImage: "url('/images/backgrounds/Hero_bg.svg')" }}
            ></div>
            <div className="absolute inset-0 bg-alabaster/40 backdrop-blur-[2px]"></div>
          </>
        )}
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-alabaster/40 to-transparent"></div>
        
        {/* Animated background blur - only render on client */}
        {isMounted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 0.5,
              scale: 1,
              transition: { duration: 2, ease: "easeOut" }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-green/5 blur-3xl"
          />
        )}
      </div>
      
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
              {/* Large Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 1.5, 
                  ease: [0.25, 0.1, 0.25, 1.0],
                  delay: 0.2
                }}
                className="relative"
              >
                {/* Logo Glow Effect */}
                <motion.div
                  className="absolute -inset-10 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: "#BF9880" }}
                  animate={{ 
                    opacity: [0.15, 0.25, 0.15],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Main Logo */}
                <CasaLogo 
                  size={logoSize} 
                  color="#BF9880" 
                  className="relative z-10 drop-shadow-xl" 
                />
              </motion.div>
              
              {/* Animated text tagline */}
              <motion.p 
                className="mt-12 text-xl md:text-2xl text-gunmetal/80 text-center font-serif"
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
