import { PrismaClient } from "@prisma/client";
import { v2 as cloudinaryV2 } from "cloudinary";
import type { JWT } from "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    jwt: JWT;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    isAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    cloudinary: typeof cloudinaryV2;
  }
}
