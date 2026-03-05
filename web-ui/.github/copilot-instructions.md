# Copilot Instructions for json-viewer Web UI

## Project Overview

`@textea/json-viewer` is a highly customizable React component library for viewing and editing any kind of data (not just JSON). It supports objects, arrays, primitive types, `Map`, `Set`, and custom data types via a plugin system.

- **npm package**: `@textea/json-viewer`
- **Documentation site**: `https://viewer.textea.io`
- **Repository**: `https://github.com/TexteaInc/json-viewer`

## Tech Stack

- **Language**: TypeScript (100% typed)
- **UI framework**: React 17/18
- **Component library**: [MUI (Material-UI) v6](https://mui.com/) with `@emotion/react` and `@emotion/styled`
- **State management**: [Zustand v4](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Build tool**: Rollup with SWC
- **Test runner**: Vitest with `@testing-library/react`
- **Linter/Formatter**: ESLint + Prettier
- **Package manager**: pnpm (v9) with workspaces

## Workspace Structure

```
<repo-root>/                # Root – the @textea/json-viewer library package
├── src/                    # Library source code
│   ├── index.tsx           # Main entry: exports JsonViewer component and utilities
│   ├── type.ts             # All public TypeScript types (JsonViewerProps, DataType, etc.)
│   ├── components/         # React components
│   │   ├── DataKeyPair.tsx
│   │   ├── DataTypeLabel.tsx
│   │   ├── Icons.tsx
│   │   ├── DataTypes/      # Built-in type renderers (Boolean, String, Number, etc.)
│   │   └── mui/            # MUI-based UI pieces
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand stores
│   │   ├── JsonViewerStore.ts   # Main viewer state
│   │   └── typeRegistry.tsx     # Custom data type registry
│   ├── theme/              # Base16 colorspace themes (light/dark)
│   └── utils/              # Utility functions (applyValue, deleteValue, etc.)
├── tests/                  # Vitest tests
├── docs/                   # @textea/json-viewer-docs — Next.js documentation site
└── web-ui/                 # Web UI workspace
    └── .github/
        └── copilot-instructions.md   # ← you are here
```

## Key Concepts

### `JsonViewerProps`
The main props interface for the `<JsonViewer />` component, defined in `src/type.ts`. Key props:
- `value` – any data to display (required)
- `theme` – `'light' | 'dark' | 'auto' | Colorspace` (Base16)
- `editable` – `boolean` or a function `(path, value) => boolean`
- `enableAdd`, `enableDelete`, `enableClipboard`
- `valueTypes` – array of custom `DataType` definitions
- `onChange`, `onCopy`, `onSelect`, `onAdd`, `onDelete` callbacks

### `DataType<ValueType>`
Defined in `src/type.ts`. Use `defineDataType` from `src/utils` to create custom types:
```ts
import { defineDataType } from '@textea/json-viewer'

const myType = defineDataType<MyValue>({
  is: (value, path) => value instanceof MyValue,
  Component: ({ value }) => <span>{String(value)}</span>,
})
```

### Theming
Supports `'light'`, `'dark'`, `'auto'` (follows OS setting), or a full [Base16](https://github.com/chriskempson/base16) colorspace object. The `Colorspace` type and built-in `lightColorspace`/`darkColorspace` are exported from the package.

## Coding Conventions

- **TypeScript**: Use strict typing. All public APIs should have explicit types. Avoid `any` except where necessary for generic flexibility.
- **React**: Use functional components with hooks. Prefer `useMemo` and `useCallback` for performance-sensitive code.
- **Exports**: All public API exports live in `src/index.tsx`. Do not export internal implementation details.
- **Zustand stores**: Use the context-based store pattern (`createJsonViewerStore`, `JsonViewerStoreContext`) already established in `src/stores/`.
- **Imports**: Use simple import sort (enforced by `eslint-plugin-simple-import-sort`). Group: external libraries first, then internal modules.
- **Testing**: Tests live in `tests/`. Use `@testing-library/react` with Vitest. Run tests with `pnpm test`.
- **Linting**: Run `pnpm lint` to auto-fix, or `pnpm lint:ci` for CI (no auto-fix, zero warnings).
- **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint).

## Development Commands

```sh
pnpm install          # Install all dependencies
pnpm test             # Run tests once (vitest run)
pnpm test:watch       # Watch mode
pnpm coverage         # Generate coverage report
pnpm lint             # Lint and auto-fix
pnpm lint:ci          # Lint in CI mode (no auto-fix)
pnpm build            # Build library (tsc + rollup)
pnpm dev              # Start docs site dev server
```

## Common Patterns

### Adding a new built-in data type renderer
1. Create a new file in `src/components/DataTypes/` (e.g., `MyType.tsx`)
2. Export the `DataType` definition
3. Register it in `src/stores/typeRegistry.tsx` in the `predefinedTypes` array
4. Re-export from `src/components/DataTypes/index.ts`

### Accessing viewer state
Use Zustand hooks inside components wrapped with the store context:
```ts
import { useJsonViewerStore } from '../stores/JsonViewerStore'
const value = useJsonViewerStore(store => store.value)
```

### Customizing rendering for specific paths/values
Pass `valueTypes` prop to `<JsonViewer />` with custom `DataType` definitions. The `is()` function controls which values match.
