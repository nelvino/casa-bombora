"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Building, Landmark, Home, PenTool, Construction, Settings } from "lucide-react";
import { useScrollAnimation, fadeInUpVariants, staggerChildrenVariants } from "@/hooks/useScrollAnimation";

const services = [
  {
    title: "Land Acquisition",
    description: "We help you find and secure the perfect plot of land in Uluwatu, handling all legal aspects of land lease agreements.",
    icon: Landmark,
  },
  {
    title: "Legal Services",
    description: "Our team handles all legal requirements including company formation, permits, and bank account setup in Indonesia.",
    icon: Building,
  },
  {
    title: "Architecture & Design",
    description: "Our award-winning architects create stunning villa designs that maximize views, space, and investment potential.",
    icon: PenTool,
  },
  {
    title: "Construction",
    description: "Expert construction management with weekly progress reports, quality control, and transparent communication.",
    icon: Construction,
  },
  {
    title: "Interior Design",
    description: "Curated interior design that blends luxury with Balinese elements to create an unforgettable living experience.",
    icon: Home,
  },
  {
    title: "Property Management",
    description: "Comprehensive property management services to maximize your rental income and maintain your investment.",
    icon: Settings,
  },
];

export function Services() {
  const headingAnimation = useScrollAnimation({ threshold: 0.1 });
  const servicesAnimation = useScrollAnimation({ threshold: 0.05 });
  const buttonAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="services" className="py-8 md:py-20 bg-alabaster relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-green/5 blur-3xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            transition: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        />
        <motion.div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-lion/5 blur-3xl"
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.5, 0.2],
            transition: {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }
          }}
        />
      </div>
      
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4"
              variants={fadeInUpVariants}
            >
              Our <span className="text-blue-green">Services</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gunmetal/80"
              variants={fadeInUpVariants}
            >
              From finding the perfect land to managing your completed villa, we provide a complete end-to-end solution for your investment in Bali.
            </motion.p>
          </motion.div>
        </div>
        
        <motion.div
          ref={servicesAnimation.ref}
          initial="hidden"
          animate={servicesAnimation.controls}
          variants={staggerChildrenVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  }
                })
              }}
              custom={index}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                transition: { duration: 0.3 } 
              }}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 transition-all relative overflow-hidden group"
            >
              <motion.div 
                className="absolute inset-0 bg-blue-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />

              <motion.div 
                className="inline-flex items-center justify-center w-12 h-12 bg-blue-green/10 text-blue-green rounded-lg mb-6 relative z-10"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(0, 156, 188, 0.2)",
                  transition: { duration: 0.3 } 
                }}
              >
                <service.icon className="h-6 w-6" />
              </motion.div>

              <h3 className="text-xl font-medium mb-3 relative z-10">{service.title}</h3>
              <p className="text-gunmetal/70 mb-6 relative z-10">{service.description}</p>
              
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <Button variant="ghost" className="text-blue-green p-0 h-auto hover:bg-transparent hover:underline">
                  Learn more
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          ref={buttonAnimation.ref}
          initial="hidden"
          animate={buttonAnimation.controls}
          variants={fadeInUpVariants}
          transition={{ delay: 0.7 }}
        >
          <Button size="lg" className="relative overflow-hidden group">
            <span className="relative z-10">View All Services</span>
            <motion.div 
              className="absolute inset-0 bg-lion z-0"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
