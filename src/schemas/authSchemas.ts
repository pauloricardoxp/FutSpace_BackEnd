export const authSchemas = {
  register: {
    tags: ["Auth"],
    summary: "Registrar no FutSpace",
    body: {
      type: "object",
      additionalProperties: false,
      required: ["name", "email", "password"],
      properties: {
        name: { type: "string", default: "Paulo Ricardo" },
        email: { type: "string", default: "paulo@email.com" },
        password: { type: "string", default: "Senha@123" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          token: { type: "string" },
          id_usuario: { type: "number" },
          name: { type: "string" },
          email: { type: "string" },
          photo: { type: ["string", "null"] },
          has_profile: { type: "boolean" },
        },
      },
    },
  },

  login: {
    tags: ["Auth"],
    summary: "Login no FutSpace",
    body: {
      type: "object",
      additionalProperties: false,
      required: ["email", "password"],
      properties: {
        email: { type: "string", default: "paulo@email.com" },
        password: { type: "string", default: "Senha@123" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          token: { type: "string" },
          id_usuario: { type: "number" },
          name: { type: "string" },
          email: { type: "string" },
          photo: { type: ["string", "null"] },
          has_profile: { type: "boolean" },
        },
      },
    },
  },
};
