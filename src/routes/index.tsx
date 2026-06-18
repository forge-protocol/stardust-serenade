import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Atmosphere } from "@/components/poem/Atmosphere";
import { Starfield } from "@/components/poem/Starfield";
import { Stanza } from "@/components/poem/Stanza";
import { AmbientAudio } from "@/components/poem/AmbientAudio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Am I Your First? — A Love Letter" },
      { name: "description", content: "An intimate, cinematic love poem — written into eternity, for one." },
      { property: "og:title", content: "Am I Your First?" },
      { property: "og:description", content: "A whispered love letter, rendered as a private universe." },
    ],
  }),
  component: Index,
});

const stanzas: string[][] = [
  [
    "Am I the first to change the way you see the world?",
    "The first to love every part of you,",
    "even the parts you’ve kept hidden from yourself.",
  ],
  [
    "The first who would sacrifice everything for you,",
    "set the world ablaze just to keep you warm.",
  ],
  [
    "Whisper your name to the moon",
    "so it may remember you long after time fades,",
    "write you into eternity",
    "across empty, waiting pages.",
  ],
  [
    "Am I the first",
    "to show you what love truly means?",
  ],
];

function Index() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      document.body.style.overflow = "";
      setUnlocked(true);
    }, 3000);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Atmosphere />
      <Starfield />
      <AmbientAudio />

      {/* Opening hero */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.96, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-glow text-center font-serif text-5xl font-light italic leading-tight text-[color:var(--color-silver)] sm:text-7xl md:text-8xl"
        >
          Am I your first?
        </motion.h1>

        <AnimatePresence>
          {unlocked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
            >
              <div className="font-sans text-[10px] uppercase tracking-[0.5em] text-[color:var(--color-silver)]/60">
                scroll
              </div>
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mt-3 h-10 w-px bg-gradient-to-b from-transparent via-[color:var(--color-silver)]/80 to-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Stanzas */}
      <div className="relative z-10">
        {stanzas.map((lines, i) => (
          <Stanza key={i} index={i}>
            {lines.map((line, j) => (
              <p key={j} className="mb-2 last:mb-0">
                <span className="italic">{line}</span>
              </p>
            ))}
          </Stanza>
        ))}
      </div>

      {/* Closing */}
      <section className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, scale: 0.92, filter: "blur(18px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="text-glow text-center font-serif text-6xl font-light italic text-[color:var(--color-silver)] sm:text-7xl md:text-8xl"
        >
          For you.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-16 animate-heart-beat"
          aria-hidden
        >
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
            <defs>
              <radialGradient id="heart-grad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.95 0.05 350)" />
                <stop offset="60%" stopColor="oklch(0.7 0.2 350)" />
                <stop offset="100%" stopColor="oklch(0.45 0.18 320)" />
              </radialGradient>
            </defs>
            <path
              d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"
              fill="url(#heart-grad)"
            />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, delay: 1.0 }}
          className="text-glow mt-12 text-center font-serif text-4xl font-light italic tracking-wide text-[color:var(--color-silver)] sm:text-5xl md:text-6xl"
        >
          Firdaous
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1.8 }}
          className="mt-8 text-center font-serif text-sm italic text-[color:var(--color-silver)]/50 sm:text-base"
        >
          written into eternity
        </motion.p>
      </section>
    </main>
  );
}
