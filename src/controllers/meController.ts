import { FastifyReply, FastifyRequest } from "fastify";
import { profileService } from "../services/profileService.js";
import { ProfileInput, ProfileUpdate } from "../types/profile.js";
import { AppError, handleError, shouldLogError } from "../utils/errorHandler.js";
import { uploadService } from "../services/uploadService.js";

export class meController {
  constructor(
    private profileServices: profileService,
    private uploadServices: uploadService,
  ) {}

  private getUserId(req: FastifyRequest) {
    return (req.user as { id: number }).id;
  }

  async getMe(req: FastifyRequest, res: FastifyReply) {
    try {
      const user = await this.profileServices.getMe(this.getUserId(req));
      res.code(200).send(user);
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Profile request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async updateMe(req: FastifyRequest, res: FastifyReply) {
    const { name } = req.body as { name: string };

    try {
      const user = await this.profileServices.updateMe(this.getUserId(req), name);
      res.code(200).send(user);
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Profile request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async listProfiles(req: FastifyRequest, res: FastifyReply) {
    try {
      const profiles = await this.profileServices.listProfiles(this.getUserId(req));
      res.code(200).send(profiles);
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Profile request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async createProfile(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as ProfileInput;

    try {
      const profile = await this.profileServices.createProfile(
        this.getUserId(req),
        body,
      );
      res.code(201).send(profile);
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Profile request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async updateProfile(req: FastifyRequest, res: FastifyReply) {
    const { id_profile } = req.params as { id_profile: string };
    const body = req.body as ProfileUpdate;

    try {
      const profile = await this.profileServices.updateProfile(
        this.getUserId(req),
        Number(id_profile),
        body,
      );
      res.code(200).send(profile);
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Profile request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async deleteProfile(req: FastifyRequest, res: FastifyReply) {
    const { id_profile } = req.params as { id_profile: string };

    try {
      const profile = await this.profileServices.deleteProfile(
        this.getUserId(req),
        Number(id_profile),
      );
      res.code(200).send(profile);
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Profile request failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async uploadPhoto(req: FastifyRequest, res: FastifyReply) {
    try {
      const file = await req.file();

      if (!file) {
        throw new AppError("Arquivo de foto é obrigatório", 400);
      }

      const photo = await this.uploadServices.uploadPhoto(
        this.getUserId(req),
        file.mimetype,
        await file.toBuffer(),
      );

      res.code(200).send({ photo });
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Photo upload failed");

      if ((err as { code?: string }).code === "FST_REQ_FILE_TOO_LARGE") {
        res.code(413).send({ error: "A foto deve ter no máximo 5 MB" });
        return;
      }

      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }

  async deletePhoto(req: FastifyRequest, res: FastifyReply) {
    try {
      await this.uploadServices.deletePhoto(this.getUserId(req));
      res.code(200).send({ photo: null });
    } catch (err) {
      if (shouldLogError(err)) req.log.error({ err }, "Photo deletion failed");
      const { statusCode, message } = handleError(err);
      res.code(statusCode).send({ error: message });
    }
  }
}
