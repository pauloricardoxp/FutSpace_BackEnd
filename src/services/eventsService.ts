import { PrismaClient } from "@prisma/client";
import { eventCreate } from "../types/events.js";
import { AppError } from "../utils/errorHandler.js";

export class eventsService {
  constructor(private prisma: PrismaClient) {}

  async create(id_matches: number, id_usuario: number, data: eventCreate) {
    const match = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!match) {
      throw new AppError("Partida não encontrada", 404);
    }

    if (match.id_usuario !== id_usuario) {
      throw new AppError("Você não tem permissão para registrar eventos desta partida", 403);
    }

    if (match.status !== "ongoing") {
      throw new AppError(
        "A partida precisa estar em andamento para registrar eventos",
        422,
      );
    }

    const player = await this.prisma.players.findUnique({
      where: { id_players: data.id_player },
    });

    if (!player || player.id_matches !== id_matches) {
      throw new AppError("Jogador não pertence a essa partida", 403);
    }

    if (!player.id_time) {
      throw new AppError("Jogador ainda não foi alocado em um time", 422);
    }

    if (data.id_assistido && data.id_assistido > 0) {
      const assistant = await this.prisma.players.findUnique({
        where: { id_players: data.id_assistido },
      });

      if (!assistant || assistant.id_matches !== id_matches) {
        throw new AppError("Jogador assistente não pertence a essa partida", 403);
      }
    }

    const event = await this.prisma.events.create({
      data: {
        type: data.type,
        minute: data.minute,
        id_matches,
        id_player: data.id_player,
        id_assistido:
          data.id_assistido && data.id_assistido > 0 ? data.id_assistido : null,
      },
    });

    if (data.type === "goal") {
      await this.prisma.teams.update({
        where: { id_time: player.id_time },
        data: { goals: { increment: 1 } },
      });

      if (data.id_assistido && data.id_assistido > 0) {
        await this.prisma.events.create({
          data: {
            type: "assist",
            minute: data.minute,
            id_matches,
            id_player: data.id_assistido,
            id_assistido: null,
          },
        });
      }
    }

    return event;
  }
}
