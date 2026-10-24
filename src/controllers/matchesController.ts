import { PrismaClient } from "@prisma/client";
import { matchesServices } from "../services/matchesServices.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { matchesCreate } from "../types/matches.js";
import { handleError, shouldLogError } from "../utils/errorHandler.js";

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
      if (shouldLogError(err)) req.log.error({ err }, "Match request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async getByUsers(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.user as { id: number };
    try {
      const matches = await this.matchesService.getByUsers(id);
      res.code(200).send(matches);
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Match request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async getById(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const { id: userId } = req.user as { id: number };
    try {
      const matches = await this.matchesService.getById(Number(id), userId);
      res.code(200).send(matches);
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Match request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async start(req: FastifyRequest, res: FastifyReply) {
    const { id_matches } = req.params as { id_matches: number };
    const { id } = req.user as { id: number };
    try {
      const matches = await this.matchesService.start(Number(id_matches), id);
      res.code(200).send(matches);
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Match request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async finish(req: FastifyRequest, res: FastifyReply) {
    const { id_matches } = req.params as { id_matches: number };
    const { id } = req.user as { id: number };
    try {
      const matches = await this.matchesService.finish(Number(id_matches), id);
      res.code(200).send(matches);
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Match request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
