export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(err: any) {
  const message = err?.message || "Erro interno do servidor";

  // Erros de validação (400)
  if (
    message.includes("obrigatório") ||
    message.includes("Informe") ||
    message.includes("inválid") ||
    message.includes("deve ser") ||
    message.includes("deve ter") ||
    message.includes("deve conter") ||
    message.includes("caracteres") ||
    message.includes("Email") ||
    message.includes("Senha") ||
    message.includes("Nome")
  ) {
    return { statusCode: 400, message };
  }

  // Erros de não encontrado (404)
  if (
    message.includes("não encontrad") ||
    message.includes("não existe") ||
    message.includes("Not found")
  ) {
    return { statusCode: 404, message };
  }

  // Erros de acesso/permissão (403)
  if (
    message.includes("permissão") ||
    message.includes("Acesso negado") ||
    message.includes("não tem acesso") ||
    message.includes("não autorizado")
  ) {
    return { statusCode: 403, message };
  }

  // Erros de conflito (409)
  if (
    message.includes("já existe") ||
    message.includes("já cadastrado") ||
    message.includes("duplicado") ||
    message.includes("máximo de")
  ) {
    return { statusCode: 409, message };
  }

  // Erros de estado inválido (422)
  if (
    message.includes("já foi iniciada") ||
    message.includes("já encerrada") ||
    message.includes("pendentes") ||
    message.includes("em andamento")
  ) {
    return { statusCode: 422, message };
  }

  // Erro genérico (500)
  return { statusCode: 500, message };
}
