"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// Define testimonials outside the component to avoid re-creation on render
const testimonialData = [
  {
    quote: "Casa Bombora handled every detail of my villa investment. Their professionalism and transparency gave me complete peace of mind throughout the process.",
    name: "Michael Thompson",
    title: "Investor from Melbourne",
    image: "/images/testimonial-1.jpg",
  },
  {
    quote: "The ROI has exceeded my expectations. The quality of construction and attention to detail is truly remarkable. I couldn't be happier with my investment.",
    name: "Sarah Johnson",
    title: "Investor from Sydney",
    image: "/images/testimonial-2.jpg",
  },
  {
    quote: "From start to finish, Casa Bombora delivered exactly what they promised. The weekly updates kept me informed, and the final result is stunning.",
    name: "Pedro Gonzalez",
    title: "Investor from Colombia",
    image: "/images/testimonial-3.jpg",
  },
];

export function Testimonials() {
  // Use client-side state to prevent hydration mismatch
  const [testimonials, setTestimonials] = useState<typeof testimonialData>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Only set the data after component has mounted on the client
  useEffect(() => {
    setIsClient(true);
    setTestimonials(testimonialData);
  }, []);
  
  return (
    <section id="testimonials" className="py-24 bg-lion/10">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
              What Our <span className="text-blue-green">Clients Say</span>
            </h2>
            <p className="text-lg text-gunmetal/80">
              Don't take our word for it — hear from investors who have already realized their dreams.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isClient && testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6 text-blue-green">
                <Quote className="h-8 w-8" />
              </div>
              <p className="text-lg italic mb-6 text-gunmetal/90">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                  {/* Image placeholder */}
                </div>
                <div>
                  <p className="font-medium text-gunmetal">{testimonial.name}</p>
                  <p className="text-sm text-gunmetal/70">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Skeleton state for SSR */}
          {!isClient && (
            <>
              <div className="bg-white p-8 rounded-lg shadow-sm animate-pulse">
                <div className="h-8 w-8 bg-gray-200 mb-6 rounded"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 mb-6 rounded w-2/3"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 mb-2 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm animate-pulse">
                <div className="h-8 w-8 bg-gray-200 mb-6 rounded"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 mb-6 rounded w-2/3"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 mb-2 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm animate-pulse">
                <div className="h-8 w-8 bg-gray-200 mb-6 rounded"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 mb-6 rounded w-2/3"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <div className="h-4 bg-gray-200 mb-2 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
