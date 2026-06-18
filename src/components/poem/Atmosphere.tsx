import { useEffect, useState } from "react";

export function Atmosphere() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

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

      {/* moon — parallax */}
      <div
        className="absolute"
        style={{
          right: "-6vw",
          top: `calc(8vh - ${scrollY * 0.15}px)`,
          width: "min(70vw, 520px)",
          height: "min(70vw, 520px)",
          transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
        }}
      >
        <div className="moon-glow animate-moon-pulse h-full w-full rounded-full" />
        <div
          className="absolute inset-[18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, oklch(0.98 0.02 90) 0%, oklch(0.88 0.04 80) 55%, oklch(0.65 0.06 60) 100%)",
            boxShadow:
              "inset -30px -40px 80px oklch(0.4 0.08 290 / 0.5), 0 0 120px oklch(0.95 0.05 90 / 0.4)",
            opacity: 0.92,
          }}
        />
      </div>

      {/* drifting mist layers */}
      <div
        className="absolute -inset-[20%] opacity-40 animate-drift"
        style={{
          background:
            "radial-gradient(ellipse at 30% 60%, oklch(0.5 0.15 290 / 0.18) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, oklch(0.4 0.2 260 / 0.15) 0%, transparent 55%)",
          filter: "blur(40px)",
          transform: `translate3d(0, ${scrollY * -0.08}px, 0)`,
        }}
      />
      <div
        className="absolute -inset-[20%] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 60% 80%, oklch(0.5 0.18 320 / 0.18) 0%, transparent 50%)",
          filter: "blur(60px)",
          animation: "drift 26s ease-in-out infinite reverse",
          transform: `translate3d(0, ${scrollY * -0.04}px, 0)`,
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.05 0.02 280 / 0.6) 100%)",
        }}
      />
    </div>
  );
}
