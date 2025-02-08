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
        stiffness: 100,
        damping: 20,
        delay: index * 0.15
      }}
      className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-2xl hover:shadow-3xl transition-all duration-500"
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { type: "spring", stiffness: 500, damping: 15}
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B3B6A]/5 to-[#2196F3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <motion.div 
          className="w-16 h-16 mb-6 text-[#0B3B6A] group-hover:text-[#2196F3] transition-colors duration-500"
          animate={isInView ? { 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1]
          } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {service.icon}
        </motion.div>

        <h3 className="text-xl font-bold text-black mb-4">
          <motion.span
            initial={{ backgroundSize: "0% 2px" }}
            animate={isInView ? { backgroundSize: "100% 2px" } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="bg-gradient-to-r from-[#0B3B6A] to-[#0B3B6A] bg-no-repeat bg-left-bottom"
          >
            {service.title}
          </motion.span>
        </h3>

        <p className="text-gray-600 mb-6 relative">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            {service.description}
          </motion.span>
        </p>

        <motion.div 
          className="flex flex-wrap gap-2"
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
              className="px-3 py-1 text-sm bg-blue-50 text-[#0B3B6A] rounded-full cursor-pointer transition-all duration-300"
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
