"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function CustomCursor() {
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Update mouse position
    const mouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
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

  // Motion values for high-perf mouse tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Slight smoothing for the outer cursor only (snappy to reduce lag)
  const xOuter = useSpring(x, { stiffness: 1500, damping: 40, mass: 0.3 });
  const yOuter = useSpring(y, { stiffness: 1500, damping: 40, mass: 0.3 });

  // Position offsets
  const xOuterOffset = useTransform(xOuter, (v) => v - 10);
  const yOuterOffset = useTransform(yOuter, (v) => v - 10);
  const xOuterOffsetHover = useTransform(xOuter, (v) => v - 18);
  const yOuterOffsetHover = useTransform(yOuter, (v) => v - 18);
  const xDotOffset = useTransform(x, (v) => v - 3);
  const yDotOffset = useTransform(y, (v) => v - 3);

  // Only show custom cursor on desktop devices
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    // Check if device is desktop (no touch)
    setIsDesktop(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      {/* Outer cursor */}
      <motion.div
        className="cursor-outer fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden sm:block"
        style={{
          x: cursorVariant === "hover" ? xOuterOffsetHover : xOuterOffset,
          y: cursorVariant === "hover" ? yOuterOffsetHover : yOuterOffset,
          backgroundColor:
            cursorVariant === "hover" ? "#009CBC" : "rgba(0, 156, 188, 0.2)",
          border: "1px solid rgba(0, 156, 188, 0.4)",
          mixBlendMode: cursorVariant === "hover" ? ("difference" as const) : ("normal" as const),
          height: cursorVariant === "hover" ? 36 : 20,
          width: cursorVariant === "hover" ? 36 : 20,
          opacity: cursorVariant === "hover" ? 0.6 : 0.5,
        }}
      />
      
      {/* Inner cursor dot */}
      <motion.div
        className="cursor-dot fixed top-0 left-0 rounded-full pointer-events-none z-[10000] hidden sm:block"
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", duration: 0.06 }}
        style={{
          x: xDotOffset,
          y: yDotOffset,
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
