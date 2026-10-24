import { PrismaClient } from "@prisma/client";
import { eventsService } from "../services/eventsService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { eventCreate } from "../types/events.js";
import { handleError, shouldLogError } from "../utils/errorHandler.js";

export class eventController {
  private eventService: eventsService;

  constructor(prisma: PrismaClient) {
    this.eventService = new eventsService(prisma);
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: number };
    const { id: id_usuario } = req.user as { id: number };
    const body = req.body as eventCreate;

    try {
      const events = await this.eventService.create(Number(id), id_usuario, body);
      res.code(201).send(events);
    } catch (err: any) {
      if (shouldLogError(err)) req.log.error({ err }, "Event request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
