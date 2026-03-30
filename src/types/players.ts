export type playersCreate = {
    name: string
    position : "linha" | "goleiro"
    is_guest: boolean
    id_usuario?: number | null
}