import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProjectCard from "./ProjectCard.jsx";
import projectData from "../Data/ProjectData.js";

function ProjectSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <section
      ref={ref}
      className="py-16 md:py-32 relative overflow-hidden bg-[#EFF6FF]"
    >
      {/* Subtle background pattern (same visual language as Tools) */}
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(theme(colors.indigo.200),transparent_1px)] [background-size:16px_16px]" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              Our Projects
              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.3,
                }}
                className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-sky-500 to-indigo-600 origin-left rounded-full"
              />
            </motion.span>
          </h1>

          {/* Description text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-black max-w-3xl mx-auto text-xl"
          >
            A collection of real-world projects built with modern web
            technologies.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-4">
          {projectData.map((project, index) => (
            <ProjectCard
              key={index}
              slug={project.slug}
              title={project.title}
              description={project.description}
              image={project.image}
              projectUrl={project.projectUrl}
              techStack={project.techStack}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectSection;
