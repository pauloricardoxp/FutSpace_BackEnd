import { PrismaClient } from "@prisma/client";
import { eventCreate } from "../types/events";

export class eventsService {
  constructor(private prisma: PrismaClient) {}

  async create(id_matches: number, data: eventCreate) {
    const match = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!match) {
      throw new Error("Partida não encontrada");
    }

    if (match.status !== "ongoing") {
      throw new Error(
        "A partida precisa estar em andamento para registrar eventos",
      );
    }

    const player = await this.prisma.players.findUnique({
      where: { id_players: data.id_player },
    });

    if (!player || player.id_matches !== id_matches) {
      throw new Error("Jogador não pertence a essa partida");
    }

    if (!player.id_time) {
      throw new Error("Jogador ainda não foi alocado em um time");
    }

    const event = await this.prisma.events.create({
      data: {
        type: data.type,
        minute: data.minute,
        id_matches,
        id_player: data.id_player,
        id_assistido: data.id_assistido ?? null,
      },
    });

    if (data.type === "goal") {
      await this.prisma.teams.update({
        where: { id_time: player.id_time },
        data: { goals: { increment: 1 } },
      });

      if (data.id_assistido) {
        const assistant = await this.prisma.players.findUnique({
          where: { id_players: data.id_assistido },
        });

        if (!assistant || assistant.id_matches !== id_matches) {
          throw new Error("Jogador assistente não pertence a essa partida");
        }

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
