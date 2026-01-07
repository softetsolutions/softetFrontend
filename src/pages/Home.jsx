import { useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Testimonial } from "../components/Testimonial";
import { AboutUs } from "../components/AboutUs";
import { ContactUs } from "../components/ContactUs";
import { Footer } from "../components/Footer";
import { Tools } from "../components/Tools";
import ProjectSection from "../components/ProjectSection.jsx";
import { Link } from "react-router-dom";

function Home() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const aboutUsRef = useRef(null);
  const toolsRef = useRef(null);
  const projectsRef = useRef(null);
  // smooth scrolling
  const scrollToSection = (ref) => {
    if (!ref?.current) return;

    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="flex flex-col">
        <Navbar
          scrollToSection={scrollToSection}
          heroRef={heroRef}
          servicesRef={servicesRef}
          projectsRef={projectsRef}
          testimonialsRef={testimonialsRef}
          contactRef={contactRef}
          toolsRef={toolsRef}
          aboutUsRef={aboutUsRef}
          isLoginRequired={false}
        />
        {/* Add id AND ref to each section */}
        <div ref={heroRef} id="hero">
          <Hero targetRef={servicesRef} scrollToSection={scrollToSection} />
        </div>

        <div ref={servicesRef} id="services">
          <Services />
        </div>

        <div ref={projectsRef} id="projects">
          <ProjectSection />
        </div>

        <div ref={toolsRef} id="tools">
          <Tools />
        </div>

        <div ref={testimonialsRef} id="testimonials">
          <Testimonial />
        </div>

        <div ref={aboutUsRef} id="about">
          <AboutUs />
        </div>

        <div ref={contactRef} id="contact">
          <ContactUs />
        </div>

        <div>
          <Footer
            scrollToSection={scrollToSection}
            heroRef={heroRef}
            servicesRef={servicesRef}
            testimonialsRef={testimonialsRef}
            contactRef={contactRef}
            toolsRef={toolsRef}
            aboutUsRef={aboutUsRef}
          />
        </div>
      </div>
      <Link
        to={"/industrial-training"}
        className="
    fixed bottom-20 right-8 z-50
    bg-blue-600 text-white
    px-5 py-4 rounded-2xl
    shadow-xl
    flex flex-col items-start
    gap-1
    animate-pulse
    hover:animate-none
    hover:scale-105
    transition-transform duration-300
  "
      >
        <span className="text-sm font-medium opacity-90">
          Industrial Training
        </span>
        <span className="text-base font-bold">MERN Stack • Live</span>
        <span className="text-xs opacity-80">Become Job-Ready → ₹4,999</span>
      </Link>
    </>
  );
}

export default Home;
