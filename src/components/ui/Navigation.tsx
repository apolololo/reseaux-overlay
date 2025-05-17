
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, firstName, SignInButton, SignUpButton, UserButton, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Réalisations", path: "/realisations" },
    { name: "À propos", path: "/a-propos" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const menuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "py-3 backdrop-blur-xl bg-black/40 border-b border-white/10" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 relative z-50"
          >
            <img 
              src="/lovable-uploads/15bf8621-1434-4e12-9075-cc5cf2be4dec.png" 
              alt="CME Logo" 
              className="h-10 w-auto object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative px-1",
                  isActive(link.path) 
                    ? "text-cme-gold after:absolute after:bottom-[-3px] after:left-0 after:w-full after:h-0.5 after:bg-cme-gold after:rounded-full" 
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Contact Button & Auth (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:0123456789"
              className="flex items-center bg-white/5 hover:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 transition-colors text-white"
            >
              <Phone className="h-4 w-4 text-cme-gold mr-2" />
              <span>01 23 45 67 89</span>
            </a>
            
            {isSignedIn ? (
              <div className="flex items-center">
                <Link to="/profile" className="mr-2 flex items-center bg-white/5 hover:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 transition-colors text-white">
                  <User className="h-4 w-4 text-cme-gold mr-2" />
                  <span>{firstName || "Mon compte"}</span>
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="py-2 px-4 text-sm bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full border border-white/10 transition-colors text-white">
                  Connexion
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 rounded-full text-sm flex items-center">
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 relative z-50"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 z-40 backdrop-blur-3xl bg-gradient-to-b from-black/70 to-cme-navy/60 pt-24"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="container px-6 mx-auto backdrop-blur-3xl bg-black/30 rounded-xl border border-white/10 py-6">
              <motion.nav className="flex flex-col">
                <div className="space-y-2 mb-8">
                  {navLinks.map((link) => (
                    <motion.div key={link.name} variants={itemVariants}>
                      <Link
                        to={link.path}
                        className={cn(
                          "py-3 px-4 text-lg flex items-center rounded-lg transition-colors",
                          isActive(link.path) 
                            ? "bg-white/15 backdrop-blur-md text-cme-gold font-semibold" 
                            : "text-white hover:bg-white/10 hover:backdrop-blur-md hover:text-white"
                        )}
                      >
                        <span>{link.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div variants={itemVariants} className="space-y-3">
                  <a
                    href="tel:0123456789"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/15 backdrop-blur-md rounded-lg text-white text-center"
                  >
                    <Phone className="h-5 w-5 text-cme-gold" />
                    <span>01 23 45 67 89</span>
                  </a>
                  
                  {isSignedIn ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 bg-white/15 backdrop-blur-md rounded-lg text-white text-center"
                      >
                        Mon compte
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full px-4 py-3 bg-gradient-to-r from-cme-navy to-cme-gold rounded-lg text-white text-center font-medium"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-3 bg-white/15 backdrop-blur-md rounded-lg text-white text-center"
                      >
                        Connexion
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-3 bg-gradient-to-r from-cme-navy to-cme-gold rounded-lg text-white text-center font-medium"
                      >
                        Inscription
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navigation;
