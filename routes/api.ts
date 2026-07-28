import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import { Client, GatewayIntentBits, ActivityType } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const DISCORD_BOT_TOKEN = process.env.VITE_DISCORD_BOT_TOKEN;
const DISCORD_USER_TOKEN = process.env.DISCORD_USER_TOKEN;
const DISCORD_USER_ID = process.env.VITE_DISCORD_ID;
const SERVER_ID = process.env.VITE_DISCORD_SERVER_ID || "1078804725916516392";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
  ]
});

if (DISCORD_BOT_TOKEN) {
  client.login(DISCORD_BOT_TOKEN).catch(() => { });
}

const lastSpotifyCache = new Map<string, any>();

interface BadgeRange {
  badge: string;
  lowerLimit: number;
  upperLimit?: number;
}

const NITRO_RANGES: BadgeRange[] = [
  { badge: "nitro", lowerLimit: 0, upperLimit: 0 },
  { badge: "nitro_bronze", lowerLimit: 1, upperLimit: 2 },
  { badge: "nitro_silver", lowerLimit: 3, upperLimit: 5 },
  { badge: "nitro_gold", lowerLimit: 6, upperLimit: 11 },
  { badge: "nitro_platinum", lowerLimit: 12, upperLimit: 23 },
  { badge: "nitro_diamond", lowerLimit: 24, upperLimit: 35 },
  { badge: "nitro_emerald", lowerLimit: 36, upperLimit: 59 },
  { badge: "nitro_ruby", lowerLimit: 60, upperLimit: 71 },
  { badge: "nitro_fire", lowerLimit: 72 },
];

const BOOST_RANGES: BadgeRange[] = [
  { badge: "guild_booster_lvl1", lowerLimit: 0, upperLimit: 1 },
  { badge: "guild_booster_lvl2", lowerLimit: 2, upperLimit: 2 },
  { badge: "guild_booster_lvl3", lowerLimit: 3, upperLimit: 5 },
  { badge: "guild_booster_lvl4", lowerLimit: 6, upperLimit: 8 },
  { badge: "guild_booster_lvl5", lowerLimit: 9, upperLimit: 11 },
  { badge: "guild_booster_lvl6", lowerLimit: 12, upperLimit: 14 },
  { badge: "guild_booster_lvl7", lowerLimit: 15, upperLimit: 17 },
  { badge: "guild_booster_lvl8", lowerLimit: 18, upperLimit: 23 },
  { badge: "guild_booster_lvl9", lowerLimit: 24 },
];

const HYPE_SQUAD_MAP: Record<number, string> = {
  1: "Bravery",
  2: "Brilliance",
  4: "Balance",
};

const STATUS_DETAILS_MAP: Record<string, { name: string; color: string }> = {
  online: { name: "Online", color: "#43b581" },
  idle: { name: "Ausente", color: "#faa61a" },
  dnd: { name: "Não Perturbe", color: "#f04747" },
  offline: { name: "Invisível", color: "#747f8d" }
};

function buildBadgeUrl(iconHash: string | null | undefined): string | null {
  if (!iconHash) return null;
  if (iconHash.startsWith("http://") || iconHash.startsWith("https://")) {
    return iconHash;
  }
  return `https://cdn.discordapp.com/badge-icons/${iconHash}.png`;
}

class CacheService {
  private static cache: Map<string, { data: any; expiry: number }> = new Map();

  static set(key: string, data: any, ttlMs: number): void {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { data, expiry });
  }

  static get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
}

class DiscordProfileService {
  static async fetchProfile(userId: string): Promise<any> {
    const cacheKey = `profile_${userId}`;
    const cached = CacheService.get(cacheKey);
    if (cached) return cached;

    const authHeader = DISCORD_USER_TOKEN ? DISCORD_USER_TOKEN : `Bot ${DISCORD_BOT_TOKEN}`;
    if (!authHeader) return null;

    try {
      const response = await fetch(`https://discord.com/api/v10/users/${userId}/profile`, {
        headers: { Authorization: authHeader }
      });

      if (response.ok) {
        const data = await response.json();
        CacheService.set(cacheKey, data, 1000 * 60 * 5);
        return data;
      }
    } catch { }

    return null;
  }
}

