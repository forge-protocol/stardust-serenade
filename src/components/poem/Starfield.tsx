import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number; // core radius (px, already scaled by dpr)
  mag: number; // brightness 0..1 (power-law: most stars faint)
  col: [number, number, number]; // base rgb (stellar color temperature)
  twSpeed: number; // twinkle speed
  twPhase: number; // twinkle phase offset
  twAmt: number; // twinkle depth 0..1
  spike: number; // diffraction-spike strength 0..1 (only bright stars)
  vx: number;
  vy: number;
};

// Realistic stellar colors spanning cool red dwarfs to hot blue giants.
// Weighted so most stars read white / blue-white, with occasional warm ones.
const PALETTE: Array<[number, number, number]> = [
  [155, 176, 255], // O/B blue
  [185, 205, 255], // blue-white
  [220, 232, 255], // white-blue
  [255, 255, 255], // white
  [255, 250, 240], // warm white
  [255, 244, 224], // F/G pale gold
  [255, 232, 200], // K light orange
  [255, 210, 170], // warm orange
];

function pickColor(): [number, number, number] {
  // Bias toward white / blue-white (indices 2-4 most common).
  const r = Math.random();
  if (r < 0.55) return PALETTE[2 + Math.floor(Math.random() * 3)];
  if (r < 0.8) return PALETTE[Math.floor(Math.random() * 2)];
  return PALETTE[5 + Math.floor(Math.random() * 3)];
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let stars: Star[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      // Denser field for a believable sky; a touch lighter on phones.
      const density = window.innerWidth < 768 ? 5200 : 3600;
      const count = Math.floor((window.innerWidth * window.innerHeight) / density);

      stars = Array.from({ length: count }, () => {
        // Power-law magnitude: most stars dim, a rare few bright.
        const mag = Math.pow(Math.random(), 2.6);
        const bright = mag > 0.82;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: (0.45 + mag * 1.15) * dpr,
          mag,
          col: pickColor(),
          twSpeed: 0.6 + Math.random() * 2.2,
          twPhase: Math.random() * Math.PI * 2,
          // Smaller stars scintillate more, like real atmospheric twinkle.
          twAmt: 0.25 + (1 - mag) * 0.45,
          spike: bright ? (mag - 0.82) / 0.18 : 0,
          vx: 0,
          vy: 0,
        };
      });
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX * dpr;
      mouse.current.y = e.clientY * dpr;
      mouse.current.active = true;
    };
    const onLeave = () => (mouse.current.active = false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      for (const s of stars) {
        // gentle cursor parallax drift
        if (mouse.current.active && !reduceMotion) {
          const dx = mouse.current.x - s.x;
          const dy = mouse.current.y - s.y;
          const dist2 = dx * dx + dy * dy;
          const maxR = 160 * dpr;
          if (dist2 < maxR * maxR) {
            const f = (1 - Math.sqrt(dist2) / maxR) * 0.04;
            s.vx += dx * f * 0.0008;
            s.vy += dy * f * 0.0008;
          }
        }
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.x += s.vx;
        s.y += s.vy;

        const tw = reduceMotion
          ? 1
          : 1 - s.twAmt * (0.5 - 0.5 * Math.cos(t * s.twSpeed + s.twPhase));
        const alpha = Math.min(1, (0.35 + s.mag * 0.65) * tw);
        const [cr, cg, cb] = s.col;

        // Soft, tight halo (much smaller than before — points, not orbs).
        const haloR = s.r * (s.spike > 0 ? 5 : 3);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, haloR);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha * 0.12})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, haloR, 0, Math.PI * 2);
        ctx.fill();

        // Crisp core.
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // Diffraction spikes for the brightest handful only.
        if (s.spike > 0) {
          const len = s.r * (6 + s.spike * 10);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha * 0.35 * s.spike})`;
          ctx.lineWidth = Math.max(0.5, 0.6 * dpr);
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const render = () => {
      t += 0.016;
      draw();
      raf = requestAnimationFrame(render);
    };

    if (reduceMotion) {
      draw(); // single static frame
    } else {
      render();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
