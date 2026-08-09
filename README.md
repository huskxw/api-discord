<div align="center">

# 🦇 Discord Profile API

<img src="https://skillicons.dev/icons?i=ts,nodejs,express,discordjs" height="80"/>

### Uma API desenvolvida em **TypeScript** para obter informações completas de perfis do Discord.

Ela reúne dados do usuário, Nitro, Boost, Presence, Activities, Status de conexão, Badges, Clan Identity, Spotify, VS Code, Contas Conectadas e muito mais em um único endpoint.

<br>

<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/Express-API-black?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white"/>

</div>

---

# 🦇 Sobre

A **Discord Profile API** foi criada para facilitar a obtenção de praticamente todas as informações disponíveis sobre o perfil de um usuário do Discord.

Ao invés de realizar diversas requisições diferentes para a API do Discord, esta API centraliza tudo em uma única resposta JSON organizada.

Toda a aplicação foi desenvolvida em **TypeScript**, trazendo uma estrutura organizada, tipagem forte e fácil manutenção.

---

# 🦇 Tecnologias

<div align="left">

<img src="https://skillicons.dev/icons?i=ts" height="45"/>
<img src="https://skillicons.dev/icons?i=nodejs" height="45"/>
<img src="https://skillicons.dev/icons?i=express" height="45"/>
<img src="https://skillicons.dev/icons?i=discordjs" height="45"/>

</div>

* ⚡ TypeScript
* ⚡ Node.js
* ⚡ Express
* ⚡ Discord.js
* ⚡ Discord API
* ⚡ DayJS
* ⚡ Dotenv
* ⚡ CORS

---

# 🦇 Estrutura da API

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

| Classe                   | Responsabilidade                                             |
| ------------------------ | ------------------------------------------------------------ |
| 🦇 DiscordProfileService | Busca o perfil diretamente na API do Discord                 |
| 🦇 BadgeManager          | Calcula Nitro, Boost e Badges                                |
| 🦇 BadgeAssetProvider    | Obtém automaticamente os Assets das Badges                   |
| 🦇 UserStatus            | Identifica o status e onde o usuário está conectado          |
| 🦇 UserVoice             | Localiza se o usuário está conectado a um canal de voz       |
| 🦇 CacheService          | Armazena respostas temporariamente para diminuir requisições |

---

# 🦇 Endpoint

```text
GET /api/discord/:userId
```

Caso nenhum ID seja informado, será utilizado o usuário definido no arquivo `.env`.

---

# 🦇 O que a API retorna?

A resposta contém diversas informações organizadas sobre o usuário.

---

## 👤 Usuário

* ID
* Username
* Global Name
* Avatar
* Banner
* Flags
* Datas de criação
* Histórico de usernames
* Histórico de display names
* Avatar Decoration

---

## 🟢 Presence

A API identifica automaticamente o estado atual do usuário.

* 🟢 Online
* 🟡 Idle
* 🔴 DND
* ⚫ Offline

Também retorna:

* Status atual
* Nome do status
* Cor do status
* Activities
* Rich Presence

---

## 📱 Status de conexão

A API também identifica **onde o usuário está conectado ao Discord**, separadamente do sistema de voz.

O status de conexão informa se o usuário está utilizando:

* 🌐 Discord Web
* 💻 Discord Desktop
* 📱 Discord Mobile
* 🧩 Discord Embedded
* 🥽 Discord VR

Essas informações permitem identificar em quais plataformas o usuário está ativo no momento.

O sistema trabalha com estados independentes para cada plataforma, permitindo que o JSON informe mais de uma conexão simultaneamente.

---

## 🎮 Activities

A API identifica automaticamente diferentes tipos de atividades.

* 💻 VS Code
* 🎵 Spotify
* 🎮 Jogos
* 📺 Streaming
* ✏️ Custom Status
* ⚡ Rich Presence

As atividades podem incluir:

* Imagens
* Timestamps
* Detalhes
* Workspace
* Linguagem
* Música
* Artista
* Álbum
* Aplicação
* Estado da atividade

---

## 💎 Nitro

A API calcula automaticamente informações relacionadas ao Nitro.

* Tipo do Nitro
* Data de início
* Badge atual
* Ícone da Badge atual
* Data da Badge atual
* Próxima Badge
* Data da próxima Badge

Os assets das badges são obtidos dinamicamente.