class BadgeAssetProvider {
  private static assetMap: Map<string, string> = new Map();
  private static lastFetchTime: number = 0;
  private static CACHE_TTL = 1000 * 60 * 60 * 6;

  static async fetchAndUpdateCatalog(): Promise<void> {
    const now = Date.now();
    if (this.assetMap.size > 0 && now - this.lastFetchTime < this.CACHE_TTL) {
      return;
    }

    try {
      const response = await fetch("https://discord-api-types.dev/api/discord-api-types-v10");
      if (response.ok) {
        this.lastFetchTime = now;
      }
    } catch { }
  }

  static async getAssetHash(badgeKey: string): Promise<string | null> {
    await this.fetchAndUpdateCatalog();
    return this.assetMap.get(badgeKey) || null;
  }

  static registerBadge(badgeKey: string, hash: string) {
    if (badgeKey && hash) {
      this.assetMap.set(badgeKey, hash);
    }
  }
}

class BadgeManager {
  private static findRange(ranges: BadgeRange[], months: number): BadgeRange | undefined {
    return ranges.find((item) => {
      const inLower = months >= item.lowerLimit;
      const inUpper = typeof item.upperLimit === "undefined" || months <= item.upperLimit;
      return inLower && inUpper;
    });
  }

  static extractHash(badge: any): string | null {
    if (!badge) return null;
    let hash = badge.icon || badge.icon_hash || badge.hash || null;
    if (!hash && badge.icon_url) {
      const match = badge.icon_url.match(/\/badge-icons\/([a-fA-F0-9]+)\.png/);
      if (match) hash = match[1];
    }
    return hash;
  }

  static async getCurrentNitro(months: number, nitroSinceDate: dayjs.Dayjs | null, response: any) {
    if (!nitroSinceDate) return { badge: null, icon_url: null, currentBadgeDate: null };

    const range = this.findRange(NITRO_RANGES, months);
    const rawBadges = response?.badges || response?.user_profile?.badges || [];
    const foundBadge = rawBadges.find((b: any) => {
      const id = String(b.id || b.key || "").toLowerCase();
      return id.includes("premium") || id.includes("nitro");
    });

    let hash = this.extractHash(foundBadge);
    if (!hash && range) {
      hash = await BadgeAssetProvider.getAssetHash(range.badge);
    }
    if (range && hash) {
      BadgeAssetProvider.registerBadge(range.badge, hash);
    }

    return {
      badge: range?.badge || foundBadge?.id || null,
      icon_url: buildBadgeUrl(hash) || foundBadge?.icon_url || null,
      currentBadgeDate: nitroSinceDate
    };
  }

  static async getNextNitro(months: number, nitroSinceDate: dayjs.Dayjs | null, response: any) {
    if (!nitroSinceDate) return { badge: null, nextBadgeDate: null };

    for (let i = 0; i < NITRO_RANGES.length; i++) {
      const item = NITRO_RANGES[i];
      const inUpper = typeof item.upperLimit === "undefined" || months <= item.upperLimit;
      if (months >= item.lowerLimit && inUpper) {
        const nextItem = NITRO_RANGES[i + 1];
        if (nextItem) {
          const nextBadgeDate = nitroSinceDate.add(nextItem.lowerLimit, "months");
          return {
            badge: nextItem.badge,
            nextBadgeDate
          };
        }
        return { badge: "max_badge", nextBadgeDate: null };
      }
    }
    return { badge: null, nextBadgeDate: null };
  }

