# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build library (outputs to lib/)
yarn build

# Type check only
yarn typecheck

# Lint
yarn lint

# Run all tests
yarn test

# Run a single test file
yarn test test/SplitterLayout.spec.tsx

# Run tests with coverage
yarn coverage

# Start example dev server
yarn example
```

## Architecture

This is a React component library that provides a draggable splitter layout. It is published as a UMD bundle via webpack.

### Source structure

- `src/components/SplitterLayout.tsx` — Main function component. Manages drag state (`resizing`, `secondaryPaneSize`) via `useState` and event listeners for mouse/touch/resize via `useEffect`. Uses `requestAnimationFrame` to throttle `mousemove` handling. Exports `SplitterLayoutProps` interface.
- `src/components/Pane.tsx` — Stateless wrapper component. Renders a `div` with either pixel or percentage width/height depending on `percentage` prop. The primary pane gets no explicit size (flexes to fill); the secondary pane gets an explicit size.
- `src/components/paneSizeCalculator.ts` — Pure function `calculateSecondaryPaneSize`. Extracted from `SplitterLayout` to enable unit testing of sizing logic independently. Takes config, container rect, splitter rect, and client position; returns secondary pane size in px or %. Exports `SizeCalculatorConfig`, `Rect`, and `ClientPosition` interfaces.
- `src/stylesheets/index.css` — Component styles. Copied as-is to `lib/` at build time.
- `index.ts` — Library entry point; re-exports `SplitterLayout` and `SplitterLayoutProps`.

### Key design decisions

- Only the **secondary pane** has an explicit size. The primary pane always fills remaining space via CSS flexbox.
- On window resize with pixel mode (`percentage: false`), the secondary pane size is recalculated to keep the splitter at its current position relative to the container. With `percentage: true`, no recalculation is needed.
- `primaryIndex` (0 or 1) determines which child is primary. The other child is always the secondary pane.
- Max 2 children are rendered; additional children are ignored.
- Event handler callbacks (`onDragStart`, `onDragEnd`, `onSecondaryPaneSizeChange`) are called directly within handlers rather than via `useEffect`, using prop refs to avoid stale closures.

### Build output

webpack builds to `lib/` as a UMD library with `react` as an external. `tsc --emitDeclarationOnly` generates `lib/index.d.ts`. CSS is copied separately by `CopyWebpackPlugin`.

### Testing

Tests use Vitest + jsdom + `@testing-library/react`. CSS imports are mocked via `identity-obj-proxy`. Tests live in `test/` alongside spec files for each source module.

ESLint uses flat config (`eslint.config.mjs`) with `typescript-eslint` for `.ts`/`.tsx` files. Max line length is 120.
