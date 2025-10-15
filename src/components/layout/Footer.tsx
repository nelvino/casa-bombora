import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gunmetal text-alabaster pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-serif text-2xl mb-4">Casa Bombora</h3>
            <p className="text-alabaster/80 mb-4">
              Your end-to-end solution for luxury villa investment in Uluwatu, Bali.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" target="_blank" rel="noreferrer" 
                className="text-alabaster/80 hover:text-blue-green transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noreferrer"
                className="text-alabaster/80 hover:text-blue-green transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="text-alabaster/80 hover:text-blue-green transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Services', 'Our Process', 'Projects', 'About', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href={`/#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-alabaster/80 hover:text-blue-green transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-medium text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              {['Land Acquisition', 'Legal Services', 'Architecture & Design', 'Construction', 'Interior Design', 'Property Management'].map((service) => (
                <li key={service}>
                  <Link href="/#services"
                    className="text-alabaster/80 hover:text-blue-green transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-medium text-lg mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-green flex-shrink-0 mt-1" />
                <span className="text-alabaster/80">
                  Uluwatu, Bali, Indonesia
                </span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-blue-green flex-shrink-0 mt-1" />
                <span className="text-alabaster/80">
                  +62 123 456 7890
                </span>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-blue-green flex-shrink-0 mt-1" />
                <span className="text-alabaster/80">
                  info@casabombora.com
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-alabaster/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-alabaster/60">
              © {new Date().getFullYear()} Casa Bombora. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-sm text-alabaster/60 hover:text-blue-green">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-alabaster/60 hover:text-blue-green">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
