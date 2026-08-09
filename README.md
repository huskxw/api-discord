# 🦇 Discord Profile API

### Uma API desenvolvida em **TypeScript** para obter informações completas de perfis do Discord.

Ela reúne dados do usuário, Nitro, Boost, Presence, Activities, Badges, Clan Identity, Spotify, VS Code, Contas Conectadas e agora também identifica **em qual plataforma do Discord o usuário está conectado**, tudo em um único endpoint.

---

# 🦇 Sobre

A **Discord Profile API** foi criada para facilitar a obtenção de praticamente todas as informações públicas e privadas disponíveis no perfil de um usuário do Discord.

Ao invés de realizar diversas requisições diferentes para a API do Discord, esta API centraliza tudo em apenas uma resposta JSON organizada.

Toda a aplicação foi desenvolvida em **TypeScript**, trazendo uma estrutura mais organizada, segura e fácil de manter.

---

# 🦇 Tecnologias

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
├── services/
│   ├── DiscordProfileService
│   ├── BadgeManager
│   ├── BadgeAssetProvider
│   ├── UserVoice
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
| 🦇 CacheService          | Armazena respostas temporariamente para diminuir requisições |
| 🦇 UserVoice             | Localiza se o usuário está em um canal de voz                |

---

# 🦇 Endpoint

```text
GET /api/discord/:userId
```

```text
http://localhost:3001/api/discord/$ID
```

Caso nenhum ID seja informado, será utilizado o usuário definido no arquivo `.env`.

---

# 🦇 O que a API retorna?

A resposta contém diversas informações organizadas.

## 👤 Usuário

* ID
* Username
* Global Name
* Avatar
* Banner
* Flags
* Datas de criação
* Histórico de usernames

---

## 🦇 Presence

A API identifica o status atual do usuário:

* Online
* Idle
* DND
* Offline
* Cor do status
* Nome do status

---

## 🖥️ Status de Conexão

A API também identifica **onde a conta do Discord está conectada no momento**.

Essa informação é independente do status Online, Idle, DND ou Offline e também não possui relação com canais de voz ou chamadas.

A API identifica as plataformas de conexão disponíveis para a conta:

* Discord Web
* Discord Desktop
* Discord Mobile
* Discord Embedded
* Discord VR

Cada plataforma é retornada individualmente como um valor booleano, permitindo identificar quais sessões estão ativas naquele momento.

Isso permite saber, por exemplo, se o usuário está utilizando o Discord pelo:

* 🌐 Navegador
* 🖥️ Aplicativo Desktop
* 📱 Aplicativo Mobile
* 🔲 Aplicação Embedded
* 🥽 VR

O sistema mantém essas informações separadas do `Presence` e do sistema de Voice Chat.

---

## 🎮 Activities

A API identifica automaticamente:

* VS Code
* Spotify
* Jogos
* Streaming
* Custom Status
* Rich Presence

Incluindo:

* imagens
* timestamps
* detalhes
* workspace
* linguagem
* música
* artista
* álbum

---

## 💎 Nitro

A API calcula automaticamente:

* Tipo do Nitro
* Data de início
* Badge atual
* Próxima Badge
* Data da próxima Badge

Sem necessidade de manter hashes fixos no código.

---

## 🚀 Server Boost

Também calcula automaticamente:

* Boost atual
* Próximo nível
* Datas
* Evolução do Boost

---

## 🏅 Badges

A API retorna todas as badges disponíveis no perfil do usuário.

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

* Guild
* Nome
* TAG
* Badge
* Guild ID

---

## 🔗 Contas conectadas

Também retorna:

* GitHub
* Steam
* Xbox
* Spotify
* Twitch
* Reddit
* Twitter/X

e qualquer outra conta conectada ao perfil.

---

## 🎙️ Voice

Além do status de conexão da conta, a API possui um sistema separado para identificar informações de Voice Chat.

O sistema pode identificar:

* Se o usuário está conectado a um canal de voz
* Canal atual
* ID do canal
* Nome do canal
* Quantidade de participantes
* Participantes conectados
* Estado de voz dos participantes

O sistema de Voice é completamente separado do sistema de **Status de Conexão**, evitando misturar informações de plataforma com informações de canal de voz.

---

# 🦇 Sistema de Cache

A API possui cache interno.

Isso evita realizar centenas de chamadas iguais para o Discord.

Benefícios:

* ⚡ Mais velocidade
* ⚡ Menos consumo de API
* ⚡ Menos rate limit

---

# 🦇 Variáveis de Ambiente

Toda informação sensível fica armazenada no arquivo `.env`.

Isso evita expor tokens diretamente no código.

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

* Presence
* Activities
* Guild
* Member
* Status
* Informações do servidor
* Informações de Voice

---

## 🔹 DISCORD_USER_TOKEN

Token da conta do Discord.

É utilizado para acessar o endpoint:

```text
/users/:id/profile
```

Esse endpoint retorna muito mais informações que um Bot consegue obter.

Com ele é possível acessar automaticamente:

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

Além disso, os assets das badges são obtidos dinamicamente, sem precisar salvar hashes manualmente no código.

---

## 🔹 VITE_DISCORD_ID

Usuário padrão utilizado quando nenhum ID é enviado na rota.

---

## 🔹 VITE_DISCORD_SERVER_ID

Servidor utilizado pelo Discord.js para buscar informações relacionadas ao servidor e ao usuário, incluindo:

* Presence
* Activities
* Boost
* Member
* Voice

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

```text
http://localhost:3001
```

---

# 🦇 Exemplo de resposta

```json
{
   "user":{},
   "presence":{},
   "connection_status":{},
   "voice":{},
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
✅ Status de conexão
✅ Discord Web
✅ Discord Desktop
✅ Discord Mobile
✅ Discord Embedded
✅ Discord VR
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
✅ VoiceGuild
✅ Voice Chat
✅ Participantes da Call
✅ Cache
✅ TypeScript
✅ Express
✅ Discord.js

---

# 🦇 Desenvolvido em TypeScript

Uma API moderna construída com **Node.js + Express + TypeScript**, focada em fornecer informações completas do perfil do Discord em um único endpoint, incluindo perfil, presença, atividades, status de conexão da conta, informações de Voice Chat, Nitro, Boost, Badges e diversas outras informações disponibilizadas pelo Discord.
