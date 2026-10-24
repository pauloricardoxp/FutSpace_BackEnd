# FutSpace API - Backend

API REST para gerenciamento de partidas de futebol, com foco em automação de times, acompanhamento em tempo real e análise de desempenho dos jogadores.

Projetada para resolver problemas reais na organização de jogos amadores, oferecendo uma experiência completa desde a criação da partida até o pós-jogo.

## Requisitos

- **Node.js** ^18.0.0 (recomendado v20+)
- **npm**
- **PostgreSQL** 12+

## Quick Start

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env` na raiz (use `.env.example` como referência):

### 3. Executar migrations

```bash
npm run db:migrate
```

### 4. Rodar o servidor

```bash
npm run dev
```

Servidor estará em: **`http://localhost:8080`**

Documentação Swagger: **`http://localhost:8080/docs`**

## Scripts Disponíveis

```bash
npm run dev
npm start
npm run build
npm run db:migrate
npm run db:generate
npm run db:studio
```

## Arquitetura

```
src/
├── controllers/      # Lógica de requisição/resposta
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── schemas/         # Validação de dados
├── types/           # Tipos TypeScript
├── utils/           # Funções utilitárias
├── plugins/         # Plugins Fastify
└── index.ts         # Arquivo principal
```

## Endpoints

### Autenticação

```
POST   /auth/register          # Registrar novo usuário
POST   /auth/login             # Fazer login
```

### Partidas

```
GET    /matches                # Listar partidas
POST   /matches                # Criar partida
GET    /matches/:id            # Detalhes da partida
PATCH  /matches/:id_matches/start      # Iniciar partida
PATCH  /matches/:id_matches/finish     # Finalizar partida
```

### Jogadores

```
POST   /players/:id/add                        # Adicionar jogador
GET    /players/search                         # Buscar jogadores
DELETE /players/:id_matches/:id_players        # Remover jogador
```

### Times

```
POST   /matches/:id/teams/draw    # Sortear times automaticamente
GET    /matches/:id/teams         # Listar times da partida
```

### Eventos

```
POST   /matches/:id/events      # Registrar evento (gol/assist)
```

### Estatísticas

```
GET    /matches/:id/summary     # Resumo com MVP e top scorers
GET    /history                 # Histórico do usuário
GET    /dashboard               # Dashboard com estatísticas
```

### Perfil esportivo

O cadastro cria primeiro a conta e devolve um token. O perfil esportivo pode ser
criado depois em `/me/profiles`. As categorias disponíveis são `futsal`,
`society` e `campo`, e as posições são fornecidas por `GET /meta/sports`.
O número é o número da camisa, de 1 a 99. A posição usada pelo sorteio continua
sendo a posição macro `goleiro` ou `linha`.

```
GET    /me
PATCH  /me
GET    /me/profiles
POST   /me/profiles
PUT    /me/profiles/:id_profile
DELETE /me/profiles/:id_profile
POST   /me/photo
DELETE /me/photo
GET    /meta/sports
```

### Health Check

```
GET    /ping                    # Health check (responde "ok")
```

## Testando Localmente

### Com Curl

```bash
# Registrar usuário
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'

# Criar partida (substitua TOKEN)
curl -X POST http://localhost:8080/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "Pelada de Quinta",
    "location": "Parque Central",
    "scheduled_at": "2026-10-30T18:00:00Z",
    "duration_minutes": 90,
    "num_teams": 2,
    "players_per_team": 5
  }'
```

### Com Postman / Insomnia

1. Importe: `http://localhost:8080/docs`
2. A documentação interativa está disponível em Swagger
3. Use "Authorization" do Swagger para testar endpoints protegidos

## Modelo de Dados

| Tabela      | Descrição                      |
| ----------- | ------------------------------ |
| **Users**   | Usuários do sistema            |
| **Matches** | Partidas criadas               |
| **Teams**   | Times (criados por sorteio)    |
| **Players** | Jogadores em uma partida       |
| **Events**  | Eventos de gols e assistências |

## Autenticação

- Autenticação via JWT
- Senhas criptografadas com Bcrypt
- Rate limiting contra abuso
- Headers seguros com Helmet

## Desenvolvimento

### Adicionar nova rota

1. Crie em `src/routes/`
2. Adicione schema em `src/schemas/`
3. Implemente service em `src/services/`
4. Implemente controller em `src/controllers/`
5. Registre em `src/index.ts`

### Modificar banco de dados

```bash
# Edite prisma/schema.prisma
nano prisma/schema.prisma

# Execute migration
npm run db:migrate
```

### Visualizar dados

```bash
npm run db:studio
```

Abrirá interface visual em navegador.

## 🐛 Troubleshooting

### PostgreSQL não conecta

```bash
# Verifique se está rodando
psql -U usuario -d futspace

# Teste a URL
psql "postgresql://usuario:senha@localhost:5432/futspace"
```

### Erro: "Cannot find module"

```bash
npm install
npm run db:generate
```

### Servidor não inicia

```bash
# Verifique se porta 8080 está livre
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows
```

## Variáveis de Ambiente

Veja `.env.example` para template completo.

**Necessárias:**

- `DATABASE_URL` - Banco PostgreSQL
- `JWT_SECRET` - Chave obrigatória para assinar tokens

**Opcionais:**

- `CLOUDINARY_*` - Se quiser upload de imagens
- `NODE_ENV` - development/production
- `FRONTEND_URL` - Origem permitida pelo CORS

No Render, configure também `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e
`CLOUDINARY_API_SECRET` para habilitar o upload de fotos.

## Stack

- **Fastify** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia

## Deploy

A API está em produção:

🔗 Base URL:
https://seu-backend.onrender.com

📄 Documentação:
https://seu-backend.onrender.com/docs

### Infraestrutura:

- Backend: Render
- Frontend: Vercel
- Banco de dados: Supabase (PostgreSQL)

### Observação

O servidor pode entrar em modo de espera no plano gratuito.
Um endpoint `/ping` foi implementado para manter a API responsiva.
O deploy executa `prisma generate` no build e `prisma migrate deploy` antes de
iniciar a aplicação.

## Licença

ISC

Desenvolvido por **Paulo Ricardo**

---
