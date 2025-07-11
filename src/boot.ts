import Fastify from "fastify";
import { startPlatform } from "@unchainedshop/platform";
import {
  connect,
  unchainedLogger,
} from "@unchainedshop/api/lib/fastify/index.js";
import defaultModules from "@unchainedshop/plugins/presets/all.js";
import connectDefaultPluginsToFastify from "@unchainedshop/plugins/presets/all-fastify.js";
import { fastifyRouter } from "@unchainedshop/admin-ui/fastify";

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
