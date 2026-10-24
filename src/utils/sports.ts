import { Category, FieldPosition, Sport } from "@prisma/client";

export const sports = {
  futebol: {
    futsal: ["goleiro", "fixo", "ala", "pivo"],
    society: ["goleiro", "zagueiro", "ala", "meia", "atacante"],
    campo: ["goleiro", "zagueiro", "lateral", "volante", "meia", "atacante"],
  },
} as const;

export function isValidPosition(
  category: Category | string,
  position: FieldPosition | string,
) {
  return Object.values(sports.futebol[category as keyof typeof sports.futebol] ?? [])
    .includes(position as never);
}

export function isValidCategory(category: string): category is Category {
  return Object.prototype.hasOwnProperty.call(sports.futebol, category);
}

export function toMacroPosition(position: FieldPosition) {
  return position === "goleiro" ? "goleiro" as const : "linha" as const;
}

export function isValidSport(sport: string): sport is Sport {
  return sport === "futebol";
}
