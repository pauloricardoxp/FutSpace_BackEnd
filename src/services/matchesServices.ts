import { PrismaClient } from "@prisma/client";
import { matchesCreate } from "../types/matches.js";
import { AppError } from "../utils/errorHandler.js";
import { isValidSport } from "../utils/sports.js";

export class matchesServices {
  constructor(private prisma: PrismaClient) {}

  async create(data: matchesCreate, id_usuario: number) {
    if (!data.name) {
      throw new AppError("O nome da partida é obrigatório", 400);
    }
    if (!data.scheduled_at) {
      throw new AppError("A data da partida é obrigatória", 400);
    }
    if (!data.num_teams) {
      throw new AppError("O número de times é obrigatório", 400);
    }
    if (!data.players_per_team) {
      throw new AppError("O número de jogadores por time é obrigatório", 400);
    }
    if (!data.duration_minutes) {
      throw new AppError("A duração da partida é obrigatória", 400);
    }
    if (!data.category) {
      throw new AppError("A categoria da partida é obrigatória", 400);
    }
    if (data.sport && !isValidSport(data.sport)) {
      throw new AppError("Esporte inválido", 400);
    }

    return await this.prisma.matches.create({
      data: {
        name: data.name,
        location: data.location,
        scheduled_at: data.scheduled_at,
        duration_minutes: data.duration_minutes,
        num_teams: data.num_teams,
        players_per_team: data.players_per_team,
        sport: data.sport ?? "futebol",
        category: data.category,
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
      include: {
        players: {
          select: {
            id_players: true,
            name: true,
            position: true,
            is_guest: true,
            id_usuario: true,
            id_time: true,
            shirt_number: true,
            field_position: true,
            users: { select: { photo: true } },
          },
        },
        teams: {
          orderBy: { id_time: "asc" },
          take: undefined,
        },
      },
    });

    if (!matches) {
      throw new AppError("Partida não encontrada", 404);
    }

    const isOwner = matches.id_usuario === id_usuario;
    const isPlayer = matches.players.some((p) => p.id_usuario === id_usuario);

    if (!isOwner && !isPlayer) {
      throw new AppError("Acesso negado", 403);
    }

    const totalPlayersNeeded = matches.num_teams * matches.players_per_team;
    const playersAdded = matches.players.length;
    const spotsAvailable = totalPlayersNeeded - playersAdded;

    // Filtra apenas os times da partida (remove duplicados mantendo os primeiros)
    const uniqueTeams = matches.teams.slice(0, matches.num_teams);

    // Calcula o placar total
    const score = uniqueTeams.map((team) => ({
      id_time: team.id_time,
      name: team.name,
      goals: team.goals,
    }));

    const totalGoals = uniqueTeams.reduce((sum, team) => sum + team.goals, 0);
    const players = matches.players.map(({ users, ...player }) => ({
      ...player,
      photo: users?.photo ?? null,
    }));

    return {
      match: {
        id_matches: matches.id_matches,
        name: matches.name,
        location: matches.location,
        scheduled_at: matches.scheduled_at,
        duration_minutes: matches.duration_minutes,
        num_teams: matches.num_teams,
        players_per_team: matches.players_per_team,
        status: matches.status,
      },
      configuration: {
        totalPlayersNeeded,
        playersAdded,
        spotsAvailable,
      },
      score: {
        teams: score,
        totalGoals,
      },
      players,
      teams: uniqueTeams,
    };
  }

  async start(id_matches: number, id_users: number) {
    const matches = await this.prisma.matches.findUnique({
      where: { id_matches },
    });

    if (!matches) {
      throw new AppError("Partida não encontrada", 404);
    }

    if (matches.id_usuario !== id_users) {
      throw new AppError("Você não tem permissão para iniciar essa partida", 403);
    }

    if (matches.status !== "pending") {
      throw new AppError("Partida já foi iniciada", 422);
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
      throw new AppError("Partida não encontrada", 404);
    }

    if (matches.id_usuario !== id_users) {
      throw new AppError("Você não tem permissão para finalizar essa partida", 403);
    }

    if (matches.status === "pending") {
      throw new AppError("A partida ainda não foi iniciada", 422);
    }

    if (matches.status === "finished") {
      throw new AppError("Partida já encerrada", 422);
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
