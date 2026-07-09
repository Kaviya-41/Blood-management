import { motion } from "framer-motion";

// ─── Fade Up on viewport entry ────────────────────────────────────────────────
export const FadeUp = ({ children, delay = 0, duration = 0.6, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Stagger container + item ─────────────────────────────────────────────────
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className = "",
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: staggerDelay } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Scale on hover (cards) ───────────────────────────────────────────────────
export const ScaleOnHover = ({ children, scale = 1.03, className = "" }) => (
  <motion.div
    whileHover={{ scale, transition: { type: "spring", stiffness: 300, damping: 20 } }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Button hover (spring scale + tap) ────────────────────────────────────────
export const ButtonHover = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 15 } }}
    whileTap={{ scale: 0.97 }}
    className={className}
    style={{ display: "inline-block" }}
  >
    {children}
  </motion.div>
);

// ─── Slide in from left or right ──────────────────────────────────────────────
export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  duration = 0.7,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Page transition wrapper ──────────────────────────────────────────────────
export const PageTransition = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);
