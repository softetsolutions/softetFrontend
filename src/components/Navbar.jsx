import { useState } from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo.jpeg";
import { Menu } from "lucide-react";

const navItems = [
  { label: "Services", refKey: "servicesRef" },
  { label: "Testimonials", refKey: "testimonialsRef" },
  { label: "About Us", refKey: "aboutUsRef" },
  { label: "Courses", refKey: "coursesRef" },
  { label: "Contact", refKey: "contactRef" },
];

export function Navbar({ scrollToSection, heroRef, servicesRef, testimonialsRef, aboutUsRef, coursesRef, contactRef }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mapping refKey to actual useRef
  const refMap = {
    heroRef,
    servicesRef,
    testimonialsRef,
    aboutUsRef,
    coursesRef,
    contactRef,
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="w-full px-8 flex h-20 items-center justify-between">
        
        {/* Logo and Company Name */}
        <div className="nav-item flex items-center gap-2">
          <a href="/">
            <img
              src={logo}
              alt="Softet solutions logo"
              loading="lazy"
              width={50}
              height={50}
              className="w-15 h-15 sm:w-15 sm:h-15 object-contain"
            />
          </a>
          <span className="text-xl font-bold tracking-tight text-[#0B3B6A]">
            Softet Solutions
          </span>
        </div>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(refMap[item.refKey])}
              className="nav-item text-md font-medium text-gray-600 transition-colors hover:text-[#0B3B6A] hover:underline hover:cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {item.label}
            </button>
          ))}
          <button
            className="nav-item px-6 py-3 bg-[#0B3B6A] text-white rounded-lg hover:bg-[#165490] active:bg-[#0A2E4D] focus:outline-none focus:ring-2 focus:ring-[#165490] focus:ring-opacity-75 hover:shadow-md active:scale-95 transition-all font-medium"
            style={{ animationDelay: `${navItems.length * 0.1}s` }}
          >
            Login
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 p-2 rounded-md focus:outline-none focus:border focus:border-gray-400"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="px-8 md:hidden pb-4">
          <nav className="flex flex-col gap-4">
            {navItems.map((item, i) => (
              <button
                key={item.label}
                onClick={() => {
                  scrollToSection(refMap[item.refKey]);
                  setMobileMenuOpen(false);
                }}
                className="nav-item text-md font-medium text-gray-600 transition-colors hover:text-[#0B3B6A] hover:underline"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
            <button
              className="nav-item px-4 py-2 bg-[#0B3B6A] text-white rounded-xl hover:bg-[#165490] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#165490] transition-colors shadow-md active:scale-95"
              style={{ animationDelay: `${navItems.length * 0.1}s` }}
            >
              Login
            </button>
          </nav>
        </div>
      )}
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

export default Navbar;

