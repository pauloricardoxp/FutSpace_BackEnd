import { PrismaClient } from "@prisma/client";
import { aggregatePlayerStats } from "../utils/playerStats.js";

export class historyService {
  constructor(private prisma: PrismaClient) {}

  async getHistory(id_usuario: number) {
    const matches = await this.prisma.matches.findMany({
      where: {
        status: "finished",
        players: {
          some: {
            id_usuario,
          },
        },
      },
      include: {
        teams: true,
        events: {
          include: {
            player: true,
          },
        },
        players: {
          where: {
            id_usuario,
          },
        },
      },
    });

    let userTotalGoals = 0;
    let userTotalAssists = 0;

    matches.forEach((match) => {
      const userPlayerIds = match.players.map((p) => p.id_players);

      match.events.forEach((event) => {
        if (userPlayerIds.includes(event.id_player)) {
          if (event.type === "goal") {
            userTotalGoals += 1;
          } else if (event.type === "assist") {
            userTotalAssists += 1;
          }
        }
      });
    });

    const matchHistory = matches.map((match) => {
      const userTeam = match.players.find((p) => p.id_usuario === id_usuario);
      const userTeamName = userTeam?.id_time
        ? match.teams.find((t) => t.id_time === userTeam.id_time)?.name
        : null;

      const { topScorers, topAssists } = aggregatePlayerStats(match.events);

      return {
        id_matches: match.id_matches,
        name: match.name,
        location: match.location,
        scheduled_at: match.scheduled_at,
        finished_at: match.finished_at,
        userTeam: userTeamName,
        teams: match.teams.map((t) => ({
          name: t.name,
          goals: t.goals,
        })),
        topScorers,
        topAssists,
      };
    });

    return {
      stats: {
        totalGoals: userTotalGoals,
        totalAssists: userTotalAssists,
      },
      matches: matchHistory,
    };
  }
}
