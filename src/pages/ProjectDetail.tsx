import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectById } from "../lib/data";
import { useLocalStorage, uid } from "../lib/storage";
import type { Task } from "../types";

export default function ProjectDetail() {
  const { id } = useParams();
  const p = projectById(id);
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [draft, setDraft] = useState("");

  if (!p) {
    return (
      <div className="rise">
        <p className="mono">Proyecto no encontrado.</p>
        <Link to="/proyectos" className="btn" style={{ marginTop: 12 }}>← Proyectos</Link>
      </div>
    );
  }

  const mine = tasks.filter((t) => t.projectId === p.id);
  function add(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks([{ id: uid(), text, done: false, projectId: p!.id, createdAt: Date.now() }, ...tasks]);
    setDraft("");
  }
  function toggle(tid: string) { setTasks(tasks.map((t) => (t.id === tid ? { ...t, done: !t.done } : t))); }
  function del(tid: string) { setTasks(tasks.filter((t) => t.id !== tid)); }

  return (
    <div className="rise" style={{ ["--c" as string]: p.color }}>
      <Link to="/proyectos" className="mono pd-back">← proyectos</Link>

      <header className="pd-hero card-surface">
        <span className="pd-glyph" aria-hidden="true">{p.icon}</span>
        <div className="pd-meta">
          <div className="mono pd-cat">{p.category} · {p.type}</div>
          <h1 className="serif pd-name">{p.name}</h1>
          <div className="mono pd-tag">{p.tag}</div>
          {p.desc && <p className="pd-desc">{p.desc}</p>}
          <a href={p.url} target="_blank" rel="noopener" className="btn btn--accent pd-open">
            Abrir proyecto
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </a>
        </div>
      </header>

      <section className="pd-tasks">
        <h2 className="pd-sec">Tareas de este proyecto</h2>
        <form onSubmit={add} className="pd-add">
          <input className="field" placeholder={`Nueva tarea para ${p.name}…`} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Nueva tarea" />
          <button className="btn btn--accent" type="submit">Añadir</button>
        </form>
        {mine.length === 0 ? (
          <p className="mono pd-empty">Sin tareas para este proyecto.</p>
        ) : (
          <ul className="pd-list">
            {mine.map((t) => (
              <li key={t.id} className={t.done ? "done" : ""}>
                <button className="dash-check" onClick={() => toggle(t.id)} aria-label="Completar" data-on={t.done} />
                <span>{t.text}</span>
                <button className="pd-del" onClick={() => del(t.id)} aria-label="Borrar">✕</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <style>{`
        .pd-back { color: var(--text-dim); font-size: 12px; display: inline-block; margin-bottom: 16px; transition: color .15s; }
        .pd-back:hover { color: var(--accent); }
        .pd-hero { display: flex; gap: 20px; padding: 24px; align-items: flex-start;
          background: linear-gradient(180deg, color-mix(in oklch, var(--c) 9%, var(--surface)), var(--surface)); }
        .pd-glyph { width: 76px; height: 76px; border-radius: 18px; display: grid; place-items: center; font-size: 42px; flex-shrink: 0;
          background: color-mix(in oklch, var(--c) 16%, var(--surface-2)); border: 1px solid color-mix(in oklch, var(--c) 26%, transparent); }
        .pd-cat { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-dim); }
        .pd-name { font-size: clamp(30px, 5vw, 44px); line-height: 1.04; margin-top: 4px; }
        .pd-tag { font-size: 13px; color: var(--text-mid); margin-top: 6px; }
        .pd-desc { color: var(--text-mid); margin-top: 12px; max-width: 60ch; }
        .pd-open { margin-top: 18px; }
        .pd-tasks { margin-top: 30px; }
        .pd-sec { font-size: 14px; letter-spacing: .04em; text-transform: uppercase; color: var(--text-mid); margin-bottom: 13px; }
        .pd-add { display: flex; gap: 8px; margin-bottom: 12px; max-width: 560px; }
        .pd-list { list-style: none; display: flex; flex-direction: column; gap: 2px; max-width: 560px; }
        .pd-list li { display: flex; align-items: center; gap: 11px; padding: 10px 4px; border-bottom: 1px solid var(--line); font-size: 14px; }
        .pd-list li.done span { color: var(--text-dim); text-decoration: line-through; }
        .dash-check { width: 19px; height: 19px; border-radius: 6px; border: 1.6px solid var(--line-hi); background: transparent; flex-shrink: 0; transition: border-color .15s, background .15s; }
        .dash-check[data-on="true"] { background: var(--accent); border-color: var(--accent); }
        .dash-check:hover { border-color: var(--accent); }
        .pd-list li span { flex: 1; }
        .pd-del { color: var(--text-dim); background: none; border: none; font-size: 13px; padding: 4px 6px; transition: color .15s; }
        .pd-del:hover { color: var(--bad); }
        .pd-empty { color: var(--text-dim); font-size: 13px; padding: 8px 0; }
      `}</style>
    </div>
  );
}
