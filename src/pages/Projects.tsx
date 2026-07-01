import { useMemo, useState } from "react";
import { projects, categories } from "../lib/data";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!needle) return true;
      return (p.name + " " + p.tag + " " + p.category).toLowerCase().includes(needle);
    });
  }, [q, cat]);

  return (
    <div className="rise">
      <h1 className="serif page-title">Proyectos</h1>
      <p className="page-sub">{projects.length} cosas vivas. Busca o filtra.</p>

      <div className="proj-controls">
        <input
          className="field proj-search"
          placeholder="Buscar proyecto…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar proyecto"
        />
      </div>

      <div className="proj-chips" role="group" aria-label="Filtrar por categoría">
        <Chip on={cat === "all"} onClick={() => setCat("all")} label="todos" n={projects.length} />
        {categories.map((c) => (
          <Chip key={c} on={cat === c} onClick={() => setCat(c)} label={c} n={projects.filter((p) => p.category === c).length} />
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mono proj-empty">Nada coincide con “{q}”.</p>
      ) : (
        <div className="proj-grid">
          {list.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      )}

      <style>{`
        .page-title { font-size: clamp(32px, 5vw, 48px); line-height: 1.05; }
        .page-sub { color: var(--text-mid); margin-top: 4px; margin-bottom: 22px; }
        .proj-controls { margin-bottom: 14px; }
        .proj-search { max-width: 380px; }
        .proj-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
        .proj-grid { display: grid; gap: 14px; grid-template-columns: repeat(2, 1fr); padding-bottom: 32px; }
        @media (min-width: 720px) { .proj-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1040px) { .proj-grid { grid-template-columns: repeat(4, 1fr); } }
        .proj-empty { color: var(--text-dim); padding: 20px 0; }
      `}</style>
    </div>
  );
}

function Chip({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <button className="chip" aria-pressed={on} onClick={onClick}>
      {label} <span className="chip-n">{n}</span>
      <style>{`
        .chip {
          font-family: var(--font-mono); font-size: 12px; letter-spacing: .04em; text-transform: uppercase;
          min-height: 44px; padding: 8px 14px; display: inline-flex; align-items: center; gap: 7px;
          border-radius: 999px; border: 1px solid var(--line-hi); background: var(--surface); color: var(--text-mid);
          transition: color .15s var(--ease), border-color .15s, background .15s, transform .1s;
        }
        .chip:hover { color: var(--text); border-color: var(--accent); }
        .chip[aria-pressed="true"] { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); font-weight: 600; }
        .chip-n { opacity: .6; }
      `}</style>
    </button>
  );
}
