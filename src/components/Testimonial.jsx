import { useEffect, useRef } from 'react';

export function Testimonial() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => elements?.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <section 
      className="min-h-screen flex items-center py-20 relative bg-[#336BE7]" 
      ref={sectionRef}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#336BE7]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#336BE7]/20 blur-[100px] animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Client Success Stories
          </h2>
          <p className="text-[#D6E4FF] max-w-2xl mx-auto text-lg">
            Discover how we&apos;ve helped businesses achieve their digital goals
          </p>
        </div>
      {/* card */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out hover:-translate-y-2"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative h-full flex flex-col p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl hover:backdrop-blur-3xl transition-all duration-300 border border-white/10 hover:border-white/20 shadow-2xl hover:shadow-3xl min-h-[400px]">
                  <div className="absolute top-6 right-6 w-12 h-12 text-white/30 transition-transform duration-300 group-hover:rotate-12">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>

                  <div className="relative flex-1 flex flex-col">
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-7 h-7 text-amber-400 transition-transform duration-300 hover:scale-125"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-[#F0F6FF] mb-8 text-xl leading-relaxed font-medium transform transition-all duration-300 group-hover:text-white/90">
                      &quot;{testimonial.quote}&quot;
                    </p>

                    <div className="mt-auto flex items-center gap-4 transition-all duration-300 group-hover:gap-5 mb-7">
                      <div className="w-12 h-12 rounded-full bg-white/10 p-2.5 flex items-center justify-center">
                        <svg 
                          className="w-6 h-6 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white group-hover:text-[#E8F0FF] transition-colors">
                          {testimonial.name}
                        </h4>
                        {testimonial.role && (
                          <p className="text-[#D6E4FF] text-sm font-medium mt-1">
                            {testimonial.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    quote: "Softet Solutions transformed our online presence with a stunning mobile application. Their team is professional and attentive to our needs.",
    name: "Mr. Anoop Mishra",
    role: "Leoguard Pharmaceuticals"
  },
  {
    quote: "The e-commerce web app developed by Softet Solutions has significantly boosted our customer engagement. Highly recommend their services!",
    name: "Mr. Akash Verma" 
  },
];

export default Testimonial;