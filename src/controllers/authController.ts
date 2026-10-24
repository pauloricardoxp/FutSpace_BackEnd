import { PrismaClient } from "@prisma/client";
import { authService } from "../services/authService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { authLogin, authRegister } from "../types/auth.js";
import { handleError } from "../utils/errorHandler.js";

export class authController {
  private authService: authService;

  constructor(prisma: PrismaClient) {
    this.authService = new authService(prisma);
  }

  async register(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as authRegister;
    try {
      const users = await this.authService.register(body);
      res.code(201).send(users);
    } catch (err: any) {
      req.log.error({ err }, "Auth request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as authLogin;
    try {
      const users = await this.authService.login(body);

      const token = req.server.jwt.sign({
        id: users.id_usuario,
        email: users.email,
      });
      return res.code(200).send({
        token,
        id_usuario: users.id_usuario,
        name: users.name,
        email: users.email,
      });
    } catch (err: any) {
      req.log.error({ err }, "Auth request failed");
      const { statusCode, message } = handleError(err);
      return res.code(statusCode).send({ error: message });
    }
  }
}
