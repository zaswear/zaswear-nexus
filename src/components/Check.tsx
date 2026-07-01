/** Checkbox con palomita dibujada (stroke draw) al marcar. */
export default function Check({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="nx-check"
      data-on={checked}
      onClick={onClick}
      aria-pressed={checked}
      aria-label={label ?? (checked ? "Marcar como pendiente" : "Completar")}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path className="nx-check-tick" d="M5 12.5 L10 17 L19 6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <style>{`
        .nx-check {
          width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; padding: 0;
          border: 1.6px solid var(--line-hi); background: transparent; color: var(--accent-ink);
          display: grid; place-items: center;
          transition: border-color .15s var(--ease), background .2s var(--ease), transform .1s;
        }
        .nx-check:hover { border-color: var(--accent); }
        .nx-check[data-on="true"] { background: var(--accent); border-color: var(--accent); }
        .nx-check svg { overflow: visible; }
        .nx-check-tick {
          stroke-dasharray: 26; stroke-dashoffset: 26;
          transition: stroke-dashoffset .28s var(--ease);
        }
        .nx-check[data-on="true"] .nx-check-tick { stroke-dashoffset: 0; }
        @media (prefers-reduced-motion: reduce) { .nx-check-tick { transition: none; } }
      `}</style>
    </button>
  );
}
