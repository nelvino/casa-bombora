"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Mail, 
  Phone, 
  ChevronRight,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSmoothScrollHandler } from "@/lib/utils/smoothScroll";
import { CasaLogo } from "@/components/icons/CasaLogo";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "#services" },
  { name: "Our Process", href: "#process" },
  { name: "Projects", href: "#projects" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [pastHeroSection, setPastHeroSection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [logoHovered, setLogoHovered] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const smoothScrollHandler = createSmoothScrollHandler(80);
  
  useEffect(() => {
    const handleScroll = () => {
      // Update isScrolled state based on scroll position
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Check if we've scrolled past the hero section
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setPastHeroSection(heroBottom < 0);
      }
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => {
        if (link.href.startsWith('#')) {
          const el = document.getElementById(link.href.substring(1));
          if (el) {
            const rect = el.getBoundingClientRect();
            return { 
              href: link.href, 
              top: rect.top + window.scrollY,
              bottom: rect.bottom + window.scrollY 
            };
          }
        }
        return null;
      }).filter(Boolean);
      
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      // Find the current active section
      for (const section of sections) {
        if (section && scrollPosition >= section.top && scrollPosition <= section.bottom) {
          setActiveLink(section.href);
          break;
        } else if (scrollPosition < (sections[0]?.top || 0)) {
          setActiveLink("/"); // At the top of the page
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Run once to initialize
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      setActiveLink(href);
      smoothScrollHandler(e);
      setMenuOpen(false);
    }
  };

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };
  
  return (
    <>
      <motion.header 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100]", 
          "py-4 transition-all duration-300",
          isScrolled ? "bg-alabaster/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Left section - text logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <Link href="/" className="flex items-center group">
                <motion.span 
                  className="font-serif text-2xl font-semibold text-gunmetal hidden md:block"
                  whileHover={{ 
                    color: "rgb(0, 156, 188)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="text-blue-green">C</span>asa <span className="text-blue-green">B</span>ombora
                </motion.span>
              </Link>
            </motion.div>
            
            {/* Center section - SVG logo (only visible after scrolling past hero section) */}
            <AnimatePresence>
              {pastHeroSection && (
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10"
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  <Link href="/" className="block relative">
                    <motion.div
                      onMouseEnter={() => setLogoHovered(true)}
                      onMouseLeave={() => setLogoHovered(false)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CasaLogo 
                        size={isScrolled ? 42 : 48} 
                        color="#009CBC"
                        className="transition-all duration-300 relative z-10" 
                      />
                      <motion.div 
                        className="absolute -inset-2 bg-alabaster/60 rounded-full -z-10"
                        animate={{ 
                          scale: logoHovered ? 1.15 : 1,
                          opacity: logoHovered || isScrolled ? 0.8 : 0
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Right section - contact button and menu */}
            <div className="flex items-center justify-end space-x-6 flex-1">
              {/* Optional contact button always visible */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="hidden sm:block"
              >
                <Button 
                  variant="default" 
                  size="default" 
                  className="flex items-center space-x-2 px-5 group"
                  onClick={handleContactClick}
                >
                  <span>Contact</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronRight className="h-4 w-4 group-hover:text-white transition-colors" />
                  </motion.div>
                </Button>
              </motion.div>
              
              {/* Menu button - always visible on all screen sizes */}
              <motion.button 
                type="button"
                className="p-2 z-[9999] relative" /* Increased z-index */
                onClick={() => setMenuOpen(!menuOpen)}
                onMouseEnter={() => setMenuHovered(true)}
                onMouseLeave={() => setMenuHovered(false)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button background effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full bg-blue-green/10"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: menuHovered ? 1 : 0,
                    opacity: menuHovered ? 1 : 0 
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <AnimatePresence mode="wait">
                  {menuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-50"
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </Container>
      </motion.header>
      
      {/* Move menu outside of the header for proper stacking context */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              className="fixed inset-0 bg-gunmetal/40 backdrop-blur-sm z-[9990]" /* Dramatically increased z-index */
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            
            {/* Menu panel - slides in from RIGHT side */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-alabaster z-[9995] shadow-2xl overflow-y-auto" /* Even higher z-index */
              initial={{ x: "100%" }} /* Slides from right */
              animate={{ x: 0 }}
              exit={{ x: "100%" }} /* Exits to right */
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
              style={{ position: 'fixed' }}
            >
              {/* Subtle pattern background */}
              <motion.div 
                className="absolute inset-0 opacity-[0.03]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.03 }}
                transition={{ duration: 1 }}
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231D2632' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />
              
              {/* Decorative accent line - on left side */}
              <motion.div 
                className="absolute top-0 left-0 bottom-0 w-1 bg-blue-green/20"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                style={{ transformOrigin: "top" }}
              />
              
              {/* Close button - added to the top-right corner inside the menu */}
              <motion.button
                className="absolute top-4 right-4 p-3 rounded-full bg-gunmetal/5 hover:bg-gunmetal/10 transition-colors z-10"
                onClick={() => setMenuOpen(false)}
                onMouseEnter={() => setCloseHovered(true)}
                onMouseLeave={() => setCloseHovered(false)}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                aria-label="Close menu"
              >
                <X className={`h-5 w-5 ${closeHovered ? 'text-blue-green' : 'text-gunmetal'} transition-colors`} />
              </motion.button>
              
              <div className="p-8 pt-20 pb-12 h-full flex flex-col relative">
                {/* Logo in menu */}
                <motion.div 
                  className="mb-10 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CasaLogo size={36} color="#009CBC" className="mr-3" />
                  <div>
                    <div className="font-serif text-2xl font-semibold">
                      <span className="text-blue-green">Casa</span> <span className="text-gunmetal">Bombora</span>
                    </div>
                    <p className="text-sm text-gunmetal/60 mt-1">Luxury Villa Investment in Bali</p>
                  </div>
                </motion.div>
                
                {/* Navigation links */}
                <motion.nav 
                  className="flex flex-col space-y-6"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                  }}
                >
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      variants={{
                        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                        hidden: { opacity: 0, x: 30, transition: { duration: 0.3 } }
                      }}
                      className="overflow-hidden"
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center text-gunmetal hover:text-blue-green transition-colors text-2xl md:text-3xl font-serif font-medium py-2 relative group ${activeLink === link.href ? 'text-blue-green' : ''}`}
                        onClick={handleNavLinkClick}
                      >
                        {activeLink === link.href && (
                          <motion.span 
                            className="absolute -left-5 top-1/2 transform -translate-y-1/2 text-blue-green"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Compass className="h-4 w-4" />
                          </motion.span>
                        )}
                        {link.name}
                        <motion.span 
                          className={`absolute left-0 bottom-0 h-[2px] bg-blue-green ${activeLink === link.href ? 'w-10' : 'w-0 group-hover:w-10'}`}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>
                
                {/* Contact section */}
                <div className="mt-auto pt-10">
                  <motion.div
                    variants={{
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } },
                      hidden: { opacity: 0, y: 20, transition: { duration: 0.3 } }
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="mb-8">
                      <h4 className="text-lg font-medium mb-4 text-gunmetal">Get in touch</h4>
                      <div className="space-y-3">
                        <a href="mailto:info@casabombora.com" className="text-gunmetal hover:text-blue-green flex items-center group">
                          <div className="bg-blue-green/10 p-2 rounded-full mr-3 group-hover:bg-blue-green/20 transition-colors">
                            <Mail className="h-4 w-4 text-blue-green group-hover:scale-110 transition-transform" />
                          </div>
                          <span>info@casabombora.com</span>
                        </a>
                        <a href="tel:+6281234567890" className="text-gunmetal hover:text-blue-green flex items-center group">
                          <div className="bg-blue-green/10 p-2 rounded-full mr-3 group-hover:bg-blue-green/20 transition-colors">
                            <Phone className="h-4 w-4 text-blue-green group-hover:scale-110 transition-transform" />
                          </div>
                          <span>+62 812 3456 7890</span>
                        </a>
                      </div>
                    </div>
                    
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full relative overflow-hidden group"
                      onClick={handleContactClick}
                    >
                      <span className="relative z-10">Contact Us</span>
                      <motion.div 
                        className="absolute inset-0 bg-gunmetal z-0"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    </Button>
                  </motion.div>
                </div>
                
                {/* Social links */}
                <motion.div 
                  className="flex mt-8 space-x-4 items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-gunmetal/70 mr-2">Follow us:</p>
                  <motion.a 
                    href="#" 
                    className="text-gunmetal hover:text-blue-green p-2 hover:bg-blue-green/5 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gunmetal hover:text-blue-green p-2 hover:bg-blue-green/5 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gunmetal hover:text-blue-green p-2 hover:bg-blue-green/5 rounded-full transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.a>
                </motion.div>
                
                {/* Copyright or additional info */}
                <div className="mt-8 text-xs text-gunmetal/50">
                  © {new Date().getFullYear()} Casa Bombora. All rights reserved.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
