<div align="center">

# 🦇 Discord Profile API

### An API developed in **TypeScript** to fetch complete Discord profile information.

It gathers user data, Nitro, Boost, Presence, Activities, Connection Status, Badges, Clan Identity, Spotify, VS Code, Connected Accounts, and much more into a single endpoint.

---

# About

The **Discord Profile API** was created to make it easy to retrieve virtually all available information about a Discord user's profile.

Instead of making multiple different requests to the Discord API, this API centralizes everything into a single, organized JSON response.

The entire application was developed in **TypeScript**, bringing an organized structure, strong typing, and easy maintenance.

---

# Technologies

<img src="https://skillicons.dev/icons?i=typescript,nodejs,express,discordjs&perline=4" height="80"/>

<br>

<img src="https://skillicons.dev/icons?i=javascript,npm&perline=4" height="60"/>

---

</div>


#  Estrutura da API

```text
src/
│
├── server.ts
│
├── services/
│   ├── DiscordProfileService
│   ├── BadgeManager
│   ├── BadgeAssetProvider
│   ├── UserVoice
│   ├── UserStatus
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
| --- | --- |
| 🦇 DiscordProfileService | Busca o perfil diretamente na API do Discord |
| 🦇 BadgeManager | Calcula Nitro, Boost e Badges |
| 🦇 BadgeAssetProvider | Obtém automaticamente os Assets das Badges |
| 🦇 UserStatus | Identifica o status e onde o usuário está conectado |
| 🦇 UserVoice | Localiza se o usuário está conectado a um canal de voz |
| 🦇 CacheService | Armazena respostas temporariamente para diminuir requisições |

---

#  Endpoint

```text
GET /api/discord/:userId
```

Caso nenhum ID seja informado, será utilizado o usuário definido no arquivo `.env`.

---

#  O que a API retorna?

A resposta contém diversas informações organizadas sobre o usuário.

---

##  Usuário

- ID
- Username
- Global Name
- Avatar
- Banner
- Flags
- Datas de criação
- Histórico de usernames
- Histórico de display names
- Avatar Decoration

---

## Presence

A API identifica automaticamente o estado atual do usuário.

- 🟢 Online
- 🟡 Idle
- 🔴 DND
- ⚫ Offline

Também retorna:

- Status atual
- Nome do status
- Cor do status
- Activities
- Rich Presence

---

##  Status de conexão

A API também identifica **onde o usuário está conectado ao Discord**, separadamente do sistema de voz.

O status de conexão informa se o usuário está utilizando:

- 🌐 Discord Web
- 💻 Discord Desktop
- 📱 Discord Mobile
- 🧩 Discord Embedded
- 🥽 Discord VR

Essas informações permitem identificar em quais plataformas o usuário está ativo no momento.

O sistema trabalha com estados independentes para cada plataforma, permitindo que o JSON informe mais de uma conexão simultaneamente.

Os campos retornados são:

- `active_on_discord_web`
- `active_on_discord_desktop`
- `active_on_discord_mobile`
- `active_on_discord_embedded`
- `active_on_discord_vr`

O sistema de status de conexão é independente do sistema de voz. Estar conectado ao Discord Desktop, Web ou Mobile não significa que o usuário esteja conectado a um canal de voz.

---

## 🎮 Activities

A API identifica automaticamente diferentes tipos de atividades.

-  VS Code
-  Spotify
-  Jogos
-  Streaming
-  Custom Status
-  Rich Presence

As atividades podem incluir:

- Imagens
- Timestamps
- Detalhes
- Workspace
- Linguagem
- Música
- Artista
- Álbum
- Aplicação
- Estado da atividade

---

##  Nitro

A API calcula automaticamente informações relacionadas ao Nitro.

- Tipo do Nitro
- Data de início
- Badge atual
- Ícone da Badge atual
- Data da Badge atual
- Próxima Badge
- Data da próxima Badge

Os assets das badges são obtidos dinamicamente.

---

##  Server Boost

Também calcula automaticamente:

- Nível atual
- Ícone do nível
- Data do Boost
- Próximo nível
- Data do próximo nível
- Evolução do Boost

---

##  Badges

A API retorna as badges disponíveis no perfil do usuário.

Cada badge pode conter:

- ID
- Descrição
- Hash do ícone
- URL do ícone

---

##  Clan Identity

Caso o usuário possua uma identidade de clan, a API pode retornar:

- Guild ID
- Nome da Guild
- TAG
- Badge
- Badge URL
- Estado da identidade

---

##  Contas conectadas

A API também retorna as contas conectadas ao perfil do usuário.

Entre elas:

- GitHub
- Steam
- Xbox
- Spotify
- Twitch
- Reddit
- Twitter/X

Além de outras contas disponibilizadas pelo Discord.

---

##  Voice

O sistema de voz funciona separadamente do status de conexão.

Quando o usuário está conectado a um canal de voz, a API pode identificar:

- Canal
- ID do canal
- Nome do canal
- Quantidade de participantes
- Se o usuário está sozinho
- Participantes conectados
- Estado de mute
- Estado de deaf
- Server mute
- Server deaf
- Streaming
- Câmera

---

#  Sistema de Cache

A API possui um sistema interno de cache.

Isso evita realizar chamadas repetidas desnecessariamente para o Discord.

Benefícios:

- ⚡ Mais velocidade
- ⚡ Menor consumo da API
- ⚡ Menor quantidade de requisições
- ⚡ Menor possibilidade de atingir rate limits

---

#  Variáveis de Ambiente

Toda informação sensível fica armazenada no arquivo `.env`.

```env
VITE_DISCORD_BOT_TOKEN=SEU_BOT_TOKEN
DISCORD_USER_TOKEN=SEU_USER_TOKEN
VITE_DISCORD_ID=ID_DO_USUARIO
VITE_DISCORD_SERVER_ID=ID_DO_SERVIDOR
```

---

# Para que serve cada variável?

##  VITE_DISCORD_BOT_TOKEN

Token utilizado pelo Discord.js para obter informações necessárias para o funcionamento da API.

Entre elas:

- Presence
- Activities
- Guild
- Member
- Status
- Voice State

---

##  DISCORD_USER_TOKEN

Token utilizado para acessar informações adicionais do perfil disponibilizadas pelo endpoint de perfil do Discord.

Essas informações podem incluir:

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

---

## VITE_DISCORD_ID

Define o usuário padrão utilizado quando nenhum ID é informado na rota.

---

## VITE_DISCORD_SERVER_ID

Define o servidor utilizado pelo Discord.js para obter informações relacionadas a:

- Presence
- Activities
- Status de conexão
- Voice State
- Boost
- Member

---

# 🦇 Como executar

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env`.

