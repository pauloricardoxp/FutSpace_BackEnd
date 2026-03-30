export const matchesSchemas = {
  create: {
    tags: ["Matches"],
    summary: "Criar nova partida",
    body: {
      type: "object",
      required: [
        "name",
        "scheduled_at",
        "duration_minutes",
        "num_teams",
        "players_per_team",
      ],
      properties: {
        name: { type: "string", default: "Futebol de Quinta" },
        location: { type: "string", default: "Campo do Bairro" },
        scheduled_at: {
          type: "string",
          format: "date-time",
          default: "2026-03-31T18:00:00Z",
        },
        duration_minutes: { type: "number", default: 90 },
        num_teams: { type: "number", default: 2 },
        players_per_team: { type: "number", default: 5 },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_matches: { type: "number" },
          name: { type: "string" },
          status: { type: "string", enum: ["pending", "ongoing", "finished"] },
        },
      },
    },
  },

  list: {
    tags: ["Matches"],
    summary: "Listar partidas do usuário",
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_matches: { type: "number" },
            name: { type: "string" },
            status: { type: "string" },
          },
        },
      },
    },
  },

  getById: {
    tags: ["Matches"],
    summary: "Obter partida por ID",
    params: {
      type: "object",
      properties: { id: { type: "string" } },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_matches: { type: "number" },
          name: { type: "string" },
        },
      },
    },
  },

  start: {
    tags: ["Matches"],
    summary: "Iniciar partida",
    params: {
      type: "object",
      properties: { id_matches: { type: "string" } },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_matches: { type: "number" },
          status: { type: "string", enum: ["ongoing"] },
        },
      },
    },
  },

  finish: {
    tags: ["Matches"],
    summary: "Finalizar partida",
    params: {
      type: "object",
      properties: { id_matches: { type: "string" } },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_matches: { type: "number" },
          status: { type: "string", enum: ["finished"] },
        },
      },
    },
  },
};
