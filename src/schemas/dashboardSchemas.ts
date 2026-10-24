export const dashboardSchemas = {
  getDashboard: {
    tags: ["Dashboard"],
    summary: "Obter dashboard com estatísticas e partidas recentes",
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              id_usuario: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
              photo: { type: ["string", "null"] },
            },
          },
          stats: {
            type: "object",
            properties: {
              totalMatches: { type: "number" },
              totalGoals: { type: "number" },
            },
          },
          recentMatches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id_matches: { type: "number" },
                name: { type: "string" },
                status: {
                  type: "string",
                  enum: ["pending", "ongoing", "finished"],
                },
                scheduled_at: { type: "string" },
                teams: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id_time: { type: "number" },
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