---

## 🚀 Server Boost

Também calcula automaticamente:

* Nível atual
* Ícone do nível
* Data do Boost
* Próximo nível
* Data do próximo nível
* Evolução do Boost

---

## 🏅 Badges

A API retorna as badges disponíveis no perfil do usuário.

Cada badge pode conter:

* ID
* Descrição
* Hash do ícone
* URL do ícone

---

## 👥 Clan Identity

Caso o usuário possua uma identidade de clan, a API pode retornar:

* Guild ID
* Nome da Guild
* TAG
* Badge
* Badge URL
* Estado da identidade

---

## 🔗 Contas conectadas

A API também retorna as contas conectadas ao perfil do usuário.

Entre elas:

* GitHub
* Steam
* Xbox
* Spotify
* Twitch
* Reddit
* Twitter/X

Além de outras contas disponibilizadas pelo Discord.

---

## 🔊 Voice

O sistema de voz funciona separadamente do status de conexão.

Quando o usuário está conectado a um canal de voz, a API pode identificar:

* Canal
* ID do canal
* Nome do canal
* Quantidade de participantes
* Se o usuário está sozinho
* Participantes conectados
* Estado de mute
* Estado de deaf
* Server mute
* Server deaf
* Streaming
* Câmera

---

# 🦇 Sistema de Cache

A API possui um sistema interno de cache.

Isso evita realizar chamadas repetidas desnecessariamente para o Discord.

Benefícios:

* ⚡ Mais velocidade
* ⚡ Menor consumo da API
* ⚡ Menor quantidade de requisições
* ⚡ Menor possibilidade de atingir rate limits

---

# 🦇 Variáveis de Ambiente

Toda informação sensível fica armazenada no arquivo `.env`.

```env
VITE_DISCORD_BOT_TOKEN=SEU_BOT_TOKEN
DISCORD_USER_TOKEN=SEU_USER_TOKEN
VITE_DISCORD_ID=ID_DO_USUARIO
VITE_DISCORD_SERVER_ID=ID_DO_SERVIDOR
```

---

# 🦇 Para que serve cada variável?

## 🔹 VITE_DISCORD_BOT_TOKEN

Token utilizado pelo Discord.js para obter informações necessárias para o funcionamento da API.

Entre elas:

* Presence
* Activities
* Guild
* Member
* Status
* Voice State

---

## 🔹 DISCORD_USER_TOKEN

Token utilizado para acessar informações adicionais do perfil disponibilizadas pelo endpoint de perfil do Discord.

Essas informações podem incluir:

* Badges
* Nitro
* Premium Since
* Boost Since
* User Profile
* Clan Identity
* Theme Colors
* Pronouns
* Connected Accounts
* Bio

---

## 🔹 VITE_DISCORD_ID

Define o usuário padrão utilizado quando nenhum ID é informado na rota.

---

## 🔹 VITE_DISCORD_SERVER_ID

Define o servidor utilizado pelo Discord.js para obter informações relacionadas a:

* Presence
* Activities
* Status de conexão
* Voice State
* Boost
* Member

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

# 🦇 Recursos

* ✅ Perfil completo
* ✅ Avatar
* ✅ Banner
* ✅ Avatar Decoration
* ✅ Presence
* ✅ Status
* ✅ Status de conexão
* ✅ Discord Web
* ✅ Discord Desktop
* ✅ Discord Mobile
* ✅ Discord Embedded
* ✅ Discord VR
* ✅ Activities
* ✅ Spotify
* ✅ VS Code
* ✅ Rich Presence
* ✅ Nitro
* ✅ Server Boost
* ✅ Badges
* ✅ Connected Accounts
* ✅ Clan Identity
* ✅ HypeSquad
* ✅ Theme Colors
* ✅ Bio
* ✅ Pronouns
* ✅ Voice State
* ✅ Voice Participants
* ✅ Cache
* ✅ TypeScript
* ✅ Express
* ✅ Discord.js

---

<div align="center">

# 🦇 Desenvolvido em TypeScript

Uma API moderna construída com **Node.js + Express + TypeScript**, focada em fornecer informações completas do perfil do Discord em um único endpoint.

<br>

<img src="https://skillicons.dev/icons?i=ts,nodejs,express,discordjs" height="55"/>

<br><br>

**Organizada • Tipada • Rápida • Completa**

</div>
