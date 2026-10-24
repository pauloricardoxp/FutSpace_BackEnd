import { FastifyInstance } from "fastify";
import { meController } from "../controllers/meController.js";
import { profileSchemas } from "../schemas/profileSchemas.js";
import { profileService } from "../services/profileService.js";
import { uploadService } from "../services/uploadService.js";

export async function meRoutes(server: FastifyInstance) {
  const profileServices = new profileService(server.prisma);
  const uploadServices = new uploadService(server.prisma);
  const controller = new meController(profileServices, uploadServices);

  server.get(
    "/",
    { schema: profileSchemas.getMe, preHandler: [server.authenticate] },
    controller.getMe.bind(controller),
  );

  server.patch(
    "/",
    { schema: profileSchemas.updateMe, preHandler: [server.authenticate] },
    controller.updateMe.bind(controller),
  );

  server.get(
    "/profiles",
    { schema: profileSchemas.listProfiles, preHandler: [server.authenticate] },
    controller.listProfiles.bind(controller),
  );

  server.post(
    "/profiles",
    { schema: profileSchemas.createProfile, preHandler: [server.authenticate] },
    controller.createProfile.bind(controller),
  );

  server.put(
    "/profiles/:id_profile",
    {
      schema: profileSchemas.updateProfile,
      preHandler: [server.authenticate],
    },
    controller.updateProfile.bind(controller),
  );

  server.delete(
    "/profiles/:id_profile",
    {
      schema: profileSchemas.deleteProfile,
      preHandler: [server.authenticate],
    },
    controller.deleteProfile.bind(controller),
  );

  server.post(
    "/photo",
    {
      schema: {
        ...profileSchemas.uploadPhoto,
      },
      config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
      preHandler: [server.authenticate],
    },
    controller.uploadPhoto.bind(controller),
  );

  server.delete(
    "/photo",
    {
      schema: {
        ...profileSchemas.deletePhoto,
      },
      config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
      preHandler: [server.authenticate],
    },
    controller.deletePhoto.bind(controller),
  );
}
