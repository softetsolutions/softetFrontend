import { useRef } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";

function Home() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);

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
      />
      <div 
      ref={heroRef}>
        <Hero targetRef={servicesRef} scrollToSection={scrollToSection}/>
      </div>

      <div ref={servicesRef}>
        <Services />
      </div>
    </div>
  );
}

export default Home;
