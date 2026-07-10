# DSSSP Library — AI Instructions

## Code Style

### General

- **Language** — all code comments, documentation files, commit messages, and PR descriptions must be written in **English**. No exceptions. (Chat with the author may be in any language — this rule is about committed artifacts.)
- **Named exports only** — no default exports in library code. _Exception:_ Storybook stories and `.mdx` docs, where the CSF format requires `export default meta`.
- **camelCase everywhere** — including constants; no SCREAMING_CASE.
- **Imports** — no automatic import-sorter is configured (ESLint here does not sort imports). Don't reorder imports wholesale; follow the grouping already present in the file you're editing (Node built-ins → external packages → internal relative modules).
- **ESLint clean** — no ESLint errors or warnings in committed code — fix immediately, never suppress. The Husky pre-commit hook runs `npm run lint` (`tsc && eslint .`) and **blocks the commit on any error** (e.g. unused variables error via `@typescript-eslint/no-unused-vars`).
- **Dead code** — unused imports, variables, props, and files must be deleted immediately as part of every task. Never ask for confirmation. Never leave anything "just in case".
- **Validation during implementation** — while working, treat **TypeScript** type errors as the signal to act on. Prettier formats on save and ESLint auto-fixes fixable issues on save (configured in `.vscode/settings.json`; the same formatting also runs via `npm run format` and the pre-commit hook), so don't hand-format or manually fix mechanical lint nits. Any remaining (non-auto-fixable) ESLint error still **blocks the commit** via the pre-commit hook — resolve those before committing.
- **State** — React Context only: the library ships `GraphProvider` and the `useGraph` hook. No Redux/Zustand.
- **Boy Scout Rule** — leave every file you touch cleaner than you found it. Fix naming, split oversized components, remove dead code — within the file being changed, not across adjacent code.
- **No confabulation** — never present an assumption as a verified fact. If you haven't checked (read a file, run a search, run the build), you don't know. Say "I haven't verified …" and check — don't guess and assert. This applies especially to: the exported API surface, prop semantics, and any rendering/runtime behaviour you haven't confirmed in the source.

### Naming

Follow **Intention-Revealing Names** (Clean Code, Robert Martin): names should answer _"what is this for?"_, not _"what type/state is this?"_.

**No `is`/`has`/`can`/`should` prefixes — hard rule.** These are Systems Hungarian notation: they encode the value's type (boolean) into the name instead of its meaning. TypeScript already carries the type. Applies to:

- boolean variables — `loading`, not `isLoading`; `dragging`, not `isDragging`; `open`, not `isOpen`
- boolean props — `<Modal open />`, not `<Modal isOpen />`
- boolean fields on types we own — e.g. `curve.dotted`, not `curve.isDotted`; `filter.bypassed`, not `filter.isBypassed`
- predicate / type-guard functions — `pointInBounds`, `frequencyInRange`, `matchesFilterType`, not `isPointInBounds`, `isFrequencyInRange`, `doesMatchFilterType`

**Exceptions (closed list):**

- fields on external API responses or third-party types we cannot rename
- standard library / ecosystem names: `Array.isArray`, `Number.isFinite`, `Number.isNaN` (the library itself uses `isNaN` in `math.ts`)

**Write-time check:** _"Am I about to type `is`, `has`, `can`, or `should` as a prefix? → rename before typing the rest."_ If the non-prefixed name feels unclear, fix the noun (`loading` vs `flag`), don't add back the prefix.

**Keep names compact.** Drop modifiers that add no information given the context. If there is only one graph in scope, it is just `graph` — not `activeGraph` or `currentGraph`. If a boolean describes the only relevant state, name it for the state (`dragging`) not the mechanics (`isCurrentlyDragging`). Shorter names that still answer _"what is this for?"_ are always preferred.

**Keep names uniform with the public API.** Match the field names of the types you work with instead of inventing synonyms. `GraphFilter` uses `freq`, `gain`, `q`, `type` — pass a filter's frequency as `freq`, not `frequency` or `qFactor`. (Where a type genuinely uses the full word — e.g. `Magnitude.frequency` — follow that type.)

**Match parameter names to the destination field.** When a parameter is always passed into a specific object property, name it to match that property so shorthand works — e.g. React `key`/`ref`, or a `GraphFilter` field: name the param `freq` (then `{ freq }`), not `frequency`, which forces `{ freq: frequency }`.

**Destructure before repeated access.** When `obj.field` appears 2+ times in a function body, destructure once at the top — `const { freq, gain, q, type } = filter` — instead of repeating `filter.freq` at each call site.

