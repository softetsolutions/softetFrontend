import { Linkedin, Mail, Phone} from "lucide-react";
import logo from "../assets/logo.jpeg";
import React from "react";
import PropTypes from "prop-types";

const quickLinks = [
  { label: "Services", refKey: "servicesRef" },
  { label: "Testimonials", refKey: "testimonialsRef" },
  { label: "About Us", refKey: "aboutUsRef" },
  { label: "Courses", refKey: "coursesRef" },
  { label: "Contact", refKey: "contactRef" },
];

const socialLinks = [

  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/softet-solutions/",
    icon: Linkedin,
  },
];

export function Footer({
  scrollToSection,
  heroRef,
  servicesRef,
  testimonialsRef,
  aboutUsRef,
  coursesRef,
  contactRef,
}) {
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
    <footer className="bg-[#0040c1] shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="h-16 w-16 rounded-lg p-2">
                <img
                  src={logo}
                  alt="Softet solutions logo"
                  loading="lazy"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <span className="text-xl font-bold text-white">
                Softet Solutions
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/90">
              Empowering Businesses with Cutting-Edge Software Solutions
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.refKey}>
                  <button
                    onClick={() => scrollToSection(refMap[link.refKey])}
                    className="inline-flex text-sm text-white/90 hover:text-white hover:cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect with Us */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase text-white">
              Connect with Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="mailto:support@softetsolutions.com"
                  className="inline-flex items-center text-sm text-white/90 hover:text-white"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  support@softetsolutions.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="inline-flex items-center text-sm text-white/90 hover:text-white"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  +91 6387651169
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase text-white">
              Follow Us
            </h3>
            <div className="mt-4 flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {React.createElement(social.icon, {
                    className: "h-6 w-6 text-white",
                  })}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-white/90">
              © {new Date().getFullYear()} Softet Solutions. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/privacy"
                className="text-sm text-white/90 hover:text-white hover:cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-sm text-white/90 hover:text-white hover:cursor-pointer"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
//PropTypes
Footer.propTypes = {
  scrollToSection: PropTypes.func.isRequired,
  heroRef: PropTypes.object.isRequired,
  servicesRef: PropTypes.object.isRequired,
  testimonialsRef: PropTypes.object.isRequired,
  aboutUsRef: PropTypes.object.isRequired,
  coursesRef: PropTypes.object.isRequired,
  contactRef: PropTypes.object.isRequired,
};
export default Footer;
