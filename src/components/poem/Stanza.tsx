import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Stanza({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.6, ease: [0.22, 0.61, 0.36, 1], delay: 0.1 }}
      className="relative mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center px-6 py-20 sm:px-10"
    >
      <div className="glass-panel relative w-full rounded-2xl p-8 sm:p-12">
        <span
          aria-hidden
          className="absolute -top-3 left-6 font-serif text-xs tracking-[0.4em] text-[color:var(--color-silver)]/50"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="font-serif text-2xl leading-relaxed text-[color:var(--color-silver)] text-glow-soft sm:text-3xl sm:leading-relaxed md:text-4xl md:leading-[1.5]">
          {children}
        </div>
      </div>
    </motion.section>
  );
}
