'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function BlogReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-[64px] left-0 right-0 h-1.5 bg-indigo-600 dark:bg-indigo-500 z-50 origin-left"
      style={{ scaleX }}
    />
  );
}
