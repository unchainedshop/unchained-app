# Unchained Engine Starter

The official starter template for [Unchained Engine](https://github.com/unchainedshop/unchained) — a modular, headless e-commerce backend (Fastify, GraphQL, TypeScript) — bundled with the Unchained Admin UI. Tracks Unchained Engine v5 (alpha).

## Prerequisites

- Node.js >= 22.9 (24 LTS recommended — runs TypeScript natively)
- npm >= 10
- MongoDB — optional in development: without `MONGO_URL`, a local `mongod` is spawned automatically (via `mongodb-memory-server`) storing data in `./.db`

## Quick Start

```bash
git clone https://github.com/unchainedshop/unchained-app.git
cd unchained-app
npm install
npm run dev
```

The app starts on http://localhost:4010 (set by `PORT` in `.env.defaults`).

1. Open http://localhost:4010 and create your admin account — the first user gets admin privileges.
2. Complete the onboarding: add a currency, country, language, payment provider, and delivery provider.
3. Create and publish a product with a price.

For a frontend, use the official Next.js storefront starter: [unchained-storefront](https://github.com/unchainedshop/unchained-storefront). Full documentation: [docs.unchained.shop](https://docs.unchained.shop).

## Scripts

- `npm run dev` — development server with hot reload
- `npm start` — production server
- `npm run lint` — format with Prettier + type-check

## AI Integration

The `chat` option of `connect()` enables the Admin UI Copilot, backed by the engine's built-in MCP server at `/mcp`. It activates when `ANTHROPIC_API_KEY` is set; image generation additionally requires `OPENAI_API_KEY` (see `src/boot.ts`):

```ts
connect(fastify, platform, {
  adminUI: true,
  chat: process.env.ANTHROPIC_API_KEY
    ? {
        model: anthropic("claude-sonnet-5"),
        imageGenerationTool: process.env.OPENAI_API_KEY
          ? { model: openai.imageModel("gpt-image-1") }
          : undefined,
      }
    : undefined,
});
```

Any [AI SDK](https://ai-sdk.dev) v7-compatible language model works.

## Docker

```bash
docker build -t unchained-app .
docker run -p 3000:3000 unchained-app
```

Inside the container the app listens on port 3000 (`ENV PORT=3000` overrides `.env.defaults`). A health check polls `/.well-known/health`; `/.well-known/ready` verifies the GraphQL API responds.

## Endpoints

- `/` — Admin UI
- `/graphql` — GraphQL API (with GraphiQL in development)
- `/mcp` — MCP server for AI agents (admin-authenticated)
- `/chat` — Copilot chat endpoint (when `chat` is configured)
- `/.well-known/health`, `/.well-known/ready` — health/readiness probes

## Configuration

Environment variables load from `.env.defaults`, overridden by `.env` (and by the process environment). Required by the engine (defaults are shipped): `ROOT_URL`, `EMAIL_WEBSITE_NAME`, `EMAIL_WEBSITE_URL`, `EMAIL_FROM`, and `UNCHAINED_TOKEN_SECRET` (min. 32 characters — set your own secret in production).

Common options:

- `PORT` — server port (default 4010 via `.env.defaults`)
- `MONGO_URL` — MongoDB connection string (omit in dev for the auto-spawned local `mongod`)
- `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` — enable Copilot chat / image generation

## License

EUPL-1.2 — part of the [Unchained ecosystem](https://unchained.shop). Issues: [unchained-app](https://github.com/unchainedshop/unchained-app/issues).
