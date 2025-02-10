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
            <button
              className="nav-item ml-2 px-4 xl:px-6 py-2 xl:py-3 bg-[#0B3B6A] text-white text-sm xl:text-base rounded-lg hover:bg-[#165490] active:bg-[#0A2E4D] focus:outline-none focus:ring-2 focus:ring-[#165490] focus:ring-opacity-75 hover:shadow-md active:scale-95 transition-all font-medium whitespace-nowrap"
              style={{ animationDelay: `${navItems.length * 0.1}s` }}
            >
              Login
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0B3B6A] transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-4 py-4">
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
        </div>
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

export default Navbar;

