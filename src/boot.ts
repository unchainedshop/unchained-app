import Fastify from "fastify";
import { startPlatform } from "@unchainedshop/platform";
import {
  connect,
  unchainedLogger,
  connectChat,
  fastifyRouter,
} from "@unchainedshop/api/lib/fastify/index.js";
import defaultModules from "@unchainedshop/plugins/presets/all.js";
import connectDefaultPluginsToFastify from "@unchainedshop/plugins/presets/all-fastify.js";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

const fastify = Fastify({
  loggerInstance: unchainedLogger("fastify"),
  disableRequestLogging: true,
  trustProxy: true,
});

try {
  const platform = await startPlatform({
    modules: defaultModules,
    healthCheckEndpoint: "/.well-known/yoga/server-health",
  });

  connect(fastify, platform, {
    allowRemoteToLocalhostSecureCookies: process.env.NODE_ENV !== "production",
  });

  connectDefaultPluginsToFastify(fastify, platform);

  // This is an example of an AI provider, you can configure OPENAI_API_KEY through railway or locally to enable the Copilot chat features.
  if (process.env.OPENAI_API_KEY) {
    connectChat(fastify, {
      model: anthropic("claude-3-7-sonnet-20250219"),
      imageGenerationTool: { model: openai.image("gpt-image-1") },
    });
  }

  fastify.register(fastifyRouter, {
    prefix: "/",
  });

  await fastify.listen({
    host: "::",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
