import { useEffect, useState } from "react";
import moonImg from "@/assets/moon.png";

export function Atmosphere() {
  const [progress, setProgress] = useState(0); // 0..1 scroll progress

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Moon: large at top, shrinks gradually. Scale 1 -> 0.28
  const scale = 1 - progress * 0.72;
  // Drifts upward slightly as it shrinks
  const translateY = -progress * 18; // vh
  const opacity = 0.95 - progress * 0.35;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* deep gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, oklch(0.22 0.09 280) 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, oklch(0.18 0.1 300) 0%, transparent 55%), linear-gradient(180deg, oklch(0.09 0.04 280) 0%, oklch(0.13 0.05 285) 50%, oklch(0.08 0.04 275) 100%)",
        }}
      />

      {/* Moon — large in background, scales down on scroll */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: "min(140vw, 1100px)",
          height: "min(140vw, 1100px)",
          transform: `translate3d(-50%, calc(-50% + ${translateY}vh), 0) scale(${scale})`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
          opacity,
          transition: "opacity 200ms linear",
        }}
      >
        <img
          src={moonImg}
          alt=""
          width={1024}
          height={1024}
          decoding="async"
          className="h-full w-full object-contain select-none"
          draggable={false}
        />
      </div>

      {/* vignette for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, oklch(0.05 0.02 280 / 0.75) 100%)",
        }}
      />
    </div>
  );
}
