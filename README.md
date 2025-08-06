# Unchained Engine Starter

A powerful e-commerce engine built with Node.js, TypeScript, and GraphQL. This is the official starter template for the Unchained commerce platform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [What's Next](#-whats-next)
- [AI Integration](#ai-integration)
- [Docker](#docker)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)



## Overview

This starter project combines the [**Unchained Engine**](https://github.com/unchainedshop/unchained) — a modular, high-performance headless e-commerce backend — with the **Unchained Admin UI**, a powerful web-based interface for managing your store.

Together, they provide a complete out-of-the-box solution for building and running scalable e-commerce applications using modern technologies like Fastify, GraphQL, TypeScript, and Docker.


## Features

- 🚀 **GraphQL API** - Modern GraphQL API with GraphQL Yoga  
- 🏪 **Complete E-commerce** - Products, orders, payments, delivery, and user management  
- 💳 **Payment Integration** - Built-in Stripe integration and extensible payment plugins  
- 📦 **Delivery Management** - Flexible delivery and shipping options  
- 🎫 **Ticketing System** - Event and ticket management capabilities  
- 🧠 **Built-in LLM Chat Support** - Easily enable AI-powered chat assistants via the Admin UI using providers like OpenAI or Anthropic  
- 🔧 **Admin UI** - Built-in administration interface ([admin-ui](https://github.com/unchainedshop/admin-ui))  
- 🐳 **Docker Ready** - Production-ready Docker configuration  
- 🔒 **Security** - Session management, cookies, and secure authentication  
- ⚡ **Performance** - Built with Fastify for high performance  


## Tech Stack

- 🚀 Fastify
- 🧬 GraphQL Yoga
- 💠 MongoDB
- ⚙️ TypeScript (ESNext, NodeNext)
- 🧩 Plugin-based architecture

## Prerequisites

- Node.js >= 22.0.0
- npm >= 10.0.0
- MongoDB (for data storage)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/unchainedshop/unchained.git
   cd unchained-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.defaults .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript application
- `npm start` - Start production server
- `npm run lint` - Format code with Prettier
- `npm run clean` - Clean TypeScript build artifacts
- `npm run integration-test` - Run integration tests

## ✅ What's Next?

Once the application is running, here are the recommended next steps to get your store fully set up and ready to go:

### 1. Access the Admin UI

Visit [http://localhost:4010](http://localhost:4010) to access the Admin Dashboard.

- 👤 Create your first **admin user** (this user will have full access)
- 🌍 Configure essential settings:
  - Add supported **currencies**, **languages**, and **countries**
- 💳 Set up your commerce infrastructure:
  - Add **payment providers** (e.g. Stripe)
  - Add **delivery providers** (e.g. flat rate, zones)
- 🛒 Organize your catalog:
  - Create **assortments** and **categories**
  - Start adding **products** to your store

> 🎉 Once these steps are completed, your store backend is fully functional and ready for customers.

---

### 2. Add a Frontend

To build the storefront, you can use the official Unchained Storefront starter built with Next.js:

👉 [https://github.com/unchainedshop/unchained-storefront](https://github.com/unchainedshop/unchained-storefront)

It connects directly to your GraphQL API and provides a customizable, production-ready frontend experience.

> 💡 The Admin UI uses secure, session-based authentication. The first user you create will automatically be assigned **admin privileges**.

## AI Integration

The **Unchained Admin UI** includes built-in support for AI chat assistants using large language models (LLMs). With a few lines of code, you can enable an in-app assistant powered by providers like **Anthropic (Claude)** or **OpenAI (GPT, DALL·E)** for summarization, Q&A, or image generation.

You can manage your store using the built-in admin tools for products, orders, payments, and more — and with LLM integration enabled, the AI assistant can help automate or assist with these operations by providing intelligent summaries and suggestions directly inside the Admin UI.

Example integration using `@unchainedshop/admin-ui/fastify`:

```ts
import { connectChat, fastifyRouter } from "@unchainedshop/admin-ui/fastify";
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

if (process.env?.ANTHROPIC_API_KEY) {
  fastify.log.info('Using ANTHROPIC_API_KEY, chat functionality will be available.');
  connectChat(fastify, {
    system:
      'do not include the data in your summary, just write a summary about it in one short paragraph and never list all the fields of a result, just summarize paragraph about your findings, if necessary',
    model: anthropic('claude-4-sonnet-20250514'),
    maxSteps: 1,
    imageGenerationTool: process.env?.OPENAI_API_KEY ? {
      model: openai.image('dall-e-3'),
    } : null,
  });
}


## Docker

### Build and Run

```bash
# Build the Docker image
docker build -t unchained-app .

# Run the container
docker run -p 4010:4010 unchained-app
```

### Health Check

The Docker container includes a health check that queries the GraphQL endpoint to ensure the application is running properly.

## API Endpoints

- **GraphQL Playground**: `http://localhost:4010/graphql`
- **Admin UI**: `http://localhost:4010`

## Architecture

The application uses a modular architecture with the following key components:

- **Fastify** - High-performance web framework
- **GraphQL Yoga** - GraphQL server implementation
- **Unchained Platform** - Core e-commerce engine
- **Plugin System** - Extensible plugin architecture

## Configuration

Environment variables are loaded from:
1. `.env.defaults` (default values)
2. `.env` (local overrides)

Key configuration options:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URL` - MongoDB connection string

## Plugins

The starter includes all default plugins for:
- Payment processing (Stripe, etc.)
- Delivery providers
- User authentication
- Product management
- Order processing

## Development

### TypeScript Configuration

The project uses modern TypeScript with:
- ES modules
- NodeNext module resolution
- Declaration generation
- Source maps for debugging

### File Structure

```
src/
├── boot.ts          # Application entry point
tsconfig.json        # TypeScript configuration
Dockerfile          # Docker configuration
package.json        # Dependencies and scripts
```

## Contributing

This project is part of the larger Unchained ecosystem. For contribution guidelines, please visit:
- [GitHub Repository](https://github.com/unchainedshop/unchained)
- [Issues](https://github.com/unchainedshop/unchained/issues)

## License

This project is licensed under the EUPL-1.2 License.

## Support

- **Homepage**: [unchained.shop](https://unchained.shop)
- **Documentation**: [Visit the official Unchained documentation](https://docs.unchained.shop/)
- **Issues**: [GitHub Issues](https://github.com/unchainedshop/unchained-app/issues)

## Contributors

- Vedran Rudelj <vedran@unchained.shop>
- Pascal Kaufmann <pascal@unchained.shop>
- Marco Wettstein <maw@panter.ch>
- Simon Emanuel Schmid <simon@unchained.shop>
- Mikael Araya Mengistu <mikaeln@unchained.shop>

---

Built with ❤️ by the Unchained team