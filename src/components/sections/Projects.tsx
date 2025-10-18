"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import villa1 from "@/images/villa-1.png";
import villa2 from "@/images/villa-2.png";
import villa3 from "@/images/villa-3.jpeg";

const projects = [
  {
    title: "Villa Serenity",
    description: "Thoughtfully designed 1‑story, 1‑bedroom villa with a cosy indoor–outdoor flow. A private backyard pool with a sunbed creates a calm retreat for lazy afternoons and evening dips.",
    imageSrc: villa1,
    roi: "19% annual ROI",
    location: "Uluwatu Cliff",
  },
  {
    title: "Casa Azul",
    description: "Compact mezzanine concept: bedroom upstairs for privacy; open living room and kitchen downstairs for relaxed entertaining. Lush greenery frames a backyard pool with sunbed and an outdoor bath for spa‑like evenings.",
    imageSrc: villa3,
    roi: "18% annual ROI",
    location: "Bingin Beach",
  },
  {
    title: "Villa Horizon",
    description: "Elegant 2‑story, 2‑bedroom layout—one bedroom on each level. An upper‑level terrace features a soaking bath; below, a beautiful backyard pool with sunbed and outdoor shower completes the resort vibe.",
    imageSrc: villa2,
    roi: "17% annual ROI",
    location: "Padang Padang",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-8 md:py-20 bg-alabaster">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              Our <span className="text-blue-green">Projects</span>
            </h2>
            <p className="text-lg text-gunmetal/80">
              Explore our portfolio of successful villa investments delivering exceptional returns.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-md group"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gunmetal/30 z-10" />
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  priority={index === 0}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-serif">{project.title}</h3>
                  <span className="text-blue-green font-medium text-sm">{project.roi}</span>
                </div>
                <p className="text-gunmetal/70 mb-3">{project.description}</p>
                <div className="flex items-center text-sm text-gunmetal/60 mb-5">
                  <span>{project.location}</span>
                </div>
                <Button variant="outline" className="w-full group">
                  View Project
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg">View All Projects</Button>
        </div>
      </Container>
    </section>
  );
}