  static async getCurrentBoost(months: number, hasBoost: boolean, response: any) {
    if (!hasBoost) return { level: null, icon_url: null };

    const range = this.findRange(BOOST_RANGES, months);
    const rawBadges = response?.badges || response?.user_profile?.badges || [];
    const foundBadge = rawBadges.find((b: any) => {
      const id = String(b.id || b.key || "").toLowerCase();
      return id.includes("booster") || id.includes("guild_booster");
    });

    let hash = this.extractHash(foundBadge);
    if (!hash && range) {
      hash = await BadgeAssetProvider.getAssetHash(range.badge);
    }
    if (range && hash) {
      BadgeAssetProvider.registerBadge(range.badge, hash);
    }

    return {
      level: range?.badge || foundBadge?.id || null,
      icon_url: buildBadgeUrl(hash) || foundBadge?.icon_url || null
    };
  }

  static async getNextBoost(months: number, hasBoost: boolean, response: any) {
    if (!hasBoost) return { level: null };

    for (let i = 0; i < BOOST_RANGES.length; i++) {
      const item = BOOST_RANGES[i];
      const inUpper = typeof item.upperLimit === "undefined" || months <= item.upperLimit;
      if (months >= item.lowerLimit && inUpper) {
        const nextItem = BOOST_RANGES[i + 1];
        if (nextItem) {
          return {
            level: nextItem.badge
          };
        }
        return { level: "max_level" };
      }
    }
    return { level: null };
  }
}

async function getUserBadges(response: any) {
  const rawBadges = response?.badges || response?.user_profile?.badges || [];
  if (Array.isArray(rawBadges) && rawBadges.length > 0) {
    return rawBadges.map((badge: any) => {
      let hash = BadgeManager.extractHash(badge);
      const badgeId = badge.id || badge.key;
      if (badgeId && hash) {
        BadgeAssetProvider.registerBadge(badgeId, hash);
      }
      return {
        id: badgeId,
        description: badge.description || null,
        icon_hash: hash,
        icon_url: buildBadgeUrl(hash) || badge.icon_url || null,
      };
    });
  }
  return [];
}

