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
    summary: "Obter partida com jogadores e detalhes",
    params: {
      type: "object",
      properties: { id_matches: { type: "string" } },
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
              num_teams: { type: "number" },
              players_per_team: { type: "number" },
              status: { type: "string" },
            },
          },
          configuration: {
            type: "object",
            properties: {
              totalPlayersNeeded: { type: "number" },
              playersAdded: { type: "number" },
              spotsAvailable: { type: "number" },
            },
          },
          score: {
            type: "object",
            properties: {
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
              totalGoals: { type: "number" },
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
                is_guest: { type: "boolean" },
                id_usuario: { type: "number" },
                id_time: { type: "number" },
              },
            },
          },
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
