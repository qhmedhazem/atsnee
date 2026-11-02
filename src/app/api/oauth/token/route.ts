import { NextRequest } from "next/server";
import payload from "@/lib/payload";
import { checkClientSecret, decodeClient, grants, hashToken, issueTokens, oauthJson, preflight, redirectMatches, verifyPkce } from "@/lib/oauth";

const fail = (error: string, status = 400) => oauthJson({ error }, status);

const readBody = async (req: NextRequest): Promise<Record<string, string>> => {
  if (req.headers.get("content-type")?.includes("application/json")) {
    const json = await req.json().catch(() => ({}));
    return Object.fromEntries(Object.entries(json ?? {}).map(([k, v]) => [k, String(v)]));
  }
  const text = await req.text().catch(() => "");
  return Object.fromEntries(new URLSearchParams(text));
};

// client_secret_basic (Authorization: Basic) or client_secret_post / public client_id in the body.
const readClient = (req: NextRequest, body: Record<string, string>) => {
  const basic = req.headers.get("authorization")?.match(/^Basic\s+(.+)$/i)?.[1];
  if (basic) {
    const [id, secret] = Buffer.from(basic, "base64").toString().split(":").map(decodeURIComponent);
    return { clientId: id, secret };
  }
  return { clientId: body.client_id, secret: body.client_secret ?? null };
};

export async function POST(req: NextRequest) {
  const body = await readBody(req);
  const { clientId, secret } = readClient(req, body);
  const client = decodeClient(clientId);
  if (!client || (client.confidential && !checkClientSecret(clientId, secret))) return fail("invalid_client", 401);
  const model = grants(payload);
  const now = new Date();

  if (body.grant_type === "authorization_code") {
    if (!body.code || !body.code_verifier) return fail("invalid_request");
    const codeHash = hashToken(body.code);
    // Single use: atomically flag the code; a second use revokes everything issued from it (RFC 6749 §4.1.2).
    const grant = await model.findOneAndUpdate({ codeHash, codeUsed: { $ne: true } }, { $set: { codeUsed: true } }).lean();
    if (!grant) {
      await model.deleteOne({ codeHash, codeUsed: true });
      return fail("invalid_grant");
    }
    const ok =
      grant.codeExpiresAt! > now &&
      grant.clientId === clientId &&
      redirectMatches(grant.redirectUri, body.redirect_uri ?? "") &&
      verifyPkce(body.code_verifier, grant.codeChallenge ?? "");
    if (!ok) {
      await model.deleteOne({ _id: grant._id });
      return fail("invalid_grant");
    }
    return oauthJson(await issueTokens(payload, grant._id));
  }

  if (body.grant_type === "refresh_token") {
    if (!body.refresh_token) return fail("invalid_request");
    const refreshHash = hashToken(body.refresh_token);
    // Rotation: claim the token atomically so two concurrent refreshes can't both win.
    const grant = await model
      .findOneAndUpdate({ refreshHash, refreshExpiresAt: { $gt: now } }, { $set: { refreshHash: null } })
      .lean();
    if (!grant) {
      // An old (already rotated) refresh token means it leaked: disconnect the app.
      await model.deleteOne({ prevRefreshHash: refreshHash });
      return fail("invalid_grant");
    }
    if (grant.clientId !== clientId) {
      await model.deleteOne({ _id: grant._id });
      return fail("invalid_grant");
    }
    return oauthJson(await issueTokens(payload, grant._id, body.refresh_token));
  }

  return fail("unsupported_grant_type");
}

export const OPTIONS = preflight;
