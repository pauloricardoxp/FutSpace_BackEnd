import { FieldPosition } from "@prisma/client";

export type playersCreate = {
    name: string
    position?: "linha" | "goleiro"
    field_position?: FieldPosition
    shirt_number?: number | null
    is_guest: boolean
    id_usuario?: number | null
}