import { Link } from "react-router-dom";
import type { Project } from "../types";

export default function ProjectCard({ p, index = 0 }: { p: Project; index?: number }) {
  return (
    <Link
      to={`/proyectos/${p.id}`}
      className="pcard rise"
      style={{ ["--c" as string]: p.color, animationDelay: `${Math.min(index * 40, 320)}ms` }}
      aria-label={`Ver ${p.name}`}
    >
      <div className="pcard-top">
        <span className="pcard-glyph" aria-hidden="true">{p.icon}</span>
        <span className="mono pcard-cat">{p.category}</span>
      </div>
      <div>
        <div className="serif pcard-name">{p.name}</div>
        <div className="mono pcard-tag">{p.tag}</div>
      </div>

      <style>{`
        .pcard {
          --c: var(--accent);
          display: flex; flex-direction: column; justify-content: space-between; gap: 18px;
          min-height: 150px; padding: 16px; position: relative; overflow: hidden;
          border-radius: var(--radius); border: 1px solid var(--line);
          background: linear-gradient(180deg, color-mix(in oklch, var(--c) 8%, var(--surface)), var(--surface));
          box-shadow: var(--shadow);
          transition: transform .2s var(--ease), border-color .2s var(--ease), box-shadow .2s var(--ease);
        }
        .pcard::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0;
          background: radial-gradient(80% 60% at 50% -10%, color-mix(in oklch, var(--c) 24%, transparent), transparent 70%);
          transition: opacity .25s var(--ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .pcard:hover { transform: translateY(-4px); border-color: color-mix(in oklch, var(--c) 55%, var(--line-hi));
            box-shadow: var(--shadow), 0 22px 44px -20px color-mix(in oklch, var(--c) 45%, transparent); }
          .pcard:hover::after { opacity: 1; }
        }
        .pcard:active { transform: translateY(-1px) scale(.99); }
        .pcard-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .pcard-glyph {
          width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; font-size: 25px;
          background: color-mix(in oklch, var(--c) 16%, var(--surface-2));
          border: 1px solid color-mix(in oklch, var(--c) 24%, transparent);
        }
        .pcard-cat { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--text-dim); padding-top: 4px; }
        .pcard-name { font-size: 22px; line-height: 1.08; }
        .pcard-tag { font-size: 11.5px; color: var(--text-mid); margin-top: 5px; }
      `}</style>
    </Link>
  );
}
