# figma-make-app

Root Vite + React + Tailwind scaffold — Figma Make host preview and frontend.

## Vite frontend (React 19, Tailwind v4, Vite 8)

- Dev server runs on `$PORT` (default 8443), host `0.0.0.0`, `strictPort: true`. It is managed by Figma Make; don't add a separate start script.
- Scripts (run with bun): `bun run dev`, `bun run build`, `bun run preview`, `bun run format`. Install deps with `bun install`.
- Entry: `src/main.tsx` mounts `src/App.tsx` into `#root` in `index.html`; imports `src/index.css`.
- Alias: `@` → `src` (vite.config.ts, tsconfig.json).
- Global CSS/Tailwind v4 theme customization goes in `src/index.css`; `@import 'tailwindcss';` must stay first. Put element resets in `@layer base`.
- Export components as default exports.
- No test runner configured for the frontend.
