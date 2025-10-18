"use client";

import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useScrollAnimation, fadeInUpVariants } from "@/hooks/useScrollAnimation";

const phases = [
  {
    number: 1,
    title: "Pre-Design Phase",
    description: "Initial consultation and project planning",
    items: [
      "Client signs Letter of Intent and initiates land lease purchase",
      "Legal services: notary, topography, land checks, and permits",
      "Kick-off meetings with Construction & Design team to align on vision and goals",
      "Preliminary cost estimate & methodology overview",
      "Initial project breakdown and timeline",
    ],
  },
  {
    number: 2,
    title: "Design Phase",
    description: "Creating your dream villa on paper",
    items: [
      "Schematic Design & Concept Illustrations",
      "Topographical Survey & Soil Testing",
      "Technical & Construction Drawings (Architecture, Structure, MEP, etc.)",
    ],
  },
  {
    number: 3,
    title: "Construction Phase",
    description: "Bringing your vision to life",
    items: [
      "Construction execution: Preliminaries, Structure, Architecture, MEP & HVAC",
      "Interior production & procurement estimates (custom furniture, appliances, electronics, loose furniture, landscaping)",
    ],
  },
  {
    number: 4,
    title: "Keys",
    description: "Completing your investment journey",
    items: [
      "Handover of the completed villa to the owner",
      "3-month guarantee period for testing appliances, installations, and functionality",
      "Assistance connecting with management company for rental operations (optional)",
      "Final documentation, warranties, and project close-out",
    ],
  },
];

export function Process() {
  const headingAnimation = useScrollAnimation({ threshold: 0.1 });
  const timelineAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="process" className="pt-8 !pb-20 md:py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231D2632' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

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
              Our <span className="text-blue-green">Process</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gunmetal/80"
              variants={fadeInUpVariants}
            >
              We've perfected a streamlined process to deliver exceptional villas while keeping you informed every step of the way.
            </motion.p>
          </motion.div>
        </div>
        
        <div 
          className="space-y-12 md:space-y-16 relative"
          ref={timelineAnimation.ref}
        >
          {/* Timeline line */}
          <motion.div 
            className="absolute top-0 bottom-0 left-[49px] md:left-1/2 w-0.5 bg-blue-green/20 -ml-px hidden md:block"
            initial={{ height: 0 }}
            animate={timelineAnimation.controls}
            variants={{
              hidden: { height: 0 },
              visible: { height: '100%', transition: { duration: 1.5, ease: "easeOut" } }
            }}
          />
          
          {phases.map((phase, index) => (
            <div key={phase.number} className="relative">
              <motion.div
                initial="hidden"
                animate={timelineAnimation.controls}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { 
                      delay: 0.5 + (index * 0.2),
                    } 
                  }
                }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-8`}
              >
                {/* Phase number */}
                <motion.div 
                  className="flex-none z-10"
                  variants={{
                    hidden: { scale: 0.8, opacity: 0 },
                    visible: { 
                      scale: 1, 
                      opacity: 1,
                      transition: { 
                        duration: 0.5,
                        delay: 0.7 + (index * 0.2),
                        type: "spring",
                        stiffness: 200,
                      }
                    }
                  }}
                >
                  <motion.div 
                    className="flex items-center justify-center w-24 h-24 bg-blue-green text-white rounded-full font-serif text-4xl"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(0, 156, 188, 0.3)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    {phase.number}
                  </motion.div>
                </motion.div>
                
                {/* Phase content */}
                <motion.div 
                  className="flex-1 bg-alabaster p-8 rounded-lg shadow-sm"
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      x: index % 2 === 0 ? 50 : -50,
                      y: 20
                    },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      y: 0,
                      transition: { 
                        duration: 0.7,
                        delay: 0.7 + (index * 0.2),
                        ease: [0.25, 0.1, 0.25, 1.0],
                      }
                    }
                  }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <h3 className="text-2xl font-serif mb-2 text-gunmetal">{phase.title}</h3>
                  <p className="text-gunmetal/70 mb-6">{phase.description}</p>
                  
                  <motion.ul 
                    className="space-y-3"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { 
                        opacity: 1,
                        transition: { 
                          staggerChildren: 0.1,
                          delayChildren: 1 + (index * 0.2),
                        }
                      }
                    }}
                  >
                    {phase.items.map((item, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start"
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { 
                            opacity: 1, 
                            x: 0,
                            transition: { duration: 0.5 }
                          }
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2, color: "#009CBC" }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <CheckCircle className="h-5 w-5 text-blue-green flex-shrink-0 mt-0.5 mr-3" />
                        </motion.div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
