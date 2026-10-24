import { Category, FieldPosition, Sport } from "@prisma/client";

export type ProfileInput = {
  sport: Sport;
  category: Category;
  position: FieldPosition;
  shirt_number?: number | null;
};

export type ProfileUpdate = Partial<ProfileInput>;

export type ProfileUser = {
  id_usuario: number;
  name: string;
  email: string;
  photo: string | null;
  profiles: Array<{
    id_profile: number;
    sport: Sport;
    category: Category;
    position: FieldPosition;
    shirt_number: number | null;
  }>;
};
