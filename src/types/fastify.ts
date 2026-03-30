import { PrismaClient } from "@prisma/client";
import {v2 as cloudinaryV2} from "cloudinary"
import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    isAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    cloudinary: typeof cloudinaryV2;
  }
}