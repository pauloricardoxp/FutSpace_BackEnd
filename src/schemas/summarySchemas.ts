export const summarySchemas = {
  getMatchSummary: {
    tags: ["Summary"],
    security: [{ bearerAuth: [] }],
    summary: "Obter resumo completo da partida",
    params: {
      type: "object",
      properties: { id: { type: "string" } },
    },
    response: {
      200: {
        type: "object",
        properties: {
          match: {
            type: "object",
            properties: {
              id_matches: { type: "number" },
              name: { type: "string" },
              location: { type: "string" },
              scheduled_at: { type: "string" },
              duration_minutes: { type: "number" },
              finished_at: { type: ["string", "null"] },
              status: { type: "string" },
            },
          },
          teams: { type: "array" },
          mvp: {
            type: ["object", "null"],
            properties: {
              name: { type: "string" },
              goals: { type: "number" },
              assists: { type: "number" },
              totalPoints: { type: "number" },
            },
          },
          topScorers: { type: "array" },
          topAssists: { type: "array" },
        },
      },
    },
  },
};
