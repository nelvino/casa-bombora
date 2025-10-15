"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useScrollAnimation, fadeInVariants, fadeInUpVariants } from "@/hooks/useScrollAnimation";

export function Introduction() {
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1 });
  const ctaAnimation = useScrollAnimation({ threshold: 0.1 });
  const statsAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="introduction" className="py-24 bg-alabaster relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Subtle floating elements */}
        <motion.div
          animate={{
            y: [0, 15, 0],
            opacity: [0.4, 0.5, 0.4],
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
          className="absolute top-[30%] left-[20%] w-32 h-32 rounded-full bg-lion/10 blur-3xl"
        />
        
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.4, 0.3],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
          className="absolute bottom-[30%] right-[20%] w-48 h-48 rounded-full bg-moss-green/10 blur-3xl"
        />
      </div>
      
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            ref={titleAnimation.ref}
            initial="hidden"
            animate={titleAnimation.controls}
            variants={fadeInVariants}
            className="overflow-hidden"
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-2"
              variants={{
                hidden: { y: 80 },
                visible: { 
                  y: 0,
                  transition: { 
                    duration: 1.2, 
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }
                }
              }}
            >
              Invest in Your <span className="text-blue-green">Dream Villa</span> in Uluwatu, Bali
            </motion.h2>
          </motion.div>
          
          <motion.div
            ref={subtitleAnimation.ref}
            initial="hidden"
            animate={subtitleAnimation.controls}
            variants={fadeInUpVariants}
            transition={{ delay: 0.4 }}
            className="overflow-hidden"
          >
            <p className="text-lg md:text-xl text-gunmetal/80 mb-8 max-w-2xl mx-auto mt-6">
              End-to-end luxury villa investment with guaranteed 16-20% annual ROI. From land acquisition to property management, we handle everything.
            </p>
          </motion.div>
          
          <motion.div
            ref={ctaAnimation.ref}
            initial="hidden"
            animate={ctaAnimation.controls}
            variants={fadeInUpVariants}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="relative overflow-hidden group">
              <span className="relative z-10">Start Your Investment</span>
              <motion.div 
                className="absolute inset-0 bg-blue-green/90 z-0"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </Button>
            <Button variant="outline" size="lg" className="group">
              Learn More
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <ChevronRight className="ml-2 h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div
            ref={statsAnimation.ref}
            initial="hidden"
            animate={statsAnimation.controls}
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { 
                  staggerChildren: 0.2,
                  delayChildren: 0.8
                } 
              }
            }}
            className="mt-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { stat: "16-20%", label: "Annual ROI" },
                { stat: "100+", label: "Projects Completed" },
                { stat: "10+ Years", label: "Experience" },
                { stat: "24/7", label: "Customer Support" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="text-center relative"
                  variants={fadeInUpVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3 } 
                  }}
                >
                  <div className="relative z-10">
                    <p className="font-serif text-3xl md:text-4xl font-medium text-blue-green">{item.stat}</p>
                    <p className="text-gunmetal/70 mt-2">{item.label}</p>
                  </div>
                  
                  {/* Card hover background effect */}
                  <motion.div 
                    className="absolute -inset-4 rounded-lg bg-gunmetal/5 opacity-0 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
