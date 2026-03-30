import { PrismaClient } from "@prisma/client";
import { dashboardService } from "../services/dashboardService";
import { FastifyReply, FastifyRequest } from "fastify";
import { handleError } from "../utils/errorHandler";

export class dashboardController {
  private dashboardService: dashboardService;

  constructor(prisma: PrismaClient) {
    this.dashboardService = new dashboardService(prisma);
  }

  async getDashboard(req: FastifyRequest, res: FastifyReply) {
    try {
      const id_usuario = (req.user as any).id;
      const dashboard = await this.dashboardService.getDashboard(id_usuario);
      res.code(200).send(dashboard);
    } catch (err: any) {
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
