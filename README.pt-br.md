# YouTube Summarizer App

Aplicação web que gera resumos estruturados de vídeos do YouTube a partir da URL, com suporte a múltiplos idiomas, histórico persistido e compartilhamento por link.

---

## Stack

**Backend** — NestJS + TypeScript, Prisma ORM, PostgreSQL  
**Frontend** — React + Vite + TypeScript  
**IA** — OpenAI API (gpt-4o-mini)  
**Transcrição** — `youtube-transcript` (sem necessidade de API Key do YouTube)

---

## Funcionalidades

- Resumo de vídeos em português, inglês e espanhol
- Três níveis de detalhe: curto, médio e detalhado
- Extração automática de tópicos principais
- Histórico de resumos por usuário
- Compartilhamento de resumo por link único (`/r/:slug`)
- Exportação do resumo em `.md`

---

## Estrutura do projeto

```
Youtube_Summarizer_App/
├── api/                  # NestJS API
│   ├── src/
│   │   ├── summary/
│   │   │   ├── summary.module.ts
│   │   │   ├── summary.controller.ts
│   │   │   ├── summary.service.ts
│   │   │   ├── summary.repository.ts
│   │   │   └── dto/
│   │   │       └── create-summary.dto.ts
│   │   ├── llm/
│   │   │   └── llm.service.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env
│
└── app/                 # React + Vite
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   │   └── useSummarize.ts
    │   └── pages/
    └── .env
```

---

## Pré-requisitos

- Node.js 20+
- PNPM 10+
- PostgreSQL rodando localmente ou via Docker
- Chave de API da OpenAI

---

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/VitaoDeveloper/Youtube_Summarizer_App.git
cd Youtube_Summarizer_App
```

### 2. Configure as variáveis de ambiente

```bash
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/yt_summarizer"
OPENAI_API_KEY="sk-..."
```

```bash
# frontend/.env
VITE_API_URL="http://localhost:3000"
```

### 3. Instale dependências e rode as migrations

```bash
# Backend
cd backend
pnpm install
npx prisma migrate dev
pnpm run start:dev

# Frontend (em outro terminal)
cd frontend
pnpm install
pnpm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/summary` | Gera um novo resumo |
| `GET` | `/summary` | Lista histórico de resumos |
| `GET` | `/summary/:slug` | Busca resumo por slug público |
| `DELETE` | `/summary/:id` | Remove um resumo |

### Body — `POST /summary`

```json
{
  "url": "https://youtube.com/watch?v=...",
  "language": "pt",
  "length": "medium"
}
```

**Campos:**
- `url` — URL do vídeo (obrigatório)
- `language` — `pt` | `en` | `es` (padrão: `pt`)
- `length` — `short` | `medium` | `detailed` (padrão: `medium`)

### Resposta

```json
{
  "id": "uuid",
  "slug": "abc123",
  "videoTitle": "Como o algoritmo do YouTube funciona",
  "summary": "O vídeo explora...",
  "topics": ["Algoritmo", "SEO", "Engajamento"],
  "language": "pt",
  "createdAt": "2025-06-02T14:00:00.000Z"
}
```

---

## Schema do banco

```prisma
model Summary {
  id         String   @id @default(uuid())
  slug       String   @unique
  videoId    String
  videoTitle String
  summary    String
  topics     String[]
  language   String   @default("pt")
  length     String   @default("medium")
  createdAt  DateTime @default(now())
}
```

---

## Roadmap

- [ ] Autenticação de usuários (JWT)
- [ ] Suporte a playlists inteiras
- [ ] Exportação em PDF
- [ ] Modo offline com cache de transcrições
- [ ] Interface de API pública com rate limiting