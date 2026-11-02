import { NextRequest } from "next/server";
import payload from "@/lib/payload";
import { isAdmin } from "@/collections/defaultAccess";
import {
  CODE_TTL,
  GRANTS,
  ISSUER,
  checkCsrf,
  cleanupGrants,
  csrfToken,
  decodeClient,
  escapeHtml,
  hashToken,
  isAllowedResource,
  newToken,
  redirectMatches,
} from "@/lib/oauth";

const PARAMS = ["response_type", "client_id", "redirect_uri", "state", "scope", "code_challenge", "code_challenge_method", "resource"];
const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
};

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;background:#f4f6f8;margin:0;display:grid;place-items:center;min-height:100vh;color:#1a2433}
main{background:#fff;max-width:420px;width:calc(100% - 32px);padding:28px;border-radius:16px;box-shadow:0 4px 24px #0001}
h1{font-size:20px;margin:0 0 12px}p,li{line-height:1.5;font-size:15px}ul{padding-inline-start:20px}.ar{direction:rtl;color:#4a5568}
.row{display:flex;gap:12px;margin-top:20px}button{flex:1;padding:12px;border-radius:10px;border:1px solid #cbd5e0;font-size:15px;cursor:pointer;background:#fff}
button[value=allow]{background:#0b4f9c;color:#fff;border-color:#0b4f9c}small{color:#718096}</style></head><body><main>${body}</main></body></html>`,
    { status, headers: { ...SECURITY_HEADERS, "Content-Type": "text/html; charset=utf-8" } },
  );

const errorPage = (message: string, status = 400) =>
  page("Authorization error", `<h1>Can't connect</h1><p>${escapeHtml(message)}</p>`, status);

const redirectTo = (uri: string, params: Record<string, string | undefined>, status = 302) => {
  const url = new URL(uri);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  url.searchParams.set("iss", ISSUER);
  return new Response(null, { status, headers: { ...SECURITY_HEADERS, Location: url.href } });
};

// Validates the request. Errors before the redirect URI is trusted are shown here; later ones go back to the client.
const validate = (p: Record<string, string>) => {
  const client = decodeClient(p.client_id);
  if (!client) return { error: errorPage("Unknown app (invalid client_id). Remove the connector and add it again.") };
  const redirectUri = p.redirect_uri || (client.redirectUris.length === 1 ? client.redirectUris[0] : "");
  if (!client.redirectUris.some((r) => redirectMatches(r, redirectUri))) {
    return { error: errorPage("The redirect address doesn't match this app's registration.") };
  }
  const fail = (error: string, description: string) => ({
    error: redirectTo(redirectUri, { error, error_description: description, state: p.state }),
  });
  if (p.response_type !== "code") return fail("unsupported_response_type", "response_type must be code");
  if (!p.code_challenge || p.code_challenge_method !== "S256") return fail("invalid_request", "PKCE S256 is required");
  if (!/^[A-Za-z0-9_-]{43}$/.test(p.code_challenge)) return fail("invalid_request", "invalid code_challenge");
  if (!isAllowedResource(p.resource || null)) return fail("invalid_target", "unknown resource");
  return { client, redirectUri };
};

const readParams = (source: URLSearchParams | FormData) =>
  Object.fromEntries(PARAMS.map((k) => [k, String(source.get(k) ?? "")]));

export async function GET(req: NextRequest) {
  const p = readParams(req.nextUrl.searchParams);
  const v = validate(p);
  if ("error" in v) return v.error;

  const { user } = await payload.auth({ headers: req.headers });
  if (!user) {
    const back = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    return new Response(null, {
      status: 302,
      headers: { ...SECURITY_HEADERS, Location: `/admin/login?redirect=${encodeURIComponent(back)}` },
    });
  }
  if (!isAdmin(user)) return errorPage("Only admin accounts can connect apps to the website.", 403);

  const who = escapeHtml(String(("email" in user && user.email) || ("username" in user && user.username) || user.id));
  const hidden = Object.entries({ ...p, redirect_uri: v.redirectUri, csrf: csrfToken(user.id, p.client_id, v.redirectUri, p.code_challenge) })
    .map(([k, val]) => `<input type="hidden" name="${k}" value="${escapeHtml(val)}">`)
    .join("");

  return page(
    "Connect to ATSNEE",
    `<h1>Allow <b>${escapeHtml(v.client.name)}</b> to manage the ATSNEE website?</h1>
<p class="ar">السماح لـ <b>${escapeHtml(v.client.name)}</b> بإدارة محتوى موقع المدرسة؟</p>
<p>Signed in as <b>${who}</b>. It will be able to:</p>
<ul><li>read and create/edit announcements, activities and categories</li><li>edit pages and site settings (admission, contacts, footer)</li><li>it can't delete anything or manage users</li></ul>
<small>Sends you back to ${escapeHtml(new URL(v.redirectUri).host)}</small>
<form method="post">${hidden}<div class="row"><button name="decision" value="deny">Deny · رفض</button><button name="decision" value="allow">Allow · سماح</button></div></form>`,
  );
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(ISSUER).origin) return errorPage("Cross-site request blocked.", 403);

  const form = await req.formData().catch(() => null);
  if (!form) return errorPage("Bad request.");
  const p = readParams(form);
  const v = validate(p);
  if ("error" in v) return v.error;

  const { user } = await payload.auth({ headers: req.headers });
  if (!user || !isAdmin(user)) return errorPage("Your session ended. Sign in to the admin and try again.", 403);
  if (!checkCsrf(form.get("csrf"), user.id, p.client_id, v.redirectUri, p.code_challenge)) {
    return errorPage("This form expired. Start the connection again from the app.", 403);
  }
  if (form.get("decision") !== "allow") {
    return redirectTo(v.redirectUri, { error: "access_denied", state: p.state }, 303);
  }

  const code = newToken("cod");
  await cleanupGrants(payload);
  await payload.create({
    collection: GRANTS,
    data: {
      clientName: v.client.name,
      user: user.id,
      clientId: p.client_id,
      redirectUri: v.redirectUri,
      codeHash: hashToken(code),
      codeChallenge: p.code_challenge,
      codeExpiresAt: new Date(Date.now() + CODE_TTL).toISOString(),
    },
  });
  return redirectTo(v.redirectUri, { code, state: p.state }, 303);
}
