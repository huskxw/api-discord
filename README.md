````markdown
<div align="center">

# 🦇 Discord Profile API

### An API developed in **TypeScript** to fetch complete Discord profile information.

It gathers user data, Nitro, Boost, Presence, Activities, Connection Status, Badges, Clan Identity, Spotify, VS Code, Connected Accounts, and much more into a single endpoint.

---

## About

The **Discord Profile API** was created to make it easy to retrieve virtually all available information from a Discord user's profile.

Instead of making multiple requests to the Discord API, this API centralizes everything into a single, organized JSON response.

The entire application was developed in **TypeScript**, providing an organized structure, strong typing, and easy maintenance.

---

## Technologies

**Node.js • Express • TypeScript • Discord.js**

---

## API Structure

</div>

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
````

<div align="center">

Each class has a specific responsibility.

|           Class           | Responsibility                                           |
| :-----------------------: | :------------------------------------------------------- |
| **DiscordProfileService** | Fetches the profile directly from the Discord API        |
|      **BadgeManager**     | Calculates Nitro, Boost, and Badge information           |
|   **BadgeAssetProvider**  | Automatically retrieves Badge assets                     |
|       **UserStatus**      | Identifies the user's status and connection platforms    |
|       **UserVoice**       | Detects whether the user is connected to a voice channel |
|      **CacheService**     | Temporarily stores responses to reduce API requests      |

---

## Endpoint

</div>

```text
GET /api/discord/:userId
```

<div align="center">

If no user ID is provided, the user defined in the `.env` file will be used.

---

# What Does the API Return?

The response contains a wide range of organized information about the user.

## User

</div>

* ID
* Username
* Global Name
* Avatar
* Banner
* Flags
* Account Creation Date
* Username History
* Display Name History
* Avatar Decoration

<div align="center">

---

## Presence

The API automatically identifies the user's current presence state.

| Status | State          |
| :----: | :------------- |
|   🟢   | Online         |
|   🟡   | Idle           |
|   🔴   | Do Not Disturb |
|    ⚫   | Offline        |

The response can also include:

* Current Status
* Status Name
* Status Color
* Activities
* Rich Presence

---

## Connection Status

The API identifies **where the user is connected to Discord**, independently from the voice system.

</div>

* Discord Web
* Discord Desktop
* Discord Mobile
* Discord Embedded
* Discord VR

<div align="center">

These values allow the API to determine which Discord platforms are currently active.

The system supports multiple active platforms simultaneously.

### Connection Fields

</div>

```text
active_on_discord_web
active_on_discord_desktop
active_on_discord_mobile
active_on_discord_embedded
active_on_discord_vr
```

<div align="center">

The connection status system is completely independent from the voice system.

Being connected through Discord Desktop, Web, or Mobile does not mean that the user is connected to a voice channel.

---

## Activities

The API automatically detects different types of activities.

</div>

* VS Code
* Spotify
* Games
* Streaming
* Custom Status
* Rich Presence

<div align="center">

Activities can include:

</div>

* Images
* Timestamps
* Details
* Workspace
* Programming Language
* Song
* Artist
* Album
* Application
* Activity State

<div align="center">

---

## Nitro

The API automatically calculates information related to Discord Nitro.

</div>

* Nitro Type
* Start Date
* Current Badge
* Current Badge Icon
* Current Badge Date
* Next Badge
* Next Badge Date

<div align="center">

Badge assets are retrieved dynamically.

---

## Server Boost

The API automatically calculates Boost progression.

</div>

* Current Level
* Level Icon
* Boost Date
* Next Level
* Next Level Date
* Boost Progression

<div align="center">

---

## Badges

The API returns the badges available on the user's profile.

</div>

Each badge can contain:

* ID
* Description
* Icon Hash
* Icon URL

<div align="center">

---

## Clan Identity

If the user has a Clan Identity, the API can return:

</div>

* Guild ID
* Guild Name
* Tag
* Badge
* Badge URL
* Identity State

<div align="center">

---

## Connected Accounts

The API also returns connected accounts available on the user's profile.

</div>

* GitHub
* Steam
* Xbox
* Spotify
* Twitch
* Reddit
* Twitter/X

<div align="center">

Additional account types supported by Discord may also be returned.

---

## Voice

The voice system works independently from the connection status system.

When the user is connected to a voice channel, the API can identify:

</div>

* Channel
* Channel ID
* Channel Name
* Participant Count
* Whether the User Is Alone
* Connected Participants
* Mute State
* Deaf State
* Server Mute
* Server Deaf
* Streaming
* Camera

<div align="center">

---

# Cache System

The API includes an internal caching system to prevent unnecessary repeated requests to Discord.

### Benefits

</div>

* Faster responses
* Lower API usage
* Fewer requests
* Reduced possibility of reaching rate limits

<div align="center">

---

# Environment Variables

All sensitive information is stored inside the `.env` file.

</div>

```env
VITE_DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN
DISCORD_USER_TOKEN=YOUR_USER_TOKEN
VITE_DISCORD_ID=USER_ID
VITE_DISCORD_SERVER_ID=SERVER_ID
```

<div align="center">

---

# What Does Each Variable Do?

## VITE_DISCORD_BOT_TOKEN

Token used by Discord.js to retrieve the information required by the API.

</div>

* Presence
* Activities
* Guild
* Member
* Status
* Voice State

<div align="center">

---

## DISCORD_USER_TOKEN

Token used to access additional profile information provided by Discord's profile endpoint.

</div>

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

<div align="center">

---

## VITE_DISCORD_ID

Defines the default user used when no ID is provided in the API route.

---

## VITE_DISCORD_SERVER_ID

Defines the server used by Discord.js to retrieve information related to:

</div>

* Presence
* Activities
* Connection Status
* Voice State
* Boost
* Member

<div align="center">

---

# 🦇 Getting Started

Install the dependencies:

</div>

```bash
npm install
```

<div align="center">

Configure your `.env` file.

Then start the development server:

</div>

```bash
npm run dev
```

<div align="center">

The API will be available at:

</div>

```text
http://localhost:3001
```

<div align="center">

---

# Preview

The API returns all profile information organized into a single JSON response.

The main response structure is divided into:

</div>

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
```

<div align="center">

---

# Features

<table>
<tr>
<td width="50%" valign="top">

### Profile

* Full Profile
* Avatar
* Banner
* Avatar Decoration
* Bio
* Pronouns
* Theme Colors

</td>
<td width="50%" valign="top">

### Presence

* Presence
* Status
* Connection Status
* Activities
* Rich Presence
* Spotify
* VS Code

</td>
</tr>

<tr>
<td width="50%" valign="top">

### Discord

* Discord Web
* Discord Desktop
* Discord Mobile
* Discord Embedded
* Discord VR
* Nitro
* Server Boost
* Badges
* HypeSquad

</td>
<td width="50%" valign="top">

### Account

* Connected Accounts
* Clan Identity
* Voice State
* Voice Participants
* Cache

</td>
</tr>

<tr>
<td width="50%" valign="top">

### Technology

* TypeScript
* Express
* Discord.js

</td>
<td width="50%" valign="top">

### API

* Real-time Profile Data
* Discord Presence Data
* Activity Detection
* Voice State Detection
* Badge Detection
* Cached Responses

</td>
</tr>
</table>

---

# 🦇 Built with TypeScript

A modern API built with **Node.js + Express + TypeScript**, focused on providing complete Discord profile information through a single endpoint.

### Organized • Typed • Fast • Complete

</div>
```
