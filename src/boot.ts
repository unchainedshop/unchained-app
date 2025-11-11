import Fastify from "fastify";
import { startPlatform } from "@unchainedshop/platform";
import { connect, unchainedLogger } from "@unchainedshop/api/fastify";
import defaultModules from "@unchainedshop/plugins/presets/all.js";
import initPluginMiddlewares from "@unchainedshop/plugins/presets/all-fastify.js";
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
  });

  connect(fastify, platform, {
    allowRemoteToLocalhostSecureCookies: process.env.NODE_ENV !== "production",
    initPluginMiddlewares,
    adminUI: true,
    chat: process.env.ANTHROPIC_API_KEY
      ? {
          model: anthropic("claude-sonnet-4-5-20250929"),
          imageGenerationTool: process.env.OPENAI_API_KEY
            ? { model: openai.image("gpt-image-1") }
            : undefined,
        }
      : undefined,
  });

  await fastify.listen({
    host: "::",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