### Component Structure

Start every new component as a **single file**. Keep it there as long as it satisfies single responsibility with no nested render helpers.

**Convert to folder** when the component grows beyond ~100 lines or needs visual sub-parts. The pattern used in this repo is: `ComponentName/index.ts` (barrel) + `ComponentName.tsx` + **sibling sub-component files** in the same folder (e.g. `FilterCurve/FilterPin.tsx`, `FrequencyResponseGraph/GraphGainGrid.tsx`) + co-located `ComponentName.stories.tsx`. Sub-components live as sibling files — always preferred over inline render functions, and not inside a nested `components/` subfolder.

This transformation (single file → folder) should happen naturally as complexity grows — not prematurely.

When a component folder grows further, extract into sibling files:

- `constants.ts` — component-scoped constants and config values
- a custom hook (as the library does with `FrequencyResponseGraph/useGraph.ts`) — when the component mixes state/logic with rendering, extract the logic layer into a hook
- component-scoped `types.ts` — when the type surface grows

**Before creating a helper**, check the shared modules — `src/utils.ts`, `src/math.ts`, `src/scale.ts`, `src/easing.ts` — and reuse instead of duplicating.

### Self-Sufficient Components

A component should obtain its own data — from imports, context providers, or config — rather than receiving values as props when those values are already available in the system.

This is **information hiding** (Parnas, 1972) applied to UI components: implementation details belong inside the component, not in its public interface. A prop is part of the public interface — it must justify its existence.

In React this pattern is also known as **smart components** (Dan Abramov, 2015): a component knows where to get its own data rather than waiting to receive it.

**Ask before adding a prop:** _"Can the component read this itself?"_

- Default / config values — import directly from `defaults.ts` or `theme.ts` inside the component, not passed from parent
- Context values (theme tokens, scale, dimensions) — consume the provider directly via `useGraph()` (which exposes `theme`, `scale`, `logScale`, `width`, `height`, `svgRef`)
- Only pass as a prop when the value is dynamic and the parent genuinely owns it (e.g. a filter component receiving its own filter record)

The goal is **black-box components**: the caller sets behaviour through the minimum necessary props; implementation details — colors, labels, config-derived values — stay inside the component.

**Counter-example (wrong):** passing a theme color into a child — `<FilterPoint color={theme.…} />` — when `FilterPoint` can read `theme` from `useGraph()` itself; exposing it as a prop leaks implementation detail upward.

### Reuse Before Build

This rule applies to **everything** — components, rendering/scale math, state, utilities. The correct question is always: _"does this already exist?"_ — not _"how do I build this?"_

**Before writing any new UI sub-component**, search `src/components/` for an existing one that does the same job. This applies especially to shared primitives (curves, points, gradients, grids) reused across filters.

When a task says "match the style of X" or "use the same look as Y" — find the exact component used in story/example Y and use it directly. Do not replicate its appearance manually. Patching visual properties (padding, stroke, colors) on a custom component is always wrong if a shared component already encapsulates that design.

**Before implementing any new mechanism** (coordinate/scale math, curve calculation, animation/easing, theming) — search for the existing one first (`math.ts`, `scale.ts`, `easing.ts`, `theme.ts`). Read it fully. Integrate INTO it — never add a parallel mechanism alongside it.

This is a **gate**: do not open an editor until the search is done. "I assumed it didn't exist" is not an acceptable reason for duplication.

## Git Workflow

After completing implementation, prepare a commit for the user to execute:

1. **Message format:** `type(scope): description` — [Conventional Commits](https://www.conventionalcommits.org/). No ticket prefix (this project has no issue-tracker scheme). Scope is a component or module name.

   - Example: `feat(FilterCurve): add dotted line style option`
   - Example: `fix(scale): correct logarithmic frequency mapping`

2. Stage only the files changed for this task — never use `git add .`.

3. When staging multiple files, present a **separate `git add` command for each file** — never combine them on one line. Always use paths **relative to the repo root** (e.g. `src/...`):

   ```bash
   git add src/components/FilterCurve/FilterCurve.tsx
   git add src/components/FilterCurve/index.ts
   git commit -m "feat(FilterCurve): add dotted line style option"
   ```

4. **Never stage secret files** — exclude `.env*`, `*.key`, `*.pem`, `*.secret`, or any file whose name signals credentials/environment config from every `git add`, independent of `.gitignore`. Gate before listing any file: _"does this file contain secrets or env vars?"_ — if yes, omit it.

5. The user executes the commit — the agent never runs `git commit` autonomously.
