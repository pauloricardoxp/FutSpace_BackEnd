import { FastifyInstance } from "fastify";
import { authController } from "../controllers/authController";

export async function authRoutes(server: FastifyInstance) {
  const authcontroller = new authController(server.prisma);

  server.post("/register", authcontroller.register.bind(authcontroller));
  server.post("/login", authcontroller.login.bind(authcontroller));
}
