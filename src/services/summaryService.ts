import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorHandler.js";
import { aggregatePlayerStats } from "../utils/playerStats.js";

export class summaryService {
  constructor(private prisma: PrismaClient) {}

  async getMatchSummary(id_matches: number, id_usuario: number) {
    const match = await this.prisma.matches.findUnique({
      where: { id_matches },
      include: {
        teams: {
          include: {
            players: true,
          },
        },
        players: {
          select: { id_usuario: true },
        },
        events: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!match) {
      throw new AppError("Partida não encontrada", 404);
    }

    if (
      match.id_usuario !== id_usuario &&
      !match.players.some((player) => player.id_usuario === id_usuario)
    ) {
      throw new AppError("Acesso negado", 403);
    }

    const { topScorers, topAssists, performance } = aggregatePlayerStats(match.events);
    const mvp = performance[0] ?? null;

    return {
      match: {
        id_matches: match.id_matches,
        name: match.name,
        location: match.location,
        scheduled_at: match.scheduled_at,
        duration_minutes: match.duration_minutes,
        finished_at: match.finished_at,
        status: match.status,
      },
      teams: match.teams.map((team) => ({
        id_time: team.id_time,
        name: team.name,
        goals: team.goals,
        players: team.players.map((p) => ({
          id_players: p.id_players,
          name: p.name,
          position: p.position,
          is_guest: p.is_guest,
        })),
      })),
      mvp,
      topScorers,
      topAssists,
    };
  }
}
