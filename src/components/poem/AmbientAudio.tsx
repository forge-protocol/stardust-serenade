import { useEffect, useRef } from "react";
import ambient from "@/assets/ambient.mp3.asset.json";

export function AmbientAudio() {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(ambient.url);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";
    ref.current = audio;

    let started = false;
    let raf = 0;

    const fadeIn = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 2400);
        audio.volume = t * 0.55;
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const tryStart = () => {
      if (started) return;
      started = true;
      audio
        .play()
        .then(fadeIn)
        .catch(() => {
          started = false;
        });
    };

    const onInteract = () => tryStart();

    window.addEventListener("scroll", onInteract, { passive: true });
    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("touchstart", onInteract, { passive: true });
    window.addEventListener("keydown", onInteract);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("keydown", onInteract);
      audio.pause();
      audio.src = "";
    };
  }, []);

  return null;
}
