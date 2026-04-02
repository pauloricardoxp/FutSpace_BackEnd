import { FastifyInstance } from "fastify";

export async function healthRoute(server: FastifyInstance) {
  server.get(
    "/ping",
    {
      schema: {
        tags: ["Health"],
        summary: "Health check endpoint",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
              timestamp: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      reply.code(200).send({
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    },
  );
}
