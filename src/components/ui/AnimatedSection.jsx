import * as React from "react";
import { motion, useInView } from "framer-motion";

const AnimatedSection = React.forwardRef(({
  children,
  className = "",
  delay = 0,
  direction = "up",
}, ref) => {
  const innerRef = React.useRef(null);
  const resolvedRef = ref || innerRef;
  const isInView = useInView(resolvedRef, { once: true, margin: "-100px" });

  const directionVariants = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      ref={resolvedRef}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
