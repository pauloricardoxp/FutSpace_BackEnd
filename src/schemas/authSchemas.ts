export const authSchemas = {
  register: {
    tags: ["Auth"],
    summary: "Registrar no FutSpace",
    body: {
      type: "object",
      required: ["nome", "email", "senha",],
      properties: {
        nome: { type: "string", default: "Paulo Ricardo" },
        email: { type: "string", default: "paulo@email.com" },
        senha: { type: "string", default: "123456" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_usuario: { type: "number" },
          nome: { type: "string" },
          email: { type: "string" },
          creado_em: { type: "string" },
        },
      },
    },
  },

  login: {
    tags: ["Auth"],
    summary: "Login no FutSpace",
    body: {
      type: "object",
      required: ["email", "senha"],
      properties: {
        email: { type: "string", default: "teste@email.com" },
        senha: { type: "string", default: "123456" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          token: { type: "string" },
          nome: { type: "string" },
        },
      },
    },
  },
};
