import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../lib/data";

interface Item {
  id: string;
  label: string;
  hint: string;
  glyph: string;
  to: string;
}

const NAV: Item[] = [
  { id: "nav-home", label: "Inicio", hint: "ir", glyph: "◧", to: "/" },
  { id: "nav-proj", label: "Proyectos", hint: "ir", glyph: "▦", to: "/proyectos" },
  { id: "nav-task", label: "Tareas e ideas", hint: "ir", glyph: "✓", to: "/tareas" },
  { id: "nav-link", label: "Enlaces", hint: "ir", glyph: "↗", to: "/enlaces" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const items = useMemo<Item[]>(() => {
    const proj: Item[] = projects.map((p) => ({ id: p.id, label: p.name, hint: p.category, glyph: p.icon, to: `/proyectos/${p.id}` }));
    return [...NAV, ...proj];
  }, []);

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    return items.filter((it) => (it.label + " " + it.hint).toLowerCase().includes(n));
  }, [q, items]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ(""); setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  function go(it: Item) {
    setOpen(false);
    navigate(it.to);
  }

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === "Enter" && results[sel]) { e.preventDefault(); go(results[sel]); }
  }

  if (!open) return null;

  return (
    <div className="cmdk-backdrop" onClick={() => setOpen(false)}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Buscar" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Buscar proyecto o vista…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            aria-label="Buscar"
          />
          <kbd className="mono cmdk-esc">esc</kbd>
        </div>
        <ul className="cmdk-list">
          {results.length === 0 && <li className="cmdk-empty mono">Nada coincide.</li>}
          {results.map((it, i) => (
            <li key={it.id}>
              <button
                className="cmdk-item"
                data-sel={i === sel}
                onMouseEnter={() => setSel(i)}
                onClick={() => go(it)}
              >
                <span className="cmdk-glyph" aria-hidden="true">{it.glyph}</span>
                <span className="cmdk-label">{it.label}</span>
                <span className="mono cmdk-hint">{it.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .cmdk-backdrop {
          position: fixed; inset: 0; z-index: 200; display: flex; align-items: flex-start; justify-content: center;
          padding-top: 14vh; background: oklch(8% 0.02 256 / 55%); backdrop-filter: blur(3px);
          animation: cmdkFade .14s var(--ease);
        }
        .cmdk {
          width: min(560px, 92vw); max-height: 64vh; display: flex; flex-direction: column; overflow: hidden;
          background: var(--surface); border: 1px solid var(--line-hi); border-radius: 16px;
          box-shadow: 0 24px 64px -20px oklch(0% 0 0 / 60%);
          animation: cmdkIn .2s var(--ease);
        }
        .cmdk-input-row { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--line); color: var(--text-dim); }
        .cmdk-input { flex: 1; background: none; border: none; outline: none; font-size: 16px; color: var(--text); }
        .cmdk-input::placeholder { color: var(--text-dim); }
        .cmdk-esc { font-size: 10px; padding: 2px 6px; border: 1px solid var(--line-hi); border-radius: 5px; color: var(--text-dim); }
        .cmdk-list { list-style: none; overflow-y: auto; padding: 6px; }
        .cmdk-item {
          width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; min-height: 44px;
          border-radius: 10px; background: transparent; border: none; color: var(--text); text-align: left;
        }
        .cmdk-item[data-sel="true"] { background: color-mix(in oklch, var(--accent) 16%, var(--surface-2)); }
        .cmdk-glyph { width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; font-size: 15px; background: var(--surface-2); border: 1px solid var(--line); }
        .cmdk-label { flex: 1; font-size: 14px; }
        .cmdk-hint { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: .08em; }
        .cmdk-empty { padding: 20px; color: var(--text-dim); text-align: center; }
        @keyframes cmdkFade { from { opacity: 0; } }
        @keyframes cmdkIn { from { opacity: 0; transform: translateY(-10px) scale(.97); } }
        @media (prefers-reduced-motion: reduce) { .cmdk-backdrop, .cmdk { animation: none; } }
      `}</style>
    </div>
  );
}
