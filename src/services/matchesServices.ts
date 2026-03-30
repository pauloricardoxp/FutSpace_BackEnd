import { PrismaClient } from "@prisma/client";
import { matchesCreate } from "../types/matches";

export class matchesServices {
  constructor(private prisma: PrismaClient) {}

  async create(data: matchesCreate, id_usuario: number) {
    if (!data.name) {
      throw new Error("O nome da partida é obrigatório");
    }
    if (!data.scheduled_at) {
      throw new Error("A data da partida é obrigatória");
    }
    if (!data.num_teams) {
      throw new Error("O número de times é obrigatório");
    }
    if (!data.players_per_team) {
      throw new Error("O número de jogadores por time é obrigatório");
    }
    if (!data.duration_minutes) {
      throw new Error("A duração da partida é obrigatória");
    }

    return await this.prisma.matches.create({
      data: {
        ...data,
        id_usuario,
      },
    });
  }

  async getByUsers(id_usuario: number) {
    return await this.prisma.matches.findMany({
      where: { id_usuario },
    });
  }

  async getById(id_matches: number, id_usuario: number) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
      include: { players: true },
    });

    if (!matches) {
      throw new Error("Partida não encontrada");
    }

    const isOwner = matches.id_usuario === id_usuario;
    const isPlayer = matches.players.some((p) => p.id_usuario === id_usuario);

    if (!isOwner && !isPlayer) {
      throw new Error("Acesso negado");
    }

    return matches;
  }

  async start(id_matches: number, id_users: number) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!matches) {
      throw new Error("Partida não encontrada");
    }

    if (matches.id_usuario !== id_users) {
      throw new Error("Você não tem permissão para iniciar essa partida");
    }

    if (matches.status !== "pending") {
      throw new Error("Partida já foi iniciada");
    }

    return await this.prisma.matches.update({
      where: { id_matches },
      data: { status: "ongoing" },
    });
  }

  async finish(id_matches: number, id_users: number) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!matches) {
      throw new Error("Partida não encontrada");
    }

    if (matches.id_usuario !== id_users) {
      throw new Error("Você não tem permissão para finalizar essa partida");
    }

    if (matches.status === "pending") {
      throw new Error("A partida ainda não foi iniciada");
    }

    if (matches.status === "finished") {
      throw new Error("Partida já encerrada");
    }

    return await this.prisma.matches.update({
      where: { id_matches },
      data: {
        status: "finished",
        finished_at: new Date(),
      },
    });
  }
}
