"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-alabaster">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
              Get in <span className="text-blue-green">Touch</span>
            </h2>
            <p className="text-lg text-gunmetal/80 mb-8">
              Whether you're ready to invest or just exploring options, our team is here to answer all your questions about investing in Bali.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-green/10 p-3 rounded-lg mr-4">
                  <MapPin className="h-6 w-6 text-blue-green" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-gunmetal/70">Uluwatu, Bali, Indonesia</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-green/10 p-3 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-blue-green" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <p className="text-gunmetal/70">info@casabombora.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-green/10 p-3 rounded-lg mr-4">
                  <Phone className="h-6 w-6 text-blue-green" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone</h4>
                  <p className="text-gunmetal/70">+62 123 456 7890</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <h3 className="text-2xl font-serif mb-6">Send us a message</h3>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gunmetal mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-green"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gunmetal mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-green"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gunmetal mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-green"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gunmetal mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-green"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gunmetal mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-green"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-green focus:border-blue-green focus:ring focus:ring-offset-0 focus:ring-blue-green focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gunmetal/70">
                    I agree to receive occasional newsletters and updates
                  </span>
                </label>
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
