import crypto from "crypto";
import type { Payload } from "payload";
import { getServerSideURL } from "./getURL";

// OAuth 2.1 authorization server for the MCP endpoint (/api/mcp), so Claude (web, desktop, phone) can connect
// with the admin's own login instead of a pasted API key. Clients are stateless (signed client_id, RFC 7591
// dynamic registration); grants live in the `oauth-grants` collection (delete one there to disconnect an app).

export const ISSUER = getServerSideURL().replace(/\/+$/, "");
export const MCP_RESOURCE = `${ISSUER}/api/mcp`;
export const RESOURCE_METADATA_URL = `${ISSUER}/.well-known/oauth-protected-resource`;
export const GRANTS = "oauth-grants";
export const SCOPE = "mcp";

export const CODE_TTL = 10 * 60_000;
export const ACCESS_TTL = 60 * 60_000;
export const REFRESH_TTL = 60 * 24 * 60 * 60_000;

const secret = () => {
  const s = process.env.PAYLOAD_SECRET;
  if (!s) throw new Error("PAYLOAD_SECRET is required for OAuth");
  return s;
};
const hmac = (value: string) => crypto.createHmac("sha256", secret()).update(value).digest("base64url");
const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export const hashToken = (token: string) => hmac(`token:${token}`);
export const newToken = (prefix: string) => `${prefix}_${crypto.randomBytes(32).toString("base64url")}`;

export const verifyPkce = (verifier: string, challenge: string) =>
  /^[A-Za-z0-9\-._~]{43,128}$/.test(verifier) &&
  safeEqual(crypto.createHash("sha256").update(verifier).digest("base64url"), challenge);

// Any https redirect (Claude, ChatGPT, Gemini, DeepSeek...), or plain http to this machine for native apps
// (Claude Code, Gemini CLI). The consent page shows where it sends you, and only an admin can allow it.
const LOOPBACK = ["localhost", "127.0.0.1", "[::1]"];
export const isAllowedRedirect = (uri: string) => {
  try {
    const u = new URL(uri);
    if (u.hash || u.username || u.password) return false;
    if (u.protocol === "https:") return true;
    return u.protocol === "http:" && LOOPBACK.includes(u.hostname);
  } catch {
    return false;
  }
};
// RFC 8252 §7.3: loopback redirects may use any port.
export const redirectMatches = (registered: string, given: string) => {
  if (registered === given) return true;
  try {
    const a = new URL(registered);
    const b = new URL(given);
    if (!LOOPBACK.includes(a.hostname)) return false;
    a.port = b.port = "";
    return a.href === b.href;
  } catch {
    return false;
  }
};

export type Client = { name: string; redirectUris: string[]; confidential: boolean };

export const encodeClient = (c: Client) => {
  const body = Buffer.from(JSON.stringify({ n: c.name, r: c.redirectUris, c: c.confidential ? 1 : 0 })).toString(
    "base64url",
  );
  return `${body}.${hmac(`client:${body}`)}`;
};
export const decodeClient = (clientId: unknown): Client | null => {
  if (typeof clientId !== "string" || clientId.length > 4000) return null;
  const [body, sig] = clientId.split(".");
  if (!body || !sig || !safeEqual(sig, hmac(`client:${body}`))) return null;
  try {
    const { n, r, c } = JSON.parse(Buffer.from(body, "base64url").toString());
    return { name: String(n), redirectUris: r, confidential: c === 1 };
  } catch {
    return null;
  }
};
export const clientSecret = (clientId: string) => hmac(`client-secret:${clientId}`);
export const checkClientSecret = (clientId: string, given: string | null) =>
  !!given && safeEqual(given, clientSecret(clientId));

// The consent form is only valid for this user + this exact request (stateless CSRF token).
export const csrfToken = (userId: string | number, clientId: string, redirectUri: string, challenge: string) =>
  hmac(`csrf:${userId}:${clientId}:${redirectUri}:${challenge}`);
export const checkCsrf = (given: unknown, ...args: Parameters<typeof csrfToken>) =>
  typeof given === "string" && safeEqual(given, csrfToken(...args));

export const isAllowedResource = (resource: string | null) =>
  !resource || [ISSUER, MCP_RESOURCE].includes(resource.replace(/\/+$/, ""));

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

// Token endpoint, registration and metadata are called from servers or other origins and never use cookies.
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, MCP-Protocol-Version",
};
export const oauthJson = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { ...CORS, "Cache-Control": "no-store", Pragma: "no-cache" } });
export const preflight = () => new Response(null, { status: 204, headers: CORS });

// Atomic operations need the raw Mongo model (Payload's update-by-where is find-then-update).
type GrantDoc = {
  _id: unknown;
  user: unknown;
  clientId: string;
  redirectUri: string;
  codeChallenge?: string;
  codeExpiresAt?: Date;
  accessExpiresAt?: Date;
  refreshExpiresAt?: Date;
};
type GrantModel = {
  findOneAndUpdate: (filter: object, update: object, opts?: object) => { lean: () => Promise<GrantDoc | null> };
  findOne: (filter: object) => { lean: () => Promise<GrantDoc | null> };
  updateOne: (filter: object, update: object) => Promise<unknown>;
  deleteOne: (filter: object) => Promise<unknown>;
  deleteMany: (filter: object) => Promise<unknown>;
};
export const grants = (payload: Payload) =>
  (payload.db as unknown as { collections: Record<string, GrantModel> }).collections[GRANTS];

export const issueTokens = async (payload: Payload, id: unknown, previousRefresh?: string) => {
  const access = newToken("atk");
  const refresh = newToken("rtk");
  const now = Date.now();
  await grants(payload).updateOne(
    { _id: id },
    {
      $set: {
        accessHash: hashToken(access),
        accessExpiresAt: new Date(now + ACCESS_TTL),
        refreshHash: hashToken(refresh),
        refreshExpiresAt: new Date(now + REFRESH_TTL),
        ...(previousRefresh ? { prevRefreshHash: hashToken(previousRefresh) } : {}),
        lastUsedAt: new Date(now),
      },
    },
  );
  return {
    access_token: access,
    token_type: "Bearer",
    expires_in: ACCESS_TTL / 1000,
    refresh_token: refresh,
    scope: SCOPE,
  };
};

// Returns the grant's user id for a live access token, or null.
export const userIdForAccessToken = async (payload: Payload, token: string) => {
  const grant = await grants(payload)
    .findOneAndUpdate(
      { accessHash: hashToken(token), accessExpiresAt: { $gt: new Date() } },
      { $set: { lastUsedAt: new Date() } },
    )
    .lean();
  return grant ? String(grant.user) : null;
};

export const cleanupGrants = (payload: Payload) => {
  const now = new Date();
  return grants(payload).deleteMany({
    $or: [{ accessHash: null, codeExpiresAt: { $lt: now } }, { refreshExpiresAt: { $lt: now } }],
  });
};
