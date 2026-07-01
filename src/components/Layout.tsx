import { NavLink, Outlet } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useLocalStorage } from "../lib/storage";

const ICONS: Record<string, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />,
  grid: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></>,
  check: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="m8 12 3 3 5-6" /></>,
  link: <path d="M19 5 5 19M9 5h10v10" />,
};

const NAV = [
  { to: "/", icon: "home", label: "Inicio", end: true },
  { to: "/proyectos", icon: "grid", label: "Proyectos" },
  { to: "/tareas", icon: "check", label: "Tareas" },
  { to: "/enlaces", icon: "link", label: "Enlaces" },
];

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export default function Layout() {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme", "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="side-brand">
          <NavLink to="/" end className="brand-lock" aria-label="ZaswearProjects — Inicio">
            <svg className="brand-mark" viewBox="0 0 32 32" width="30" height="30" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="30" height="30" rx="8" fill="var(--surface)" stroke="var(--line-hi)" />
              <path d="M9 10 H23 L10 22 H23" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="23" cy="10" r="3.1" fill="var(--accent)" />
            </svg>
            <span className="brand-word">
              <b>Zaswear</b><span>Projects</span>
            </span>
          </NavLink>
          <span className="mono side-sub">workspace</span>
        </div>
        <nav className="side-nav" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="side-link">
              <Icon name={n.icon} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          className="side-theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <span className="mono">{theme === "dark" ? "Claro" : "Oscuro"}</span>
        </button>
      </aside>

      <main className="main">
        <Outlet />
      </main>

      <style>{`
        .sidebar {
          position: sticky; top: 0; align-self: start; height: 100dvh;
          display: flex; flex-direction: column; gap: 6px;
          padding: 22px 16px; border-right: 1px solid var(--line);
          background: color-mix(in oklch, var(--bg-deep) 60%, transparent);
        }
        .side-brand { display: flex; flex-direction: column; padding: 0 8px 18px; }
        .brand-lock { display: flex; align-items: center; gap: 10px; color: var(--text); }
        .brand-mark { flex-shrink: 0; }
        .brand-word { font-family: var(--font-display); font-size: 16px; font-weight: 700; letter-spacing: -0.01em; line-height: 1; }
        .brand-word b { font-weight: 700; }
        .brand-word span { color: var(--text-dim); font-weight: 500; }
        .side-sub { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--text-dim); margin: 8px 0 0 40px; }
        .side-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .side-link {
          display: flex; align-items: center; gap: 11px; min-height: 44px; padding: 0 12px;
          border-radius: var(--radius-sm); color: var(--text-mid); font-size: 14px; font-weight: 500;
          transition: background .15s var(--ease), color .15s var(--ease);
        }
        .side-link:hover { background: var(--surface); color: var(--text); }
        .side-link.active { background: color-mix(in oklch, var(--accent) 16%, var(--surface)); color: var(--text); }
        .side-link.active svg { color: var(--accent); }
        .side-theme {
          display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 12px;
          background: transparent; border: 1px solid var(--line-hi); border-radius: var(--radius-sm);
          color: var(--text-mid); font-size: 12.5px; transition: color .15s, border-color .15s, transform .1s;
        }
        .side-theme:hover { color: var(--text); border-color: var(--accent); }

        @media (max-width: 780px) {
          .sidebar {
            position: fixed; bottom: 0; left: 0; right: 0; top: auto; height: auto; z-index: 40;
            flex-direction: row; align-items: center; gap: 2px; padding: 6px 8px;
            border-right: none; border-top: 1px solid var(--line);
            background: color-mix(in oklch, var(--bg) 88%, transparent); backdrop-filter: blur(12px);
          }
          .side-brand { display: none; }
          .side-nav { flex-direction: row; flex: 1; justify-content: space-around; }
          .side-link { flex-direction: column; gap: 2px; min-height: 52px; font-size: 10px; padding: 6px 4px; flex: 1; }
          .side-link span { font-size: 10px; }
          .side-theme { min-width: 52px; min-height: 52px; flex-direction: column; gap: 2px; font-size: 10px; border: none; }
        }
      `}</style>
    </div>
  );
}
