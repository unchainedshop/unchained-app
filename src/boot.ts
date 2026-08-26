import Fastify from "fastify";
import { startPlatform } from "@unchainedshop/platform";
import { connect, unchainedLogger } from "@unchainedshop/api/fastify";
import { registerAllPlugins } from "@unchainedshop/plugins/presets/all";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

const fastify = Fastify({
  loggerInstance: unchainedLogger("fastify"),
  disableRequestLogging: true,
  trustProxy: true,
});

try {
  // Plugins self-register their modules and HTTP routes; call before startPlatform
  registerAllPlugins();

  const platform = await startPlatform({});

  connect(fastify, platform, {
    allowRemoteToLocalhostSecureCookies: process.env.NODE_ENV !== "production",
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

  fastify.get("/.well-known/health", async () => {
    return { healthy: true };
  });

  fastify.get("/.well-known/ready", async (req, reply) => {
    const result = await fetch(
      `http://127.0.0.1:${process.env.PORT ? parseInt(process.env.PORT) : 3000}${process.env.GRAPHQL_API_PATH || "/graphql"}`,
      {
        method: "POST",
        body: JSON.stringify({ query: "{ shopInfo { _id country { _id } } }" }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await result.json();
    if (!data?.errors?.length && data?.data?.shopInfo?._id) {
      return { ready: true };
    }
    return reply.code(503).send({ ready: false });
  });

  await fastify.listen({
    host: "::",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
