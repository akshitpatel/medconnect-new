'use client';

import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function AnimatedContainer({
  children,
  className,
  delay = 0,
  duration = 0.5
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
} 