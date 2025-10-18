"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useScrollAnimation, fadeInUpVariants } from "@/hooks/useScrollAnimation";

export function CTA() {
  const headingAnimation = useScrollAnimation();
  const ctaAnimation = useScrollAnimation();

  return (
    <section className="py-8 md:py-20 bg-gunmetal text-alabaster relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        {/* Animated gradient blur */}
        <motion.div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-green/10 blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        />
        
        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-green/5 blur-3xl"
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        />
        
        {/* Subtle particle effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-1 h-1 rounded-full bg-alabaster/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                y: [-20, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            ref={headingAnimation.ref}
            initial="hidden"
            animate={headingAnimation.controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                }
              }
            }}
          >
            <div className="overflow-hidden">
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6"
                variants={{
                  hidden: { y: 100 },
                  visible: { 
                    y: 0,
                    transition: { 
                      duration: 1.2, 
                      ease: [0.25, 0.1, 0.25, 1.0]
                    }
                  }
                }}
              >
                Ready to Invest in Your Dream <span className="text-blue-green">Bali Villa?</span>
              </motion.h2>
            </div>
            
            <motion.p 
              className="text-xl text-alabaster/80 mb-8 max-w-2xl mx-auto"
              variants={fadeInUpVariants}
              transition={{ delay: 0.3 }}
            >
              Schedule a consultation with our investment specialists to start your journey towards owning a high-return luxury villa in paradise.
            </motion.p>
          </motion.div>
          
          <motion.div
            ref={ctaAnimation.ref}
            initial="hidden"
            animate={ctaAnimation.controls}
            variants={fadeInUpVariants}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="bg-blue-green hover:bg-blue-green/90 relative overflow-hidden group"
            >
              <span className="relative z-10">Schedule Consultation</span>
              <motion.div 
                className="absolute inset-0 bg-white/10 z-0"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ 
                  scale: 2.5, 
                  opacity: 0.5,
                  transition: { duration: 0.7 } 
                }}
                style={{ 
                  borderRadius: "9999px",
                  transformOrigin: "center center" 
                }}
              />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-alabaster text-alabaster hover:bg-alabaster/10 relative overflow-hidden"
            >
              <span className="relative z-10">Download Brochure</span>
              <motion.div 
                className="absolute inset-0 bg-alabaster z-0"
                initial={{ x: '-100%' }}
                whileHover={{ 
                  x: 0,
                  transition: { duration: 0.3 } 
                }}
              />
              <motion.span 
                className="absolute inset-0 flex items-center justify-center z-20 text-gunmetal opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 1,
                  transition: { duration: 0.2, delay: 0.1 } 
                }}
              >
                Download Brochure
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
