import { motion, useReducedMotion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", y = 28 }) => {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
};

export const SectionHeading = ({ eyebrow, title, description, align = "left" }) => (
  <Reveal className={`mb-12 lg:mb-16 ${align === "center" ? "text-center" : ""}`}>
    <p className="eyebrow mb-4">{eyebrow}</p>
    <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h2>
    {description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>}
  </Reveal>
);
export default Reveal;
