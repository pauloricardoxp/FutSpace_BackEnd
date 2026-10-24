export const teamsSchemas = {
  draw: {
    tags: ["Teams"],
    security: [{ bearerAuth: [] }],
    summary: "Sortear times automaticamente",
    params: {
      type: "object",
      properties: { id: { type: "string" } },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            team: {
              type: "object",
              properties: {
                id_time: { type: "number" },
                name: { type: "string" },
                goals: { type: "number" },
              },
            },
            players: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_players: { type: "number" },
                  name: { type: "string" },
                  position: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  getTeams: {
    tags: ["Teams"],
    security: [{ bearerAuth: [] }],
    summary: "Obter times de uma partida",
    params: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            team: {
              type: "object",
              properties: {
                id_time: { type: "number" },
                name: { type: "string" },
                goals: { type: "number" },
              },
              required: ["id_time", "name", "goals"],
            },
            players: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_players: { type: "number" },
                  name: { type: "string" },
                  position: { type: "string" },
                  id_matches: { type: "number" },
                  id_time: { type: ["number", "null"] },
                },
              },
            },
          },
          required: ["team", "players"],
        },
      },
      500: {
        type: "object",
        properties: { error: { type: "string" } },
      },
    },
  },
};
