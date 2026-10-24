import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorHandler.js";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export class uploadService {
  constructor(private prisma: PrismaClient) {}

  private ensureConfigured() {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new AppError("Cloudinary não está configurado", 503);
    }
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadPhoto(id_usuario: number, mimetype: string, buffer: Buffer) {
    this.ensureConfigured();
    if (!allowedTypes.has(mimetype)) {
      throw new AppError("Formato de imagem inválido. Use jpeg, png ou webp", 400);
    }
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: `futspace/users/${id_usuario}`,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(new AppError("Não foi possível enviar a foto", 502));
            return;
          }
          void this.prisma.users.update({
            where: { id_usuario },
            data: { photo: result.secure_url },
          }).then(() => resolve(result.secure_url)).catch(reject);
        },
      );
      
      stream.end(buffer);
    });
  }

  async deletePhoto(id_usuario: number) {
    this.ensureConfigured();
    await cloudinary.uploader.destroy(`futspace/users/${id_usuario}`, {
      invalidate: true,
      resource_type: "image",
    });
    await this.prisma.users.update({
      where: { id_usuario },
      data: { photo: null },
    });
  }
}
