// import { useState } from "react";
// import { Menu } from "lucide-react";
import {Link} from "react-router-dom";
import logo from '../assets/logo.jpeg';

const navItems = ["Services", "Testimonials", "About Us", "Courses", "Contact"];

export function Navbar() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b ">
      <div className="container flex h-20 items-center justify-between">
        
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2 ml-5">
          <img src={logo} alt="Softet Solutions Logo" className="h-12 w-auto" />
          <span className="text-xl ml-1 font-bold tracking-tight text-[#0B3B6A]">
            Softet Solutions
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 ml-auto pl-96">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-md font-medium text-gray-600 transition-colors hover:text-[#0B3B6A]"
            >
              {item}
            </Link>
          ))}
          <button className="bg-[#0B3B6A] text-white hover:bg-[#165490] px-4 py-2 rounded-md text-sm">
            Login
          </button>
        </nav>

        {/* Mobile Menu Button */}
        {/* <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button> */}
      </div>

      {/* Mobile Menu */}
      {/* {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
          <div className="container py-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium hover:text-[#0B3B6A]"
                >
                  {item}
                </Link>
              ))}
              <button className="w-full mt-4 bg-[#0B3B6A] text-white py-2 rounded-md">
                Login
              </button>
            </nav>
          </div>
        </div>
      )} */}
    </nav>
  );
}
