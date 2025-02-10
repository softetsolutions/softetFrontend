import { motion, useInView } from 'framer-motion';
import PropTypes from 'prop-types';
import { useRef } from 'react';

export const ServiceCard = ({ service, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 30 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        type: "spring",
        stiffness: 120,
        damping: 20,
        delay: index * 0.2
      }}
      className="group relative overflow-hidden rounded-3xl bg-white p-10 shadow-3xl hover:shadow-4xl transition-all duration-500 h-[450px] w-full md:w-[380px]"
      whileHover={{ 
        y: -15,
        scale: 1.05,
        rotateX: 10,
        transition: { type: "spring", stiffness: 500, damping: 15}
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B3B6A]/10 to-[#2196F3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      <div className="relative z-10">
        <motion.div 
          className="w-20 h-20 mb-6 text-[#0B3B6A] group-hover:text-[#2196F3] transition-colors duration-500"
          animate={isInView ? { 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1, 1]
          } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {service.icon}
        </motion.div>

        {/* Title with Underline Animation */}
        <h3 className="text-2xl font-bold text-black mb-4">
          <motion.span
            initial={{ backgroundSize: "0% 3px" }}
            animate={isInView ? { backgroundSize: "100% 3px" } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="bg-gradient-to-r from-[#0B3B6A] to-[#2196F3] bg-no-repeat bg-left-bottom pb-1"
          >
            {service.title}
          </motion.span>
        </h3>

        <p className="text-gray-700 text-lg mb-6 relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {service.description}
          </motion.span>
        </p>

        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {service.technologies.map((tech, i) => (
            <motion.span
              key={i}
              whileHover={{ 
                scale: 1.1,
                background: "linear-gradient(45deg, #0B3B6A, #2196F3)",
                color: "white"
              }}
              className="px-4 py-2 text-md bg-blue-50 text-[#0B3B6A] rounded-full cursor-pointer transition-all duration-300 shadow-md"
              initial={{ x: -20 }}
              animate={isInView ? { x: 0 } : {}}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

// PropType
ServiceCard.propTypes = {
  service: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    icon: PropTypes.node.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
