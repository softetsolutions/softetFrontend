import { useState } from "react";
import logo from "../assets/logo.jpeg";
import { Menu } from "lucide-react";


const navItems = [
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About Us", href: "#about-us" },
  { label: "Courses", href: "#courses" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Desktop Navigation Items and Login */}
        <nav className="hidden md:flex items-center gap-12">
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-item text-md font-medium text-gray-600 transition-colors hover:text-[#0B3B6A] hover:underline"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {item.label}
            </a>
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
              <a
                key={item.label}
                href={item.href}
                className="nav-item text-md font-medium text-gray-600 transition-colors hover:text-[#0B3B6A] hover:underline"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item.label}
              </a>
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
