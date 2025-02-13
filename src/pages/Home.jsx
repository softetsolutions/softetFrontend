import { useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { Testimonial } from "../components/Testimonial";
import { AboutUs } from "../components/AboutUs";
import { ContactUs } from "../components/ContactUs";
import { Footer } from "../components/Footer";


function Home() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const coursesRef = useRef(null);
  const aboutUsRef = useRef(null);
  // smooth scrolling
  const scrollToSection = (ref) => {
    if (ref?.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      });
    }
  };  

  
  return (
    <div className="flex flex-col">
      <Navbar
        scrollToSection={scrollToSection}
        heroRef={heroRef}
        servicesRef={servicesRef}
        testimonialsRef={testimonialsRef}
        contactRef={contactRef}
        coursesRef={coursesRef}
        aboutUsRef={aboutUsRef}
      />
      <div 
      ref={heroRef}>
        <Hero targetRef={servicesRef} scrollToSection={scrollToSection}/>
      </div>

      <div ref={servicesRef}>
        <Services />
      </div>
      <div ref={testimonialsRef}>
        <Testimonial />
      </div>
      <div ref={aboutUsRef}>
        <AboutUs />
      </div>
      <div ref={contactRef}>
        <ContactUs/>
      </div>
      <div>
        <Footer
        scrollToSection={scrollToSection}
        heroRef={heroRef}
        servicesRef={servicesRef}
        testimonialsRef={testimonialsRef}
        contactRef={contactRef}
        coursesRef={coursesRef}
        aboutUsRef={aboutUsRef}/>
      </div>
    </div>
  );
}

export default Home;
