import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

async function prismaPlugin(fastify: FastifyInstance) {
  const prisma = new PrismaClient();

  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
}

export default fp(prismaPlugin);
