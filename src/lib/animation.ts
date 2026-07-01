import { useEffect, useRef, useState } from "react";

/** True si el usuario prefiere movimiento reducido (reactivo). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Cuenta de 0 → target con easing. Devuelve el valor actual. */
export function useCountUp(target: number, duration = 900): number {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? target : 0);
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) { setVal(target); return; }
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, reduced]);

  return val;
}

/**
 * Tilt 3D + spotlight: escucha el ratón sobre el elemento y escribe las CSS vars
 * --mx/--my (0..1, posición), --rx/--ry (grados de inclinación). Desactivado con
 * reduced-motion o en táctil.
 */
export function useTilt<T extends HTMLElement>(max = 6) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    function move(e: MouseEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el!.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        el!.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
        el!.style.setProperty("--ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
        el!.style.setProperty("--rx", `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
      });
    }
    function leave() {
      cancelAnimationFrame(frame);
      el!.style.setProperty("--ry", "0deg");
      el!.style.setProperty("--rx", "0deg");
      el!.style.setProperty("--mx", "50%");
      el!.style.setProperty("--my", "50%");
    }
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [max, reduced]);

  return ref;
}
