# ZaswearProjects — Brand Kit

Developer workspace / PWA dashboard. Dark mission-control language, cool-slate
neutrals with one committed warm accent plus two cool signal colors. Built to
serve the task, not to shout.

Tokens live in [src/index.css](src/index.css) as OKLCH custom properties and drive
both dark (default) and light themes.

---

## 1. Color palette (3 colors + neutrals)

### Brand colors

| Role | Token | Dark (OKLCH) | Use |
|---|---|---|---|
| Primary / Amber | `--accent` | `oklch(80% 0.145 78)` | Active nav, primary buttons, focus, brand node |
| Secondary / Cyan | `--accent-2` | `oklch(78% 0.105 215)` | Links, info, secondary highlights, charts |
| Positive / Emerald | `--accent-3` (`--good`) | `oklch(76% 0.15 158)` | Build-passing, done tasks, positive deltas |

Amber carries the identity; cyan and emerald are functional signal, used
sparingly. One accent (amber) is locked for primary actions across every screen.

### Neutrals (cool slate, tinted toward hue 256)

| Token | Dark | Job |
|---|---|---|
| `--bg` / `--bg-deep` | `16% / 13%` L | Canvas, sunken wells |
| `--surface` / `--surface-2` | `20% / 24%` L | Cards, raised panels |
| `--line` / `--line-hi` | white @ 9% / 16% | Hairlines, borders |
| `--text` / `--text-mid` / `--text-dim` | `94% / 72% / 56%` L | Text ramp |

No pure black or white. Chroma stays low near the lightness extremes. Signal
red (`--bad`) and warn (`--warn`) are functional only, never brand decoration.

---

## 2. Typography pair

| Face | Token | Where |
|---|---|---|
| Space Grotesk | `--font-display` | Brand wordmark, headings, UI labels, buttons |
| JetBrains Mono | `--font-mono` (`.mono`) | Numbers, metadata, timestamps, code, tabular data |

Space Grotesk gives a technical geometric grotesk without reaching for Inter;
JetBrains Mono handles the data register a dashboard needs. Emphasis inside a
heading uses italic or weight of the same family, never a second family.

Loaded via `<link>` in [index.html](index.html) for now. Production should
self-host (`@fontsource/space-grotesk`, `@fontsource/jetbrains-mono`) to drop
the render-blocking request.

---

## 3. Logo concept

A "Z-node" monogram: a single angular Z drawn as a stacked path (suggesting
layered projects) with the top-right terminal lit as an amber node (the active
workspace). Reads at 16px in the sidebar and scales to a favicon.

- Standalone asset: [public/brand/zaswearprojects-logo.svg](public/brand/zaswearprojects-logo.svg)
- Applied inline in the shell sidebar ([src/components/Layout.tsx](src/components/Layout.tsx)),
  where the Z uses `currentColor` and the node uses `--accent`, so it themes
  automatically in light and dark.

Wordmark: `Zaswear` in `--text` + `Projects` in `--text-dim`, Space Grotesk,
tight tracking.

---

## 4. Applied to

The dashboard shell: sidebar brand lockup, nav active state, buttons, cards,
inputs, and focus rings all read from the tokens above. Changing a single token
re-skins the whole workspace.
