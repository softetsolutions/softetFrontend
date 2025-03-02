import { useState } from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo.jpeg";
import { motion } from "framer-motion";

const navItems = [
  { label: "Services", refKey: "servicesRef" },
  { label: "Testimonials", refKey: "testimonialsRef" },
  { label: "About Us", refKey: "aboutUsRef" },
  { label: "Our Tools", refKey: "toolsRef" },
  { label: "Contact", refKey: "contactRef" },
];

//  hamburger button component
const MenuButton = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
       className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#0B3B6A] focus-visible:outline-none transition-colors relative"
      aria-expanded={isOpen}
      aria-label="Toggle menu"
    >
      <div className="relative w-6 h-6">
        <motion.span
          className="absolute top-2 left-0 w-6 h-0.5 bg-gray-600 rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 4 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.6, 0.05, 0.01, 0.9],
          }}
        />
        <motion.span
          className="absolute top-4 left-0 w-6 h-0.5 bg-gray-600 rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? 8 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.6, 0.05, 0.01, 0.9],
          }}
        />
        <motion.span
          className="absolute top-6 left-0 w-6 h-0.5 bg-gray-600 rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -4 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: [0.6, 0.05, 0.01, 0.9],
          }}
        />
      </div>
    </button>
  )
}

export function Navbar({ scrollToSection, heroRef, servicesRef, testimonialsRef, aboutUsRef, toolsRef, contactRef, isLoginRequired }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mapping refKey to actual useRef
  const refMap = {
    heroRef,
    servicesRef,
    testimonialsRef,
    aboutUsRef,
    toolsRef,
    contactRef,
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a href="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Softet solutions logo"
                loading="lazy"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] object-contain rounded-xl"
              />
            </a>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[#0B3B6A] whitespace-nowrap">
              Softet Solutions
            </span>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-8 justify-end flex-1 ml-8">
            {navItems.map((item, i) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(refMap[item.refKey])}
                className="nav-item text-sm xl:text-base font-medium text-gray-600 transition-colors hover:text-[#0B3B6A] hover:underline hover:cursor-pointer whitespace-nowrap"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
            {isLoginRequired && <button
              className="nav-item ml-2 px-4 xl:px-6 py-2 xl:py-3 bg-[#0B3B6A] text-white text-sm xl:text-base rounded-lg hover:bg-[#165490] active:bg-[#0A2E4D] focus:outline-none focus:ring-2 focus:ring-[#165490] focus:ring-opacity-75 hover:shadow-md active:scale-95 transition-all font-medium whitespace-nowrap"
              style={{ animationDelay: `${navItems.length * 0.1}s` }}
            >
              Login
            </button>}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <MenuButton isOpen={mobileMenuOpen} toggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial="closed"
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { height: "auto", opacity: 1 },
            closed: { height: 0, opacity: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden"
        >
        {mobileMenuOpen && (<nav className="flex flex-col gap-4 py-4">
            {navItems.map((item, i) => (
              <button
                key={item.label}
                onClick={() => {
                  scrollToSection(refMap[item.refKey])
                  setMobileMenuOpen(false)
                }}
                className="nav-item text-base font-medium text-gray-600 transition-colors hover:text-[#0B3B6A] hover:underline py-2"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
            <button
              className="nav-item mt-2 px-4 py-2.5 bg-[#0B3B6A] text-white rounded-xl hover:bg-[#165490] focus:outline-none focus:ring-2 focus:ring-[#165490] focus:ring-opacity-75 transition-colors shadow-md active:scale-95 text-base font-medium"
              style={{ animationDelay: `${navItems.length * 0.1}s` }}
            >
              Login
            </button>
          </nav>
        )}
        </motion.div>
      </div>
    </header>
  );
}

//PropTypes 
Navbar.propTypes = {
  scrollToSection: PropTypes.func.isRequired,
  heroRef: PropTypes.object.isRequired,
  servicesRef: PropTypes.object.isRequired,
  testimonialsRef: PropTypes.object.isRequired,
  aboutUsRef: PropTypes.object.isRequired,
  coursesRef: PropTypes.object.isRequired,
  contactRef: PropTypes.object.isRequired,
};

MenuButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Navbar;
