export const historySchemas = {
  getHistory: {
    tags: ["History"],
    security: [{ bearerAuth: [] }],
    summary: "Obter histórico de partidas do usuário",
    response: {
      200: {
        type: "object",
        properties: {
          stats: {
            type: "object",
            properties: {
              totalGoals: { type: "number" },
              totalAssists: { type: "number" },
            },
          },
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id_matches: { type: "number" },
                name: { type: "string" },
                location: { type: ["string", "null"] },
                scheduled_at: { type: "string" },
                finished_at: { type: ["string", "null"] },
                userTeam: { type: ["string", "null"] },
                teams: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      goals: { type: "number" },
                    },
                  },
                },
                topScorers: { type: "array" },
                topAssists: { type: "array" },
              },
            },
          },
        },
      },
    },
  },
};
