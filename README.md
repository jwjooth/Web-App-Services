# Shop MVP / Figma Make App

React 19, Tailwind v4, Vite 8 frontend scaffold.

## Architecture & Features

- `src/features/catalog/`: Product types, display helpers, and demo catalog data.
- `src/features/cart/`: In-memory shopping cart state and quantity operations.
- `src/features/orders/`: Sample order records and status definitions.
- `src/features/user/`: Demo profile and delivery address records.
- State is session-only and in-memory (resets on reload).

## Development

- Install dependencies: `bun install`
- Start dev server: `bun run dev`
- Build: `bun run build`
- Preview: `bun run preview`
- Format: `bun run format`
