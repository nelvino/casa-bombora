"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Update mouse position
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Handle cursor effects based on hovered elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if hovering over clickable elements
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer")
      ) {
        setCursorVariant("hover");
        setIsHovering(true);
      } else {
        setCursorVariant("default");
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Only show custom cursor on desktop devices
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    // Check if device is desktop (no touch)
    setIsDesktop(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!isDesktop) return null;

  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      opacity: 0.5,
      height: 20,
      width: 20,
    },
    hover: {
      x: mousePosition.x - 18,
      y: mousePosition.y - 18,
      height: 36,
      width: 36,
      opacity: 0.6,
      backgroundColor: "#009CBC",
      mixBlendMode: "difference" as "difference",
    },
  };

  return (
    <>
      {/* Outer cursor */}
      <motion.div
        className="cursor-outer fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden sm:block"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
          mass: 0.5,
        }}
        style={{ 
          backgroundColor: "rgba(0, 156, 188, 0.2)",
          border: "1px solid rgba(0, 156, 188, 0.4)",
        }}
      />
      
      {/* Inner cursor dot */}
      <motion.div
        className="cursor-dot fixed top-0 left-0 rounded-full pointer-events-none z-[10000] hidden sm:block"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 28,
        }}
        style={{ 
          height: 6, 
          width: 6, 
          backgroundColor: "#009CBC",
        }}
      />
      
      <style jsx global>{`
        body {
          cursor: ${isDesktop ? 'none' : 'auto'};
        }
        
        a, button, .cursor-pointer {
          cursor: ${isDesktop ? 'none' : 'pointer'};
        }
      `}</style>
    </>
  );
}
