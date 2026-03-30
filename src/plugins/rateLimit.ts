import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";

async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "15 minutes",
  });
}

export default fp(rateLimitPlugin);
