# 03 — Git Foundation

## Purpose
Initialize version control with conventional commits, clean history, and proper ignore rules.

## Technical Specs

### Git Init
```bash
git init
```

### .gitignore
Create `.gitignore` in `app/` if missing:
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

### Commit Convention Template
Create `.gitmessage`:
```
<type>(<scope>): <description>

Types: feat | fix | refactor | chore | docs | style | test
Scopes: ui | api | hooks | pages | config | deps | init

Examples:
  feat(ui): add Button component with variants
  fix(api): handle network error gracefully
  chore(deps): upgrade react-router-dom to v7
```

### First Commit
Stage all scaffolded files and commit:
```bash
git add .
git commit -m "chore(init): scaffold Vite + React + TypeScript project"
```

### Branch Strategy (documentation only)
| Branch | Purpose |
|--------|---------|
| `main` | Stable, deployable |
| `app_dev` | Active development |
| `feat/*` | Feature branches (merged into `app_dev`) |

## Verification
```bash
git log --oneline
# Should show: chore(init): scaffold Vite + React + TypeScript project
```
