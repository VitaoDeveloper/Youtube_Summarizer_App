# 10 — Final Git Review

## Purpose
Run linting and type-checking across the entire codebase, enforce code conventions, and produce a clean git commit history.

## Technical Specs

### Lint & Build Audit
```bash
pnpm lint
pnpm build
```
Fix all errors and warnings before proceeding.

### Code Convention Checklist
Audit every TypeScript file for:

| Rule | Convention |
|------|-----------|
| Component naming | PascalCase (`Button`, `SummarizePage`) |
| Function/variable naming | camelCase (`formatDuration`, `isValidYoutubeUrl`) |
| Constants | SCREAMING_SNAKE_CASE (`YOUTUBE_REGEX`, `MAX_HISTORY_ITEMS`) |
| Hooks | `use` prefix (`useSummarize`, `useLocalStorage`) |
| TypeScript | Prefer `interface` over `type` for object shapes. Use `type` for unions/aliases. |
| No `any` | Use `unknown` + type guards or proper generics |
| Imports | Group: react → libraries → @/ → relative. No unused imports. |
| Exports | Named exports for everything except pages/main entry |
| Strings | All user-facing text in English. No hardcoded Portuguese. |
| JSX | Self-close tags when no children. `aria-*` attributes on interactive elements. |

### Commit History (example sequence)
```bash
# After 04-theme-and-layout
git add . && git commit -m "feat(ui): add design system tokens and responsive layout shell"

# After 05-ui-components
git add . && git commit -m "feat(ui): add reusable Button, Input, Card, Skeleton, Toast, Dialog"

# After 06-pages-and-routing
git add . && git commit -m "feat(pages): add router, home page, summarize page, history page"

# After 07-api-integration
git add . && git commit -m "feat(api): add axios client, typed endpoints, React Query hooks"

# After 08-state-and-persistence
git add . && git commit -m "feat(hooks): add localStorage persistence and URL validation"

# After 09-ux-polish
git add . && git commit -m "feat(ux): add page transitions, error boundary, keyboard shortcuts"
```

### Final Sanity Check
```bash
git status            # no unstaged files
git log --oneline     # clean, conventional history
pnpm build            # zero errors
pnpm lint             # zero warnings
```

### Push (optional)
```bash
git push origin app_dev
```

## Verification
- `pnpm build` exits with code 0
- `pnpm lint` exits with code 0
- No `any` types remain
- Commit messages follow `type(scope): description` convention
- All commits are in English
