import { useState } from "react";
import PropTypes from "prop-types";
import logo from "../assets/SoftetLogo.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Services", refKey: "servicesRef" },
  { label: "Our Tools", refKey: "toolsRef" },
  { label: "Projects", refKey: "projectsRef" },
  { label: "Testimonials", refKey: "testimonialsRef" },
  { label: "About Us", refKey: "aboutUsRef" },
  { label: "Contact", refKey: "contactRef" },
];

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
  );
};

export function Navbar({
  // eslint-disable-next-line react/prop-types
  showoptions = true,
  scrollToSection,
  heroRef,
  projectsRef,
  servicesRef,
  testimonialsRef,
  aboutUsRef,
  toolsRef,
  contactRef,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refMap = {
    heroRef,
    servicesRef,
    projectsRef,
    testimonialsRef,
    aboutUsRef,
    toolsRef,
    contactRef,
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <a href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <img
                src={logo}
                alt="Softet solutions logo"
                loading="lazy"
                width={50}
                height={50}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] object-contain rounded-xl"
              />

              <span className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[#0B3B6A] whitespace-nowrap">
                Softet Solutions
              </span>
            </div>
          </a>

          {showoptions && (
            <>
              <nav className="hidden lg:flex items-center gap-8 justify-end flex-1 ml-8">
                <Link
                  className="bg-blue-400 px-4 py-2 text-white font-semibold rounded-lg"
                  to="/reportet"
                >
                  ReportEt
                </Link>
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(refMap[item.refKey])}
                    className="nav-item text-sm xl:text-base font-medium text-gray-600 transition-colors hover:text-[#0B3B6A]"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="lg:hidden flex items-center">
                <MenuButton
                  isOpen={mobileMenuOpen}
                  toggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
              </div>
            </>
          )}
        </div>

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
          {mobileMenuOpen && showoptions && (
            <nav className="flex flex-col gap-4 py-4">
              <Link
                className="text-left text-blue-600 font-semibold py-2"
                to="/reportet"
                onClick={() => setMobileMenuOpen(false)}
              >
                ReportEt
              </Link>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToSection(refMap[item.refKey]);
                  }}
                  className="text-left text-gray-700 font-medium py-2"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </motion.div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  scrollToSection: PropTypes.func.isRequired,
  heroRef: PropTypes.object.isRequired,
  servicesRef: PropTypes.object.isRequired,
  testimonialsRef: PropTypes.object.isRequired,
  aboutUsRef: PropTypes.object.isRequired,
  toolsRef: PropTypes.object.isRequired,
  projectsRef: PropTypes.object.isRequired,
  isLoginRequired: PropTypes.bool.isRequired,
  contactRef: PropTypes.object.isRequired,
};

MenuButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Navbar;
