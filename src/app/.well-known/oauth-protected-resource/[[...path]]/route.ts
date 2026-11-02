import { ISSUER, MCP_RESOURCE, SCOPE, oauthJson, preflight } from "@/lib/oauth";

// RFC 9728, served at the root and at /.well-known/oauth-protected-resource/api/mcp.
export const GET = () =>
  oauthJson({
    resource: MCP_RESOURCE,
    authorization_servers: [ISSUER],
    scopes_supported: [SCOPE],
    bearer_methods_supported: ["header"],
    resource_name: "ATSNEE website",
  });
export const OPTIONS = preflight;
