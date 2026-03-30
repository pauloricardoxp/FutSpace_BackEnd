export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Senha deve ter no mínimo 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra maiúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra minúscula");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Senha deve conter pelo menos um número");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Senha deve conter pelo menos um caractere especial (!@#$%^&*)",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateName(name: string): boolean {
  return name.length >= 3 && name.length <= 100;
}
