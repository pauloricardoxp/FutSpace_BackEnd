import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/errorHandler.js";
import { championshipCreate } from "../types/championships.js";

export class championshipsService {
    constructor(private prisma: PrismaClient) {}

    async create(data: championshipCreate, id_usuario: number){
        if(!data.name){
            throw new AppError("O nome do campeonato é obrigatório", 400);
            
        }
    }
}