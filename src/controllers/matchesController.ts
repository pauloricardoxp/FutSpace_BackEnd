import { PrismaClient } from "@prisma/client";
import { matchesServices } from "../services/matchesServices";
import { FastifyReply, FastifyRequest } from "fastify";
import { matchesCreate } from "../types/matches";

export class matchesController {
  private matchesService: matchesServices;

  constructor(prisma: PrismaClient) {
    this.matchesService = new matchesServices(prisma);
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.user as { id: number };
    const body = req.body as matchesCreate;

    try {
      const matches = await this.matchesService.create(body, id);
      res.code(201).send(matches);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }

  async getByUsers(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.user as { id: number };
    try {
      const matches = await this.matchesService.getByUsers(id);
      res.code(200).send(matches);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }

  async getById(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const { id: userId } = req.user as { id: number };
    try {
      const matches = await this.matchesService.getById(Number(id), userId);
      res.code(200).send(matches);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }
  async start(req: FastifyRequest, res: FastifyReply) {
    const { id_matches } = req.params as { id_matches: number };
    const { id } = req.user as { id: number };
    try {
      const matches = await this.matchesService.start(Number(id_matches), id);
      res.code(200).send(matches);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }

  async finish(req: FastifyRequest, res: FastifyReply) {
    const { id_matches } = req.params as { id_matches: number };
    const { id } = req.user as { id: number };
    try {
      const matches = await this.matchesService.finish(Number(id_matches), id);
      res.code(200).send(matches);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }
}