Depois execute:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3001
```

---

# 📸 Preview

A API retorna todas as informações organizadas em uma única resposta JSON.

![Preview do JSON da API](docs/assets/card-preview.png)

A estrutura principal da resposta é dividida em:

```text
user
user_profile
clan_identity
presence
voice
nitro
boost
badges
connected_accounts

---

# Recursos

- ✅ Perfil completo
- ✅ Avatar
- ✅ Banner
- ✅ Avatar Decoration
- ✅ Presence
- ✅ Status
- ✅ Status de conexão
- ✅ Discord Web
- ✅ Discord Desktop
- ✅ Discord Mobile
- ✅ Discord Embedded
- ✅ Discord VR
- ✅ Activities
- ✅ Spotify
- ✅ VS Code
- ✅ Rich Presence
- ✅ Nitro
- ✅ Server Boost
- ✅ Badges
- ✅ Connected Accounts
- ✅ Clan Identity
- ✅ HypeSquad
- ✅ Theme Colors
- ✅ Bio
- ✅ Pronouns
- ✅ Voice State
- ✅ Voice Participants
- ✅ Cache
- ✅ TypeScript
- ✅ Express
- ✅ Discord.js

---

# 🦇 Desenvolvido em TypeScript

Uma API moderna construída com **Node.js + Express + TypeScript**, focada em fornecer informações completas do perfil do Discord em um único endpoint.

**Organizada • Tipada • Rápida • Completa**
