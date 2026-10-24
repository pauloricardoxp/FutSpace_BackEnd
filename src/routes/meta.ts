import { FastifyInstance } from "fastify";
import { sports } from "../utils/sports.js";

export async function metaRoutes(server: FastifyInstance) {
  server.get("/sports", {
    schema: { tags: ["Meta"], summary: "Listar esportes, categorias e posições" },
  }, async () => sports);
}
