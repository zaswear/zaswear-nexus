import { useState } from "react";
import { useLocalStorage, uid } from "../lib/storage";
import { projectById } from "../lib/data";
import type { Task, Idea } from "../types";

type Filter = "all" | "open" | "done";

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [ideas, setIdeas] = useLocalStorage<Idea[]>("ideas", []);
  const [draft, setDraft] = useState("");
  const [idea, setIdea] = useState("");
  const [filter, setFilter] = useState<Filter>("open");

  const shown = tasks.filter((t) => (filter === "all" ? true : filter === "open" ? !t.done : t.done));

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks([{ id: uid(), text, done: false, createdAt: Date.now() }, ...tasks]);
    setDraft("");
  }
  function addIdea(e: React.FormEvent) {
    e.preventDefault();
    const text = idea.trim();
    if (!text) return;
    setIdeas([{ id: uid(), text, createdAt: Date.now() }, ...ideas]);
    setIdea("");
  }

  return (
    <div className="rise">
      <h1 className="serif page-title">Tareas e ideas</h1>
      <p className="page-sub">Captura rápida. Todo se guarda en este navegador.</p>

      <div className="tk-grid">
        <section>
          <div className="tk-filters">
            {(["open", "all", "done"] as Filter[]).map((f) => (
              <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === "open" ? "abiertas" : f === "all" ? "todas" : "hechas"}
              </button>
            ))}
          </div>
          <form onSubmit={addTask} className="tk-add">
            <input className="field" placeholder="Nueva tarea…" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Nueva tarea" />
            <button className="btn btn--accent" type="submit">Añadir</button>
          </form>
          {shown.length === 0 ? (
            <p className="mono tk-empty">Nada por aquí.</p>
          ) : (
            <ul className="tk-list">
              {shown.map((t) => {
                const proj = t.projectId ? projectById(t.projectId) : undefined;
                return (
                  <li key={t.id} className={t.done ? "done" : ""}>
                    <button className="dash-check" data-on={t.done} onClick={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))} aria-label="Completar" />
                    <span>{t.text}</span>
                    {proj && <span className="tk-proj mono" style={{ ["--c" as string]: proj.color }}>{proj.icon} {proj.name}</span>}
                    <button className="tk-del" onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))} aria-label="Borrar">✕</button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="tk-sec">Ideas sueltas</h2>
          <form onSubmit={addIdea} className="tk-add">
            <input className="field" placeholder="Una idea…" value={idea} onChange={(e) => setIdea(e.target.value)} aria-label="Nueva idea" />
            <button className="btn" type="submit">Guardar</button>
          </form>
          {ideas.length === 0 ? (
            <p className="mono tk-empty">Aún sin ideas. La página en blanco asusta. ✦</p>
          ) : (
            <ul className="tk-ideas">
              {ideas.map((i) => (
                <li key={i.id} className="card-surface">
                  <span>{i.text}</span>
                  <button className="tk-del" onClick={() => setIdeas(ideas.filter((x) => x.id !== i.id))} aria-label="Borrar">✕</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <style>{`
        .tk-grid { display: grid; gap: 30px; grid-template-columns: 1fr; }
        @media (min-width: 940px) { .tk-grid { grid-template-columns: 1.2fr 1fr; align-items: start; } }
        .tk-filters { display: flex; gap: 8px; margin-bottom: 14px; }
        .chip { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: .04em;
          min-height: 44px; padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line-hi); background: var(--surface); color: var(--text-mid);
          transition: color .15s, border-color .15s, background .15s, transform .1s; }
        .chip:hover { color: var(--text); border-color: var(--accent); }
        .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); font-weight: 600; }
        .tk-add { display: flex; gap: 8px; margin-bottom: 14px; }
        .tk-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }
        .tk-list li { display: flex; align-items: center; gap: 11px; padding: 11px 4px; border-bottom: 1px solid var(--line); font-size: 14px; }
        .tk-list li span:first-of-type, .tk-list li > span { }
        .tk-list li.done > span { color: var(--text-dim); text-decoration: line-through; }
        .tk-list li > span:nth-child(2) { flex: 1; }
        .dash-check { width: 19px; height: 19px; border-radius: 6px; border: 1.6px solid var(--line-hi); background: transparent; flex-shrink: 0; transition: border-color .15s, background .15s; }
        .dash-check[data-on="true"] { background: var(--accent); border-color: var(--accent); }
        .dash-check:hover { border-color: var(--accent); }
        .tk-proj { font-size: 11px; color: var(--text-mid); padding: 3px 8px; border-radius: 999px; border: 1px solid color-mix(in oklch, var(--c) 35%, var(--line-hi)); background: color-mix(in oklch, var(--c) 12%, transparent); white-space: nowrap; }
        .tk-del { color: var(--text-dim); background: none; border: none; font-size: 13px; padding: 4px 6px; transition: color .15s; }
        .tk-del:hover { color: var(--bad); }
        .tk-empty { color: var(--text-dim); font-size: 13px; padding: 10px 0; }
        .tk-sec { font-size: 14px; letter-spacing: .04em; text-transform: uppercase; color: var(--text-mid); margin-bottom: 13px; }
        .tk-ideas { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .tk-ideas li { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 13px 15px; font-size: 14px; }
      `}</style>
    </div>
  );
}
