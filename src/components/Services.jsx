import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { ServiceCard } from './ServiceCard';

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <section 
      ref={ref}
      className="py-16 md:py-32 relative overflow-hidden bg-gradient-to-br from-sky-50 to-indigo-50"
    >
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(theme(colors.indigo.200),transparent_1px)] [background-size:16px_16px]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              Our Services
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3
                }}
                className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-sky-500 to-indigo-600 origin-left rounded-full"
              />
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-black max-w-3xl mx-auto text-xl"
          >
             We provide comprehensive software solutions tailored to your business needs
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              service={service} 
              index={index} 
              className="h-60 md:h-80" 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// services array 
const services = [
  {
    title: "Web Development",
    description: "Create responsive and user-friendly websites that deliver exceptional digital experiences.",
    technologies: ["React", "Next.js", "Node.js", "JavaScript"],
    icon: (
      <motion.svg 
        fill="none" 
        viewBox="0 0 24 24"
        className="w-full h-full"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="webGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B3B6A" />
            <stop offset="100%" stopColor="#2196F3" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#webGradient)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </motion.svg>
    ),
  },
  {
    title: "App Development",
    description: "Build high-performance mobile applications with a seamless user experience.",
    technologies: ["Flutter", "React Native", "Kotlin", "Swift"],
    icon: (
      <motion.svg
        fill="none"
        viewBox="0 0 24 24"
        className="w-full h-full"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="appGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B3B6A" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#appGradient)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm4 17h2m-1-3v3"
        />
      </motion.svg>
    ),
  },
  {
    title: "Desktop Development",
    description: "Develop robust and scalable desktop applications for Windows, macOS, and Linux.",
    technologies: ["Electron", "JavaFX", "Qt", "C#"],
    icon: (
      <motion.svg 
        fill="none" 
        viewBox="0 0 24 24"
        className="w-full h-full"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="desktopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B3B6A" />
            <stop offset="100%" stopColor="#FF9800" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#desktopGradient)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm3 14h8m-4 0v-4"
        />
      </motion.svg>
    ),
  },
];