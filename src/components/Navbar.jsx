import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo.jpeg";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";

const navItems = [
  { label: "Services", refKey: "servicesRef" },
  { label: "Our Tools", refKey: "toolsRef" },
  { label: "Projects", refKey: "projectsRef" },
  { label: "Testimonials", refKey: "testimonialsRef" },
  { label: "About Us", refKey: "aboutUsRef" },
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
  const location = useLocation();
  const [firstInstallmentPaid, setFirstInstallmentPaid] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.firstInstallmentPaid) {
      setFirstInstallmentPaid(true);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setFirstInstallmentPaid(false);
    window.location.href = "/industrial-training";
  };

  // Mapping refKey to actual useRef
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
          {/* Logo and Company Name */}
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
          {/* isLoggedIn */}
          {location.pathname.startsWith("/industrial-training") && (
            <div className="hidden lg:flex items-center gap-3 ml-2">
              {!isLoggedIn ? (
                <>
                  {/* <Link
                    to="/industrial-training/payment"
                    className="px-4 xl:px-6 py-2 xl:py-3 bg-[#0B3B6A] text-white rounded-lg hover:bg-[#165490] transition-all"
                  >
                    Payment
                  </Link> */}

                  <Link
                    to="/industrial-training/login"
                    className="px-4 xl:px-6 py-2 xl:py-3 bg-[#0B3B6A] text-white rounded-lg hover:bg-[#165490] transition-all"
                  >
                    Login
                  </Link>

                  <Link
                    to="/industrial-training/signup"
                    className="px-4 xl:px-6 py-2 xl:py-3 bg-[#0B3B6A] text-white rounded-lg hover:bg-[#165490] transition-all"
                  >
                    Signup
                  </Link>
                </>
              ) : !firstInstallmentPaid ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/industrial-training/payment"
                    className="px-4 xl:px-6 py-2 xl:py-3 bg-[#0B3B6A] text-white rounded-lg hover:bg-[#165490] transition-all"
                  >
                    Payment
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 xl:px-6 py-2 xl:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/industrial-training/dashboard"
                  className="px-4 xl:px-6 py-2 xl:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  Dashboard
                </Link>
              )}
            </div>
          )}

          {(showoptions ||
            location.pathname.startsWith("/industrial-training")) && (
            <>
              {showoptions && (
                <nav className="hidden lg:flex items-center gap-8 justify-end flex-1 ml-8">
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
              )}

              <div className="lg:hidden flex items-center">
                <MenuButton
                  isOpen={mobileMenuOpen}
                  toggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
              </div>
            </>
          )}
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
          {mobileMenuOpen && (
            <nav className="flex flex-col gap-4 py-4">
              {location.pathname.startsWith("/industrial-training") ? (
                <>
                  {!isLoggedIn ? (
                    <>
                      <Link
                        to="/industrial-training/payment"
                        className="px-4 py-2.5 bg-[#0B3B6A] text-white rounded-xl text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Payment
                      </Link>

                      <Link
                        to="/industrial-training/login"
                        className="px-4 py-2.5 bg-[#0B3B6A] text-white rounded-xl text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>

                      <Link
                        to="/industrial-training/signup"
                        className="px-4 py-2.5 bg-[#0B3B6A] text-white rounded-xl text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Signup
                      </Link>
                    </>
                  ) : !firstInstallmentPaid ? (
                    <>
                      <Link
                        to="/industrial-training/payment"
                        className="px-4 py-2.5 bg-[#0B3B6A] text-white rounded-xl text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Payment
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 bg-gray-700 text-white rounded-xl text-center"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/industrial-training/dashboard"
                      className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              ) : (
                /* ⭐ default website mobile nav ⭐ */
                <>
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
                </>
              )}
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
  toolsRef: PropTypes.object.isRequired,
  projectsRef: PropTypes.object.isRequired,
  // coursesRef: PropTypes.object.isRequired,
  isLoginRequired: PropTypes.bool.isRequired,
  contactRef: PropTypes.object.isRequired,
};

MenuButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Navbar;
