import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import CircleIcon from "@mui/icons-material/Circle";

function ProjectCard({
  slug,
  title,
  description,
  image,
  projectUrl,
  techStack,
  index = 0,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay: index * 0.2,
      }}
      whileHover={{
        y: -15,
        scale: 1.05,
        rotateX: 10,
        transition: { type: "spring", stiffness: 500, damping: 15 },
      }}
      className="group relative overflow-hidden rounded-3xl bg-white px-5 py-5 shadow-3xl hover:shadow-4xl transition-all duration-500 w-full"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B3B6A]/10 to-[#2196F3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      <div className="relative z-10 flex flex-col h-auto">
        {/* Project Image */}
        <motion.div
          className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-gray-100"
          animate={
            isInView
              ? { rotate: [0, 6, -6, 0], scale: [1, 1.05, 1, 1] }
              : {}
          }
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <img
            src={image?.[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-black mb-5">
          <motion.span
            initial={{ backgroundSize: "0% 3px" }}
            animate={isInView ? { backgroundSize: "100% 3px" } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="bg-gradient-to-r from-[#0B3B6A] to-[#2196F3] bg-no-repeat bg-left-bottom pb-1"
          >
            {title}
          </motion.span>
        </h3>

        {/* ✅ FULL Description (no clamp) */}
        <p className="text-gray-700 text-base mb-5 line-clamp-2">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {description}
          </motion.span>
        </p>

        {/* Tech Stack */}
        <motion.div
          className="flex flex-wrap gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {techStack?.map((tech, i) => (
            <motion.span
              key={i}
              initial={{ x: -20 }}
              animate={isInView ? { x: 0 } : {}}
              whileHover={{
                scale: 1.1,
                background: "linear-gradient(45deg, #0B3B6A, #2196F3)",
                color: "white",
              }}
              className="px-4 py-2 text-sm bg-blue-50 text-[#0B3B6A] rounded-full cursor-pointer transition-all duration-300 shadow-md"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          {/* ✅ Live link opens project */}
          {projectUrl ? (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-green-700 font-medium hover:underline cursor-pointer"
            >
              <CircleIcon className="scale-75 animate-pulse" />
              Live
            </a>
          ) : (
            <span className="text-sm text-gray-500">Not Live</span>
          )}

          {/* Details Button */}
          <Link to={`/${slug}`}>
            <motion.button
              className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-2.5 px-6 rounded-full font-semibold transition-all duration-300 hover:bg-gradient-to-l cursor-pointer"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              More
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
