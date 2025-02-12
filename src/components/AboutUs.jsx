import { useEffect, useRef } from "react";

export function AboutUs() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const hiddenElements = document.querySelectorAll(".animate-on-scroll");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      className="min-h-screen relative bg-[#F5F9FF] py-20 flex items-center"
      ref={sectionRef}
    >
      {/* Background*/}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#E3F2FF]/50 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#B3D8FF]/50 to-transparent blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image*/}
          <div className="relative animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-[#E3F2FF] group transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl h-full">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Softet Solutions"
                className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110 load-on-scroll"
              />
              {/* Gradient Overlay with hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5F9FF]/60 via-transparent to-[#B3D8FF]/20 transition-opacity duration-300 group-hover:opacity-75" />
            </div>

            {/* Decorative Elements*/}
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#B3D8FF]/20 rounded-full blur-[80px] transition-all duration-300 group-hover:w-48 group-hover:h-48" />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#E3F2FF]/20 rounded-full blur-[80px] transition-all duration-300 group-hover:w-48 group-hover:h-48" />
          </div>

          {/* Content Section */}
          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out delay-200 order-1 lg:order-2">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-white rounded-full border border-[#E3F2FF] shadow-sm">
                <span className="text-[#1A73E8] font-medium">
                  About Softet Solutions
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#202124] leading-tight">
                Transforming Ideas into
                <span className="text-[#1A73E8]"> Digital Excellence</span>
              </h2>

              <p className="text-[#5F6368] text-lg leading-relaxed">
                At Softet Solutions, our mission is to deliver exceptional
                software solutions that drive business success. Our team of
                experts specializes in web, app, and desktop development,
                committed to bringing your ideas to life with the latest
                technologies and design principles.
              </p>

              {/* Features*/}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-[#E3F2FF] transition-all duration-300 group-hover:bg-[#1A73E8]/5 group-hover:border-[#1A73E8]">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-[#202124] font-semibold mb-1 transition-colors duration-300 group-hover:text-[#1A73E8]">
                        {feature.title}
                      </h3>
                      <p className="text-[#5F6368]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    title: "Innovation First",
    description: "Leveraging cutting-edge technologies",
    icon: (
      <svg
        className="w-6 h-6 text-[#89B3F5] transition-colors duration-300 group-hover:text-[#1A73E8]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Client-Centric",
    description: "Focused on your success",
    icon: (
      <svg
        className="w-6 h-6 text-[#89B3F5] transition-colors duration-300 group-hover:text-[#1A73E8]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];