async function getUserActivity(userId: string) {
  try {
    const guild = await client.guilds.fetch(SERVER_ID);
    const member = await guild.members.fetch({ user: userId, withPresences: true });
    const presence = member.presence;

    const activitiesList: any[] = [];
    let foundSpotify = false;

    if (presence && presence.activities) {
      for (const activity of presence.activities) {
        if (!activity) continue;

        const appId = activity.applicationId;
        const largeAssetId = activity.assets?.largeImage;
        const smallAssetId = activity.assets?.smallImage;

        const getAssetUrl = (id: string | undefined | null) => {
          if (!id) return null;
          if (id.startsWith('spotify:')) return null;
          if (id.startsWith('mp:external/')) {
            return `https://media.discordapp.net/${id.replace('mp:external/', '')}`;
          }
          if (appId) {
            return `https://cdn.discordapp.com/app-assets/${appId}/${id}.png`;
          }
          return null;
        };

        const start = activity.timestamps?.start ? new Date(activity.timestamps.start).getTime() : null;
        const end = activity.timestamps?.end ? new Date(activity.timestamps.end).getTime() : null;

        let activityInfo: any = {};

        switch (activity.type) {
          case ActivityType.Playing: {
            const isActivity = activity.name.includes("Visual Studio Code") || appId === "635032049339316224";

            if (isActivity) {
              activityInfo = {
                type: "Activity",
                name: activity.name,
                pasta_workspace: activity.details || null,
                linguagem_status: activity.state || null,
                startTimestamp: start,
                endTimestamp: end,
                largeImage_url: getAssetUrl(largeAssetId),
                largeText: activity.assets?.largeText || null,
                smallImage_url: getAssetUrl(smallAssetId),
                smallText: activity.assets?.smallText || null,
              };
            } else {
              activityInfo = {
                type: "Playing",
                name: activity.name,
                details: activity.details || null,
                state: activity.state || null,
                startTimestamp: start,
                endTimestamp: end,
                largeImage_url: getAssetUrl(largeAssetId),
                largeText: activity.assets?.largeText || null,
                smallImage_url: getAssetUrl(smallAssetId),
                smallText: activity.assets?.smallText || null,
                applicationId: appId || null,
              };
            }
            break;
          }

          case ActivityType.Listening: {
            if (activity.name === "Spotify") {
              foundSpotify = true;
              const spotifyAssetIdCleaned = largeAssetId?.startsWith('spotify:') ? largeAssetId.replace("spotify:", "") : largeAssetId;
              const spotifyAlbumArtUrl = spotifyAssetIdCleaned
                ? `https://i.scdn.co/image/${spotifyAssetIdCleaned}`
                : null;

              let artists: string[] | null = null;
              if (activity.state) {
                if (activity.state.includes('; ')) {
                  artists = activity.state.split('; ').map((a: string) => a.trim());
                } else if (activity.state.includes(', ')) {
                  artists = activity.state.split(', ').map((a: string) => a.trim());
                } else {
                  artists = [activity.state.trim()];
                }
              }

              activityInfo = {
                type: "Spotify",
                musica: activity.details || null,
                artista: artists,
                album: activity.assets?.largeText || null,
                albumArtUrl: spotifyAlbumArtUrl,
                startTimestamp: start,
                endTimestamp: end,
                isPaused: false,
              };

              lastSpotifyCache.set(userId, activityInfo);
            } else {
              activityInfo = {
                type: "Ouvindo",
                name: activity.name,
                details: activity.details || null,
                startTimestamp: start,
                endTimestamp: end,
                largeImage_url: getAssetUrl(largeAssetId),
                largeText: activity.assets?.largeText || null,
                smallImage_url: getAssetUrl(smallAssetId),
                smallText: activity.assets?.smallText || null,
              };
            }
            break;
          }

          case ActivityType.Streaming: {
            activityInfo = {
              type: "Streaming",
              name: activity.name,
              details: activity.details || null,
              url: activity.url || null,
              startTimestamp: start,
              endTimestamp: end,
              largeImage_url: getAssetUrl(largeAssetId),
              largeText: activity.assets?.largeText || null,
              smallImage_url: getAssetUrl(smallAssetId),
              smallText: activity.assets?.smallText || null,
            };
            break;
          }

          case ActivityType.Custom: {
            activityInfo = {
              type: "Status Custom",
              state: activity.state || null,
              emoji: activity.emoji?.name || null,
            };
            break;
          }

          default: {
            activityInfo = {
              type: activity.type,
              name: activity.name,
              details: activity.details || null,
              startTimestamp: start,
              endTimestamp: end,
              largeImage_url: getAssetUrl(largeAssetId),
              largeText: activity.assets?.largeText || null,
              smallImage_url: getAssetUrl(smallAssetId),
              smallText: activity.assets?.smallText || null,
            };
          }
        }

        if (Object.keys(activityInfo).length > 0) {
          activitiesList.push(activityInfo);
        }
      }
    }
    if (!foundSpotify && lastSpotifyCache.has(userId)) {
      const cachedSpotify = lastSpotifyCache.get(userId);
      activitiesList.push({
        ...cachedSpotify,
        isPaused: true
      });
    }

    return activitiesList;
  } catch (error) {
    return [];
  }
}

async function getUserStatus(userId: string) {
  try {
    const guild = await client.guilds.fetch(SERVER_ID);
    const member = await guild.members.fetch({ user: userId, withPresences: true });
    return member.presence?.status || 'offline';
  } catch {
    return 'offline';
  }
}

async function getGuildName(guildId: string) {
  if (!guildId) return null;
  try {
    const guild = await client.guilds.fetch(guildId);
    return guild.name;
  } catch {
    return null;
  }
}

