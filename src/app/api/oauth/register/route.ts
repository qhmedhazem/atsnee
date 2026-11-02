import { NextRequest } from "next/server";
import { clientSecret, encodeClient, isAllowedRedirect, oauthJson, preflight } from "@/lib/oauth";

// RFC 7591 dynamic client registration. Stateless: the client_id carries its own signed name + redirect URIs.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const uris: unknown = body?.redirect_uris;
  if (!Array.isArray(uris) || !uris.length || uris.length > 5 || !uris.every((u) => typeof u === "string" && u.length <= 500 && isAllowedRedirect(u))) {
    return oauthJson({ error: "invalid_redirect_uri", error_description: "Only Claude or loopback redirect URIs are allowed." }, 400);
  }
  const name = String(body.client_name || "MCP client").slice(0, 100);
  const method = ["client_secret_post", "client_secret_basic"].includes(body.token_endpoint_auth_method)
    ? body.token_endpoint_auth_method
    : "none";
  const clientId = encodeClient({ name, redirectUris: uris, confidential: method !== "none" });
  return oauthJson(
    {
      client_id: clientId,
      ...(method !== "none" ? { client_secret: clientSecret(clientId), client_secret_expires_at: 0 } : {}),
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: name,
      redirect_uris: uris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: method,
    },
    201,
  );
}

export const OPTIONS = preflight;
