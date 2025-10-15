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
      
      {/* Initial page load animation overlay */}
      {isFirstMount && (
        <motion.div
          className="fixed inset-0 z-[100] bg-alabaster flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1.0], delay: 0.3 }}
          onAnimationComplete={() => document.body.classList.remove("overflow-hidden")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-blue-green">Casa Bombora</h1>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
