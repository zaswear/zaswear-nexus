import { useState } from "react";
import { useLocalStorage, uid } from "../lib/storage";
import type { Bookmark } from "../types";

function favicon(url: string): string {
  try {
    const h = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${h}&sz=64`;
  } catch {
    return "";
  }
}

export default function Bookmarks() {
  const [marks, setMarks] = useLocalStorage<Bookmark[]>("bookmarks", []);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  function add(e: React.FormEvent) {
    e.preventDefault();
    let u = url.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    setMarks([{ id: uid(), label: label.trim() || new URL(u).hostname, url: u, createdAt: Date.now() }, ...marks]);
    setLabel(""); setUrl("");
  }

  return (
    <div className="rise">
      <h1 className="serif page-title">Enlaces</h1>
      <p className="page-sub">Tus accesos rápidos. Guardados en este navegador.</p>

      <form onSubmit={add} className="bm-add card-surface">
        <input className="field" placeholder="Etiqueta (opcional)" value={label} onChange={(e) => setLabel(e.target.value)} aria-label="Etiqueta" />
        <input className="field" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="URL" inputMode="url" />
        <button className="btn btn--accent" type="submit">Guardar</button>
      </form>

      {marks.length === 0 ? (
        <p className="mono bm-empty">Sin enlaces todavía.</p>
      ) : (
        <div className="bm-grid">
          {marks.map((m, i) => (
            <a key={m.id} href={m.url} target="_blank" rel="noopener" className="bm card-surface rise" style={{ animationDelay: `${Math.min(i * 35, 280)}ms` }}>
              <img className="bm-fav" src={favicon(m.url)} alt="" width={28} height={28} loading="lazy" />
              <div className="bm-meta">
                <div className="bm-label">{m.label}</div>
                <div className="mono bm-url">{new URL(m.url).hostname}</div>
              </div>
              <button className="bm-del" onClick={(e) => { e.preventDefault(); setMarks(marks.filter((x) => x.id !== m.id)); }} aria-label="Borrar enlace">✕</button>
            </a>
          ))}
        </div>
      )}

      <style>{`
        .bm-add { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 8px; padding: 12px; margin-bottom: 22px; max-width: 720px; }
        @media (max-width: 560px) { .bm-add { grid-template-columns: 1fr; } }
        .bm-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); padding-bottom: 32px; }
        .bm { display: flex; align-items: center; gap: 13px; padding: 14px; position: relative; transition: transform .18s var(--ease), border-color .18s; }
        @media (hover: hover) { .bm:hover { transform: translateY(-3px); border-color: var(--accent); } .bm:hover .bm-del { opacity: 1; } }
        .bm-fav { border-radius: 7px; flex-shrink: 0; background: var(--surface-2); outline: 1px solid var(--line); }
        .bm-meta { min-width: 0; }
        .bm-label { font-size: 14.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bm-url { font-size: 11.5px; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bm-del { position: absolute; top: 8px; right: 8px; opacity: 0; background: none; border: none; color: var(--text-dim); font-size: 12px; padding: 4px 6px; transition: color .15s, opacity .15s; }
        .bm-del:hover { color: var(--bad); }
        .bm-empty { color: var(--text-dim); padding: 16px 0; }
      `}</style>
    </div>
  );
}
