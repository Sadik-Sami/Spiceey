export const MOTION = {
  ease: {
    smooth: [0.16, 1, 0.3, 1],
    spring: { type: "spring" as const, stiffness: 200, damping: 24 },
    bounce: { type: "spring" as const, stiffness: 300, damping: 18 },
    gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  },
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    reveal: 0.8,
  },
  stagger: {
    fast: 0.04,
    normal: 0.06,
    slow: 0.08,
  },
} as const;
