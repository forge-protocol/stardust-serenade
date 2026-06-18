import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; tw: number; vx: number; vy: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      const density = window.innerWidth < 768 ? 14000 : 9000;
      const count = Math.floor((window.innerWidth * window.innerHeight) / density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.2 + 0.2) * dpr,
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * 0.02 + 0.005,
        vx: 0,
        vy: 0,
      }));
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
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // gentle cursor attraction
        if (mouse.current.active) {
          const dx = mouse.current.x - s.x;
          const dy = mouse.current.y - s.y;
          const dist2 = dx * dx + dy * dy;
          const maxR = 180 * dpr;
          if (dist2 < maxR * maxR) {
            const f = (1 - Math.sqrt(dist2) / maxR) * 0.04;
            s.vx += dx * f * 0.001;
            s.vy += dy * f * 0.001;
          }
        }
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.x += s.vx;
        s.y += s.vy;

        const twinkle = 0.5 + 0.5 * Math.sin(t * (s.tw * 60) + s.x);
        const alpha = s.a * (0.55 + 0.45 * twinkle);

        ctx.beginPath();
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.4, `rgba(200,210,255,${alpha * 0.4})`);
        grad.addColorStop(1, "rgba(120,100,200,0)");
        ctx.fillStyle = grad;
        ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