async function getUserResponse(response: any) {
  const userSource = response?.user ? response.user : response;

  let bannerUrl: string | null = null;
  if (response?.user_profile?.banner) {
    const extension = response.user_profile.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
    bannerUrl = `https://cdn.discordapp.com/banners/${userSource.id}/${response.user_profile.banner}${extension}`;
  }

  let target: any;
  let memberInstance: any = null;
  try {
    target = await client.users.fetch(userSource.id);
    const guild = await client.guilds.fetch(SERVER_ID);
    memberInstance = await guild.members.fetch(userSource.id).catch(() => null);
  } catch (e) {
    target = userSource;
  }

  const flagsValue = target?.flags?.bitfield || target?.flags || userSource?.flags || 0;
  const hasPremiumFlag = (flagsValue & (1 << 0)) !== 0 || (flagsValue & (1 << 2)) !== 0 || (flagsValue & (1 << 14)) !== 0;

  const premiumGuildSince = memberInstance?.premiumSince ? dayjs(memberInstance.premiumSince) : null;
  const rawPremiumSince = response?.premium_since ? dayjs(response.premium_since) : null;
  const rawPremiumGuildSince = premiumGuildSince || (response?.premium_guild_since ? dayjs(response.premium_guild_since) : null);

  const nitroSinceDate = rawPremiumSince || rawPremiumGuildSince || (hasPremiumFlag ? dayjs(userSource.createdAt || target.createdAt) : null);
  const premiumSinceDate = rawPremiumGuildSince;

  const monthsVerification = ["0", "2", "3", "6", "9", "12", "15", "18", "24"];
  const currentDate = dayjs();
  const monthsPassedNitro = nitroSinceDate ? currentDate.diff(nitroSinceDate, "month") : 0;
  const monthsPassedBoost = premiumSinceDate ? currentDate.diff(premiumSinceDate, "month") : 0;

  const exactMonths = monthsVerification
    .map((months) => {
      if (!premiumSinceDate) return;
      const targetDate = premiumSinceDate.add(parseInt(months), "months");
      if (currentDate.isBefore(targetDate)) return targetDate.format();
    })
    .filter((date) => date !== null && date !== undefined);

  const hasBoost = !!premiumSinceDate;

  await getUserBadges(response);

  const currentBoostData = await BadgeManager.getCurrentBoost(monthsPassedBoost, hasBoost, response);
  const nextBoostData = await BadgeManager.getNextBoost(monthsPassedBoost, hasBoost, response);
  const nextDate = hasBoost ? exactMonths.find((date) => currentDate.isBefore(date)) : null;

  const currentNitroBadgeData = await BadgeManager.getCurrentNitro(monthsPassedNitro, nitroSinceDate, response);
  const nextNitroBadgeData = await BadgeManager.getNextNitro(monthsPassedNitro, nitroSinceDate, response);
  const badges = await getUserBadges(response);

  const theme_colors = response?.user_profile?.theme_colors;
  const colorsArray = Object.values(theme_colors || {}).map((color: any) => `#${color.toString(16).padStart(6, "0")}`);
  const colorsString = colorsArray.join(", ");

  const activity = await getUserActivity(userSource.id);
  const rawStatus = await getUserStatus(userSource.id);
  const statusDetails = STATUS_DETAILS_MAP[rawStatus] || STATUS_DETAILS_MAP.offline;

  const previousUsernames = response?.previous_usernames || [];
  const previousDisplayNames = response?.previous_global_names || [];

  let hypesquadHouseId = response?.user_profile?.hypesquad_house || null;

  if (!hypesquadHouseId && flagsValue) {
    if (flagsValue & (1 << 6)) hypesquadHouseId = 1;
    else if (flagsValue & (1 << 7)) hypesquadHouseId = 2;
    else if (flagsValue & (1 << 8)) hypesquadHouseId = 4;
  }

  const hypesquadHouseName = hypesquadHouseId ? HYPE_SQUAD_MAP[hypesquadHouseId] : null;

  const clanIdentitySource = response?.primary_guild || response?.clan || response?.user_profile?.primary_guild || response?.user_profile?.clan || null;
  let clanIdentityData: any = null;

  if (clanIdentitySource) {
    const guildId = clanIdentitySource.identity_guild_id || null;
    const badgeHash = clanIdentitySource.badge || null;
    const tag = clanIdentitySource.tag || null;
    const isEnabled = clanIdentitySource.identity_enabled || false;

    let guildName: string | null = null;
    if (guildId) {
      guildName = await getGuildName(guildId);
    }

    clanIdentityData = {
      tag: tag,
      guild_id: guildId,
      guild_name: guildName,
      badge_hash: badgeHash,
      badge_url: badgeHash && guildId
        ? `https://cdn.discordapp.com/guilds/${guildId}/attachments/${badgeHash}/icon.png?size=32`
        : null,
      is_enabled: isEnabled,
    };
  }

  const formattedConnectedAccounts = response?.connected_accounts?.map((account: any) => ({
    type: account.type,
    id: account.id,
    name: account.name,
    verified: account.verified,
    visibility: account.visibility,
  })) || [];

  const defaultPremiumType = response?.premium_type || (hasBoost || hasPremiumFlag ? 2 : null);

  return {
    user: {
      id: userSource.id,
      createdAt: target.createdAt || null,
      createdTimestamp: target.createdTimestamp || null,
      username: userSource.username,
      global_name: userSource.global_name || target.globalName || null,
      legacy_username: response?.legacy_username || null,
      previous_usernames: previousUsernames,
      previous_display_names: previousDisplayNames,
      discriminator: userSource.discriminator,
      flags: flagsValue,
      avatar: userSource.avatar,
      avatar_url: target.displayAvatarURL ? target.displayAvatarURL({ size: 4096, extension: "png", dynamic: true }) : `https://cdn.discordapp.com/avatars/${userSource.id}/${userSource.avatar}.png?size=4096`,
      banner: userSource.banner,
      banner_url: bannerUrl,
    },
    user_profile: {
      bio: response?.user_profile?.bio || null,
      pronouns: response?.user_profile?.pronouns || null,
      theme_colors: colorsString || null,
      hypesquad_house_id: hypesquadHouseId || null,
      hypesquad_house_name: hypesquadHouseName,
    },
    clan_identity: clanIdentityData,
    presence: {
      status: statusDetails.name.toLowerCase() === "invisível" ? "offline" : rawStatus,
      status_name: statusDetails.name,
      status_color: statusDetails.color,
      activities: activity,
    },
    nitro: {
      premium_type:
        defaultPremiumType == 1
          ? "nitro_classic"
          : defaultPremiumType == 2
            ? "nitro_boost"
            : defaultPremiumType == 3
              ? "nitro_basic"
              : null,
      premium_since: nitroSinceDate ? nitroSinceDate.format() : null,
      premium_guild_since: premiumSinceDate ? premiumSinceDate.format() : null,
      current_badge: currentNitroBadgeData?.badge || null,
      current_badge_icon_url: currentNitroBadgeData?.icon_url || null,
      current_badge_date: currentNitroBadgeData?.currentBadgeDate ? currentNitroBadgeData.currentBadgeDate.format() : null,
      next_badge: nextNitroBadgeData?.badge || null,
      next_badge_date: nextNitroBadgeData?.nextBadgeDate ? nextNitroBadgeData.nextBadgeDate.format() : null,
    },
    boost: {
      current_level: currentBoostData?.level || null,
      current_level_icon_url: currentBoostData?.icon_url || null,
      current_level_date: premiumSinceDate ? premiumSinceDate.format() : null,
      next_level: nextBoostData?.level || null,
      next_level_date: nextDate || null,
    },
    badges: badges,
    connected_accounts: formattedConnectedAccounts,
  };
}

const getDiscordProfileHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || DISCORD_USER_ID;
    if (!userId) {
      res.status(400).json({ error: "Falta o ID do usuário." });
      return;
    }

    const data = await DiscordProfileService.fetchProfile(userId);
    if (!data) {
      const fallbackUser = await client.users.fetch(userId).catch(() => null);
      if (!fallbackUser) {
        res.status(404).json({ error: "Usuário não encontrado." });
        return;
      }
      const formattedData = await getUserResponse({ user: fallbackUser });
      res.json(formattedData);
      return;
    }

    const formattedData = await getUserResponse(data);
    res.json(formattedData);
  } catch {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

app.get("/api/discord/:userId?", getDiscordProfileHandler);
app.listen(PORT, () => { });
