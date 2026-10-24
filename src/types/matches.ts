import { Category, Sport } from "@prisma/client";

export type matchesCreate = {
  name: string
  location?: string
  scheduled_at: Date
  duration_minutes: number
  num_teams: number
  players_per_team: number
  category: Category
  sport?: Sport
}