import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, GraduationCap, User, LogOut, LayoutDashboard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";


const navLinks = [
  { name: "Home", path: "/" },
  { name: "Academics", path: "/academics" },
  { name: "Faculty", path: "/faculty" },
  { name: "Students", path: "/students" },
  { name: "Admission", path: "/admission" },
  { name: "Contact", path: "/contact" },
];

const MOBILE_BREAKPOINT = 770;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userRole, logout, getStatusMessage } = useAuth();
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Check viewport width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Focus trap and escape key handler
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handleTabTrap = (e) => {
      if (e.key !== "Tab" || !menuRef.current) return;
      
      const focusableElements = menuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabTrap);
    
    // Focus first menu item when opened
    const timer = setTimeout(() => {
      const firstLink = menuRef.current?.querySelector("a, button");
      firstLink?.focus();
    }, 100);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabTrap);
      clearTimeout(timer);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin";
      case "student":
        return "/student";
      case "parent":
        return "/parent";
      case "pending_student":
      case "pending_parent":
        return "/dashboard"; // Shows pending status
      default:
        return "/";
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const isPending = userRole === "pending_student" || userRole === "pending_parent";
  const statusMessage = getStatusMessage?.();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 sm:h-16 md:h-20 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 flex-shrink items-center gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
            <img
              src={logo}
              alt="Secondary Nav Kalika Shikshan Sansthan Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold text-primary sm:text-lg">Sec. Nav Kalika Shikashan Sansthan</span>
            <span className="hidden text-xs text-muted-foreground sm:block">Excellence in Education</span>
          </div>
        </Link>

        {/* Desktop Navigation (≥770px) */}
        {!isMobile && (
          <>
            <nav className="hidden items-center gap-0.5 lg:gap-1 min-[770px]:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`whitespace-nowrap px-2 py-2 text-sm font-medium transition-colors hover:text-primary lg:px-4 ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button (Desktop) */}
            <div className="hidden flex-shrink-0 items-center gap-1 lg:gap-2 min-[770px]:flex">
              {currentUser ? (
                <>
                  {isPending && (
                    <span className="mr-1 flex items-center gap-1 text-xs text-gold lg:mr-2">
                      <AlertCircle className="h-3 w-3" />
                      <span className="hidden lg:inline">Pending</span>
                    </span>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link to={getDashboardLink()}>
                      <LayoutDashboard className="h-4 w-4 lg:mr-2" />
                      <span className="hidden lg:inline">Dashboard</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">
                      <User className="h-4 w-4 lg:mr-2" />
                      <span className="hidden lg:inline">Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
                    <Link to="/admission">
                      <span className="hidden lg:inline">Apply Now</span>
                      <span className="lg:hidden">Apply</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Mobile Menu Button (<770px) */}
        {isMobile && (
          <button
            ref={menuButtonRef}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:h-10 sm:w-10 min-[770px]:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="main-menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        )}
      </div>

      {/* Mobile Navigation Menu (<770px) */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-14 z-40 bg-background/80 backdrop-blur-sm sm:top-16 md:top-20"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              id="main-menu"
              role="menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-full max-w-sm border-l border-border bg-background shadow-xl sm:top-16 sm:h-[calc(100vh-4rem)] md:top-20 md:h-[calc(100vh-5rem)]"
            >
              <nav className="flex h-full flex-col overflow-y-auto p-6">
                {/* Status message for pending users */}
                {currentUser && isPending && statusMessage && (
                  <div className="mb-4 rounded-lg border border-gold/30 bg-gold/5 p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <p className="text-sm text-muted-foreground">{statusMessage}</p>
                    </div>
                  </div>
                )}
                
                {/* Navigation Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      role="menuitem"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex rounded-lg px-4 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                        location.pathname === link.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-border" />

                {/* Auth Section */}
                <div className="space-y-3">
                  {currentUser ? (
                    <>
                      <Button asChild className="w-full" variant="outline">
                        <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} role="menuitem">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                          {isPending && <span className="ml-2 text-xs text-gold">(Pending)</span>}
                        </Link>
                      </Button>
                      <Button className="w-full" variant="ghost" onClick={handleLogout} role="menuitem">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="px-4 text-sm font-medium text-muted-foreground">Login Options</p>
                      <Button asChild className="w-full" variant="outline">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} role="menuitem">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          Student Login
                        </Link>
                      </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} role="menuitem">
                          <User className="mr-2 h-4 w-4" />
                          Parent Login
                        </Link>
                      </Button>
                      <div className="pt-2">
                        <Button asChild className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
                          <Link to="/admission" onClick={() => setIsMenuOpen(false)} role="menuitem">
                            Apply Now
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer info */}
                <div className="mt-auto pt-6">
                  <p className="text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Sec. NKSS School
                  </p>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
