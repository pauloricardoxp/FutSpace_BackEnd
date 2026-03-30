import { FastifyInstance } from "fastify";
import { authController } from "../controllers/authController";
import { authSchemas } from "../schemas/authSchemas";

export async function authRoutes(server: FastifyInstance) {
  const authcontroller = new authController(server.prisma);

  server.post(
    "/register",
    { schema: authSchemas.register },
    authcontroller.register.bind(authcontroller),
  );
  server.post(
    "/login",
    { schema: authSchemas.login },
    authcontroller.login.bind(authcontroller),
  );
}
