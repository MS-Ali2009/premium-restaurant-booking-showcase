import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const directionMap = {
  up:    { y: 48, x: 0 },
  down:  { y: -48, x: 0 },
  left:  { y: 0, x: 48 },
  right: { y: 0, x: -48 },
  none:  { y: 0, x: 0 },
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  className = '',
  once = true,
  amount = 0.15,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount, margin: '-60px 0px' });

  const offset = directionMap[direction] ?? directionMap.up;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView
        ? { opacity: 1, x: 0, y: 0 }
        : { opacity: 0, ...offset }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
