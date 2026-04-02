import { PrismaClient } from "@prisma/client";

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
      const goals = match.events.filter((e) => e.type === "goal");
      const assists = match.events.filter((e) => e.type === "assist");

      const userTeam = match.players.find((p) => p.id_usuario === id_usuario);
      const userTeamName = userTeam?.id_time
        ? match.teams.find((t) => t.id_time === userTeam.id_time)?.name
        : null;

      const topScorers = Object.values(
        goals.reduce((acc: any, e) => {
          if (!acc[e.id_player]) {
            acc[e.id_player] = { name: e.player.name, goals: 0 };
          }
          acc[e.id_player].goals += 1;
          return acc;
        }, {}),
      ).sort((a: any, b: any) => b.goals - a.goals);

      const topAssists = Object.values(
        assists.reduce((acc: any, e) => {
          if (!acc[e.id_player]) {
            acc[e.id_player] = { name: e.player.name, assists: 0 };
          }
          acc[e.id_player].assists += 1;
          return acc;
        }, {}),
      ).sort((a: any, b: any) => b.assists - a.assists);

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
