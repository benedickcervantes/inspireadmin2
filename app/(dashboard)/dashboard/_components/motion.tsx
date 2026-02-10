"use client";

import { motion, type Variants, type Transition } from "motion/react";

// Smooth spring transition for natural feel
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 25,
  mass: 0.8
};

// Subtle ease for micro-interactions
export const subtleEase: Transition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94]
};

// Luxurious slow reveal
export const slowReveal: Transition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1]
};

// Stagger configuration for children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Fade up animation for cards
export const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: slowReveal
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: slowReveal
  }
};

// Scale fade for charts and larger elements
export const scaleFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Blur fade for premium feel
export const blurFade: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 10
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Table row stagger
export const tableRowVariant: Variants = {
  hidden: {
    opacity: 0,
    x: -15
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Hover glow effect
export const hoverGlow = {
  scale: 1.01,
  transition: smoothSpring
};

// Tap effect
export const tapEffect = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Number counter animation hook helper
export const counterVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

// Pie chart segment animation
export const pieSegmentVariant: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
        delay: i * 0.1
      },
      opacity: {
        duration: 0.3,
        delay: i * 0.1
      }
    }
  })
};

// Line chart draw animation
export const lineDrawVariant: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1]
      },
      opacity: {
        duration: 0.4
      }
    }
  }
};

// Area fill animation
export const areaFillVariant: Variants = {
  hidden: {
    opacity: 0,
    scaleY: 0
  },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3
    }
  }
};

// Export motion components for cleaner imports
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionSpan = motion.span;
export const MotionPath = motion.path;
export const MotionCircle = motion.circle;
export const MotionSvg = motion.svg;

// Animated container wrapper
export function AnimatedContainer({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }
      }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}

// Staggered children wrapper
export function StaggeredContainer({
  children,
  className,
  staggerDelay = 0.08
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </MotionDiv>
  );
}
