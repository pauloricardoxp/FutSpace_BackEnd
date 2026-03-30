import { PrismaClient } from "@prisma/client";
import { teamsService } from "../services/teamsService";
import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../utils/errorHandler";

export class teamsController {
  private teamsServices: teamsService;

  constructor(prisma: PrismaClient) {
    this.teamsServices = new teamsService(prisma);
  }

  async drawTeams(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number };
    try {
      const teams = await this.teamsServices.drawTeams(Number(id));
      res.code(200).send(teams);
    } catch (err: any) {
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
