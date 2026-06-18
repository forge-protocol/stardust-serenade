import { useEffect, useRef, useState } from "react";

// Soft ambient piano-ish drone synthesized via WebAudio (no external assets).
export function MusicToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => () => nodesRef.current?.stop(), []);

  const start = async () => {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2);

    // Slow chord pad — A minor 9 feel
    const freqs = [220, 261.63, 329.63, 415.3, 493.88];
    const oscs = freqs.map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.18;
      // gentle vibrato
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.15 + Math.random() * 0.2;
      lfoGain.gain.value = 0.8;
      lfo.connect(lfoGain).connect(o.frequency);
      o.connect(g).connect(master);
      o.start();
      lfo.start();
      return { o, lfo };
    });

    nodesRef.current = {
      stop: () => {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        setTimeout(() => {
          oscs.forEach(({ o, lfo }) => { o.stop(); lfo.stop(); });
          ctx.close();
        }, 1600);
      },
    };
  };

  const toggle = async () => {
    if (on) {
      nodesRef.current?.stop();
      nodesRef.current = null;
      setOn(false);
    } else {
      await start();
      setOn(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Mute ambient music" : "Play ambient music"}
      className="glass-panel fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full text-[color:var(--color-silver)] transition-transform hover:scale-105"
    >
      {on ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V6l10-2v12" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V6l10-2v12" opacity="0.6" />
          <circle cx="6" cy="18" r="3" opacity="0.6" />
          <circle cx="16" cy="16" r="3" opacity="0.6" />
          <line x1="3" y1="3" x2="21" y2="21" />
        </svg>
      )}
    </button>
  );
}
