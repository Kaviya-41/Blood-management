import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const WEBSITE_NAME = import.meta.env.VITE_WEBSITE_NAME;

export default function Header({ currentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // IntersectionObserver for active section highlighting (landing page only)
  useEffect(() => {
    if (!isLandingPage) return;

    const sectionIds = ["home", "about", "contact"];
    const observers = [];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(handleIntersect, {
          rootMargin: "-20% 0px -60% 0px",
          threshold: 0,
        });
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isLandingPage]);

  // Handle hash on page load (e.g. navigated from /about -> /#about)
  useEffect(() => {
    if (isLandingPage && location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isLandingPage, location.hash]);

  const navLinks = [
    { name: "Home", section: "home" },
    { name: "About", section: "about" },
    { name: "Contact", section: "contact" },
  ];

  const authLinks = currentUser
    ? [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Profile", path: "/profile" },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Register as Donor", path: "/register/donor" },
        { name: "Register as Facility", path: "/register/facility" },
      ];

  const handleNavClick = useCallback(
    (section) => {
      setMobileOpen(false);
      if (isLandingPage) {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(`/#${section}`);
      }
    },
    [isLandingPage, navigate],
  );

  const isActiveNav = (section) => {
    if (isLandingPage) return activeSection === section;
    if (section === "about") return location.pathname === "/about";
    if (section === "contact") return location.pathname === "/contact";
    return false;
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100" 
          : "bg-white/90 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Title */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path d="M12 2C12 2 6 8 6 12a6 6 0 0012 0c0-4-6-10-6-10z" />
              </svg>
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
                {WEBSITE_NAME}
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5 font-medium">
                Blood Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.section)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActiveNav(link.section)
                    ? "text-red-700 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
                {/* Animated underline */}
                {isActiveNav(link.section) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            
            {/* Auth Links */}
            {authLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  link.name.includes("Register")
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 hover:scale-105"
                    : isActiveLink(link.path)
                    ? "text-red-700 bg-red-50"
                    : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition-all duration-200 ${
              mobileOpen 
                ? "bg-red-50 text-red-600" 
                : "hover:bg-gray-100 text-gray-600"
            }`}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1/2 left-1/2 w-5 h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                mobileOpen ? "rotate-45" : "-translate-y-1.5"
              }`}></span>
              <span className={`absolute top-1/2 left-1/2 w-5 h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}></span>
              <span className={`absolute top-1/2 left-1/2 w-5 h-0.5 bg-current transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                mobileOpen ? "-rotate-45" : "translate-y-1.5"
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="border-t border-gray-200 pt-4 pb-6 px-3 bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-lg">
                {/* Main Navigation Links */}
                <div className="space-y-1 mb-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.section)}
                      className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActiveNav(link.section)
                          ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      }`}
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
                
                {/* Auth Links */}
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  {authLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        link.name.includes("Register")
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg text-center hover:shadow-xl"
                          : isActiveLink(link.path)
                          ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                          : "text-gray-700 hover:bg-gray-50 hover:text-red-600 text-center"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}