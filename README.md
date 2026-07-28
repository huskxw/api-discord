<div align="center">

# 🦇 Discord Profile API

<img src="https://skillicons.dev/icons?i=ts,nodejs,express" height="80"/>

### Uma API desenvolvida em **TypeScript** para obter informações completas de perfis do Discord.

Ela reúne dados do usuário, Nitro, Boost, Presence, Activities, Badges, Clan Identity, Spotify, VS Code, Contas Conectadas e muito mais em um único endpoint.

---

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-black?style=for-the-badge&logo=express)
![Discord](https://img.shields.io/badge/Discord-API-5865F2?style=for-the-badge&logo=discord&logoColor=white)

</div>

---

# 🦇 Sobre

A **Discord Profile API** foi criada para facilitar a obtenção de praticamente todas as informações públicas e privadas disponíveis no perfil de um usuário do Discord.

Ao invés de realizar diversas requisições diferentes para a API do Discord, esta API centraliza tudo em apenas uma resposta JSON organizada.

Toda a aplicação foi desenvolvida em **TypeScript**, trazendo uma estrutura mais organizada, segura e fácil de manter.

---

# 🦇 Tecnologias

- ⚡ TypeScript
- ⚡ Node.js
- ⚡ Express
- ⚡ Discord.js
- ⚡ Discord API
- ⚡ DayJS
- ⚡ Dotenv
- ⚡ CORS

---

# 🦇 Estrutura da API

```
src/
│
├── server.ts
├── services/
│   ├── DiscordProfileService
│   ├── BadgeManager
│   ├── BadgeAssetProvider
│   └── CacheService
│
├── utils/
│   ├── buildBadgeUrl
│   ├── extractHash
│   └── helpers
│
└── routes/
    └── /api/discord/:userId
```

Cada classe possui uma responsabilidade específica.

| Classe | Responsabilidade |
|---------|------------------|
| 🦇 DiscordProfileService | Busca o perfil diretamente na API do Discord |
| 🦇 BadgeManager | Calcula Nitro, Boost e Badges |
| 🦇 BadgeAssetProvider | Obtém automaticamente os Assets das Badges |
| 🦇 CacheService | Armazena respostas temporariamente para diminuir requisições |

---

# 🦇 Endpoint

```
GET /api/discord/:userId
```

Exemplo:

```
http://localhost:3001/api/discord/123456789012345678
```

Caso nenhum ID seja informado, será utilizado o usuário definido no arquivo `.env`.

---

# 🦇 O que a API retorna?

A resposta contém diversas informações organizadas.

## 👤 Usuário

- ID
- Username
- Global Name
- Avatar
- Banner
- Flags
- Datas de criação
- Histórico de usernames

---

## 🦇 Presence

- Online
- Idle
- DND
- Offline
- Cor do status
- Nome do status

---

## 🎮 Activities

A API identifica automaticamente:

- VS Code
- Spotify
- Jogos
- Streaming
- Custom Status
- Rich Presence

Incluindo:

- imagens
- timestamps
- detalhes
- workspace
- linguagem
- música
- artista
- álbum

---

## 💎 Nitro

A API calcula automaticamente:

- Tipo do Nitro
- Data de início
- Badge atual
- Próxima Badge
- Data da próxima Badge

Sem necessidade de manter hashes fixos no código.

---

## 🚀 Server Boost

Também calcula automaticamente:

- Boost atual
- Próximo nível
- Datas
- Evolução do Boost

---

## 🏅 Badges

A API retorna todas as badges disponíveis no perfil do usuário.

Exemplo:

```json
[
   {
      "id":"active_developer",
      "description":"Active Developer",
      "icon_url":"..."
   }
]
```

---

## 👥 Clan Identity

Caso exista, retorna:

- Guild
- Nome
- TAG
- Badge
- Guild ID

---

## 🔗 Contas conectadas

Também retorna:

- GitHub
- Steam
- Xbox
- Spotify
- Twitch
- Reddit
- Twitter/X

e qualquer outra conta conectada ao perfil.

---

# 🦇 Sistema de Cache

A API possui cache interno.

Isso evita realizar centenas de chamadas iguais para o Discord.

Benefícios:

- ⚡ Mais velocidade
- ⚡ Menos consumo de API
- ⚡ Menos rate limit

---

# 🦇 Variáveis de Ambiente

Toda informação sensível fica armazenada no arquivo `.env`.

Isso evita expor tokens diretamente no código.

Exemplo:

```env
VITE_DISCORD_BOT_TOKEN=SEU_BOT_TOKEN

DISCORD_USER_TOKEN=SEU_USER_TOKEN

VITE_DISCORD_ID=ID_DO_USUARIO

VITE_DISCORD_SERVER_ID=ID_DO_SERVIDOR
```

---

# 🦇 Para que serve cada variável?

## 🔹 VITE_DISCORD_BOT_TOKEN

Token do Bot.

É utilizado pelo Discord.js para obter:

- Presence
- Activities
- Guild
- Member
- Status
- Informações do servidor

---

## 🔹 DISCORD_USER_TOKEN

Token da conta do Discord.

É utilizado para acessar o endpoint:

```
/users/:id/profile
```

Esse endpoint retorna muito mais informações que um Bot consegue obter.

Com ele é possível acessar automaticamente:

- Badges
- Nitro
- Premium Since
- Boost Since
- User Profile
- Clan Identity
- Theme Colors
- Pronouns
- Connected Accounts
- Bio

Além disso, os assets das badges são obtidos dinamicamente, sem precisar salvar hashes manualmente no código.

---

## 🔹 VITE_DISCORD_ID

Usuário padrão utilizado quando nenhum ID é enviado na rota.

---

## 🔹 VITE_DISCORD_SERVER_ID

Servidor utilizado pelo Discord.js para buscar:

- Presence
- Activities
- Boost
- Member

---

# 🦇 Como executar

Instale as dependências.

```bash
npm install
```

Configure o arquivo `.env`.

Depois execute:

```bash
npm run dev
```

A API ficará disponível em:

```
http://localhost:3001
```

---

# 🦇 Exemplo de resposta

```json
{
   "user":{},
   "presence":{},
   "nitro":{},
   "boost":{},
   "badges":[],
   "connected_accounts":[]
}
```

---

# 🦇 Recursos

✅ Perfil completo

✅ Avatar

✅ Banner

✅ Presence

✅ Activities

✅ Spotify

✅ VS Code

✅ Rich Presence

✅ Nitro

✅ Server Boost

✅ Badges

✅ Connected Accounts

✅ Clan Identity

✅ HypeSquad

✅ Theme Colors

✅ Bio

✅ Pronouns

✅ Cache

✅ TypeScript

✅ Express

✅ Discord.js

---

<div align="center">

# 🦇 Desenvolvido em TypeScript

Uma API moderna construída com **Node.js + Express + TypeScript**, focada em fornecer informações completas do perfil do Discord em um único endpoint, com código organizado, tipagem forte, cache inteligente e integração direta com a Discord API.

</div>