import type { Transition, Variants } from "framer-motion";

export const easeOut: Transition = { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] };
export const easeIn: Transition = { duration: 0.3, ease: [0.4, 0, 0.6, 1] };
export const spring: Transition = { type: "spring", stiffness: 380, damping: 30 };
export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 28 };

export const heroVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...easeOut, delay: 0.05 + i * 0.06 },
  }),
};

export const filterContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.25 } },
};

export const chipVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: easeOut },
};

export const monthGridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.012, delayChildren: 0.35 } },
};

export const dayVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: easeOut },
};

export const eventPillEntry: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 3 },
  show: { opacity: 1, scale: 1, y: 0, transition: spring },
  exit: { opacity: 0, scale: 0.94, transition: easeIn },
};

export const agendaContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.45 } },
};

export const agendaItemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: springSoft },
};
