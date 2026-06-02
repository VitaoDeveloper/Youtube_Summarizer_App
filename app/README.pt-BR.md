# YouTube Summarizer

Aplicação web moderna que extrai resumos concisos com IA de vídeos do YouTube. Construída com React 19, Vite 8 e TypeScript 6.

## Stack Tecnológica

| Categoria         | Bibliotecas                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Core**          | React 19 · Vite 8 · TypeScript 6                                           |
| **Estilização**   | Tailwind CSS v4 · shadcn/ui · clsx · Lucide React                          |
| **Roteamento**    | React Router v7                                                             |
| **Estado / Dados**| TanStack Query v5 · React Hook Form + Zod · Axios                          |
| **Internacional** | react-i18next + i18next-browser-languagedetector (pt / en / es)             |
| **UX**            | framer-motion · Sonner toast · next-themes · react-markdown + remark-gfm    |
| **Dev / Mock**    | MSW (Mock Service Worker) · ESLint strict · date-fns                        |

## Funcionalidades

- **Validação de URL do YouTube** — validação no cliente com Zod
- **Resumos com IA** — envie um link do YouTube e receba um resumo estruturado
- **Renderização Markdown** — resumos exibidos como markdown formatado com suporte a GFM
- **Histórico** — persistido no localStorage (até 50 entradas) com busca
- **Modo escuro** — alternável, persistido via next-themes
- **Internacionalização** — português (Brasil), inglês e espanhol — detectado automaticamente ou alternado manualmente
- **Atalhos de teclado** — Ctrl+Enter para enviar, Escape para fechar diálogos
- **Layout responsivo** — menu hambúrguer no mobile, navegação completa no desktop
- **Transições de página** — animações framer-motion entre rotas
- **Modo de mock** — desenvolvimento executa com handlers MSW por padrão (`VITE_USE_MOCKS=true`)

## Começando

```bash
pnpm install
pnpm dev          # inicia o servidor Vite em http://localhost:5173
pnpm build        # compilação TypeScript + build de produção Vite
pnpm lint         # ESLint com análise de tipos
pnpm preview      # preview do build de produção
```

## Ambiente

| Variável         | Padrão  | Descrição                                     |
| ---------------- | ------- | --------------------------------------------- |
| `VITE_USE_MOCKS`  | `true`  | Ativa/desativa o modo mock MSW (`false` para API real) |
| `VITE_API_URL`    | —       | URL base para a API de resumo do YouTube       |

## Estrutura do Projeto

```
src/
├── api/            # Cliente Axios + definições de endpoints do YouTube
├── components/
│   ├── layout/     # Header, Footer, Layout
│   ├── ui/         # Primitivas shadcn/ui + LanguageSwitcher
│   └── shared/     # EmptyState, ErrorBoundary, PageTransition, SummaryContent
├── context/        # HistoryContext (backed by localStorage)
├── hooks/          # useSummarize, useHistory, useLocalStorage, useMediaQuery, useKeyboard
├── lib/            # Configuração do i18n
├── locales/        # en.json, pt.json, es.json
├── mocks/          # Handlers MSW + setup do browser worker
├── pages/          # HomePage, SummarizePage, HistoryPage, NotFoundPage
├── styles/         # Entrada Tailwind CSS v4 (tokens de tema, variáveis dark/light)
├── types/          # Tipos de resposta da API
└── utils/          # cn, validation, formatters, languageConfig
```

## Convenção de Commits

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): resumo imperativo curto
```

Tipos: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`.
