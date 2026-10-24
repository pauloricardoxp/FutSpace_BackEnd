import { PrismaClient } from "@prisma/client";
import { teamsService } from "../services/teamsService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../utils/errorHandler.js";

export class teamsController {
  private teamsServices: teamsService;

  constructor(prisma: PrismaClient) {
    this.teamsServices = new teamsService(prisma);
  }

  async drawTeams(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number };
    const id_usuario = (req.user as any).id;
    try {
      const teams = await this.teamsServices.drawTeams(Number(id), id_usuario);
      res.code(200).send(teams);
    } catch (err: any) {
      req.log.error({ err }, "Team request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async getTeams(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string };
    const { id: id_usuario } = req.user as { id: number };
    try {
      const teams = await this.teamsServices.getTeams(Number(id), id_usuario);
      res.code(200).send(teams);
    } catch (err: any) {
      req.log.error({ err }, "Team request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
