import { PrismaClient } from "@prisma/client";

export class summaryService {
  constructor(private prisma: PrismaClient) {}

  async getMatchSummary(id_matches: number) {
    const match = await this.prisma.matches.findUnique({
      where: { id_matches },
      include: {
        teams: {
          include: {
            players: true,
          },
        },
        events: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!match) {
      throw new Error("Partida não encontrada");
    }

    const goals = match.events.filter((e) => e.type === "goal");
    const assists = match.events.filter((e) => e.type === "assist");

    const scorersMap = new Map<number, { name: string; goals: number }>();
    for (const goal of goals) {
      const existing = scorersMap.get(goal.id_player);
      if (existing) {
        existing.goals += 1;
      } else {
        scorersMap.set(goal.id_player, {
          name: goal.player.name,
          goals: 1,
        });
      }
    }

    const assistsMap = new Map<number, { name: string; assists: number }>();
    for (const assist of assists) {
      const existing = assistsMap.get(assist.id_player);
      if (existing) {
        existing.assists += 1;
      } else {
        assistsMap.set(assist.id_player, {
          name: assist.player.name,
          assists: 1,
        });
      }
    }

    const topScorers = Array.from(scorersMap.values()).sort(
      (a, b) => b.goals - a.goals,
    );

    const topAssists = Array.from(assistsMap.values()).sort(
      (a, b) => b.assists - a.assists,
    );

    const playerPerformance = new Map<
      number,
      { name: string; goals: number; assists: number; totalPoints: number }
    >();

    for (const [playerId, scorer] of scorersMap.entries()) {
      playerPerformance.set(playerId, {
        name: scorer.name,
        goals: scorer.goals,
        assists: 0,
        totalPoints: scorer.goals,
      });
    }

    for (const [playerId, assist] of assistsMap.entries()) {
      const existing = playerPerformance.get(playerId);
      if (existing) {
        existing.assists = assist.assists;
        existing.totalPoints = existing.goals + assist.assists;
      } else {
        playerPerformance.set(playerId, {
          name: assist.name,
          goals: 0,
          assists: assist.assists,
          totalPoints: assist.assists,
        });
      }
    }

    const mvp =
      Array.from(playerPerformance.values()).sort(
        (a, b) => b.totalPoints - a.totalPoints,
      )[0] || null;

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
