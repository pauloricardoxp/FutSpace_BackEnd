export type championshipCreate = {
    name: string;
    sport: "futebol" | "fifa"
    format: "league" | "knockout"
    players_per_team: number

}