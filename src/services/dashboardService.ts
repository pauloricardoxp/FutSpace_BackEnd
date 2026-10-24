import { PrismaClient } from "@prisma/client";
import { aggregatePlayerStats } from "../utils/playerStats.js";
import { AppError } from "../utils/errorHandler.js";

export class dashboardService {
  constructor(private prisma: PrismaClient) {}

  async getDashboard(id_usuario: number) {
    const user = await this.prisma.users.findUnique({
      where: { id_usuario },
      select: {
        id_usuario: true,
        name: true,
        email: true,
        photo: true,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const allMatches = await this.prisma.matches.findMany({
      where: {
        OR: [
          { id_usuario }, // Partidas que ele criou
          {
            players: {
              some: {
                id_usuario,
              },
            },
          }, // Partidas que ele é jogador
        ],
      },
      include: {
        teams: true,
        events: {
          include: {
            player: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const matchesUserPlayed = await this.prisma.matches.findMany({
      where: {
        players: {
          some: {
            id_usuario,
          },
        },
      },
    });

    const totalMatches = matchesUserPlayed.length;

    let totalGoals = 0;
    const userGoals = allMatches.flatMap((match) =>
      match.events.filter(
        (e) => e.type === "goal" && e.player.id_usuario === user.id_usuario,
      ),
    );
    totalGoals = userGoals.length;

    const recentMatches = allMatches.map((match) => {
      const { topScorers, topAssists } = aggregatePlayerStats(match.events);

      return {
        id_matches: match.id_matches,
        name: match.name,
        status: match.status,
        scheduled_at: match.scheduled_at,
        teams: match.teams.map((t) => ({
          id_time: t.id_time,
          name: t.name,
          goals: t.goals,
        })),
        topScorers,
        topAssists,
      };
    });

    return {
      user,
      stats: {
        totalMatches,
        totalGoals,
      },
      recentMatches,
    };
  }
}
