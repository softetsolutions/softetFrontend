import { useState, useEffect } from "react";
import { Menu, X, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Scroll behavior
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  // Handle login/dashboard click
  const onLoginClick = () => {
    navigate(isLoggedIn ? "/admin" : "/login");
    console.log("user loggedIn");
    
  };

  // Detect login state on mount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.id) {
          setIsLoggedIn(true);
          return;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("userToken");
      }
    }

    setIsLoggedIn(false);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-300 shadow-md text-black" : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            Report<span className="text-black">ET</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {["Home", "Features", "About", "FAQ", "Contact Us"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-orange-500 font-medium transition-colors"
              >
                {item}
              </a>
            ))}

            <button
              onClick={onLoginClick}
              className="hover:cursor-pointer px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {isLoggedIn ? "My Dashboard" : "Login"}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-black"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <a href="/" className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
              <Receipt className="w-6 h-6 text-orange-500" />
              Report<span className="text-black">ET</span>
            </a>
            <button onClick={toggleMenu} aria-label="Close menu">
              <X className="w-6 h-6 text-black" />
            </button>
          </div>

          <div className="flex flex-col gap-6 mt-8">
            {["Home", "Features", "About", "FAQ", "Contact Us"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-black hover:text-orange-500 text-lg font-medium"
                onClick={toggleMenu}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="mt-auto mb-8">
            <button
              onClick={() => {
                toggleMenu();
                onLoginClick();
              }}
              className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              {isLoggedIn ? "My Dashboard" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
