import { useEffect, useState } from "react";

const LINES = [
  "NEXUS // workspace",
  "› cargando proyectos…",
  "› sincronizando estado…",
  "› listo.",
];

export default function BootSequence() {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const seen = typeof sessionStorage !== "undefined" && sessionStorage.getItem("nexus:booted") === "1";
  const [done, setDone] = useState(seen || !!reduced);

  useEffect(() => {
    if (done) return;
    sessionStorage.setItem("nexus:booted", "1");
    const t = setTimeout(() => setDone(true), 1900);
    const skip = () => setDone(true);
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => { clearTimeout(t); window.removeEventListener("keydown", skip); window.removeEventListener("pointerdown", skip); };
  }, [done]);

  if (done) return null;

  return (
    <div className="boot" role="presentation">
      <div className="boot-grid" />
      <div className="boot-lines mono">
        {LINES.map((l, i) => (
          <div className="boot-line" style={{ animationDelay: `${i * 360}ms` }} key={i}>{l}</div>
        ))}
      </div>
      <style>{`
        .boot {
          position: fixed; inset: 0; z-index: 300; display: grid; place-items: center;
          background: var(--bg-deep); animation: bootOut .5s var(--ease) 1.5s forwards;
        }
        .boot-grid {
          position: absolute; inset: 0; opacity: .5;
          background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 38px 38px;
          mask-image: radial-gradient(circle at center, black, transparent 70%);
          animation: bootGrid 1.6s var(--ease);
        }
        .boot-lines { position: relative; display: flex; flex-direction: column; gap: 8px; font-size: 14px; color: var(--text-mid); }
        .boot-line { opacity: 0; transform: translateY(6px); animation: bootLine .4s var(--ease) forwards; }
        .boot-line:last-child { color: var(--accent); }
        @keyframes bootLine { to { opacity: 1; transform: none; } }
        @keyframes bootGrid { from { opacity: 0; transform: scale(1.08); } }
        @keyframes bootOut { to { opacity: 0; visibility: hidden; } }
      `}</style>
    </div>
  );
}
