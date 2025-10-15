"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    // After first mount, set isFirstMount to false
    const timer = setTimeout(() => {
      setIsFirstMount(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <motion.div
        key={pathname}
        initial={isFirstMount ? "initialState" : "animate"}
        animate="animate"
        exit="exit"
        variants={{
          initialState: {
            opacity: 0,
          },
          animate: {
            opacity: 1,
            transition: {
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
          exit: {
            opacity: 0,
            transition: {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1.0],
            },
          },
        }}
      >
        {children}
      </motion.div>
      
      {/* Initial page load animation overlay with spinner */}
      {isFirstMount && (
        <motion.div
          className="fixed inset-0 z-[100] bg-alabaster flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1.0], delay: 0.8 }}
          onAnimationComplete={() => document.body.classList.remove("overflow-hidden")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Brand-colored spinner animation */}
            <div className="w-16 h-16 md:w-20 md:h-20 relative">
              {/* Outer spinner ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-t-transparent border-r-lion border-b-blue-green border-l-moss-green"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Inner dot */}
              <motion.div 
                className="absolute top-1/2 left-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-lion -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
