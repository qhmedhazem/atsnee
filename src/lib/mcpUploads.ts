import crypto from "crypto";
import dns from "dns/promises";
import net from "net";
import sharp from "sharp";
import { z } from "zod/v3";
import type { Payload } from "payload";
import { ISSUER } from "./oauth";

// Image uploads for AI assistants connected over MCP. Three ways, all saving through the Media collection (WebP,
// R2) and optionally attaching to a post or activity gallery:
//   uploadImageFromUrl  - the server downloads a public image link (Drive/Dropbox share links are converted)
//   uploadImageBase64   - the assistant sends the bytes (small images; requests are capped at ~4.5MB on Vercel)
//   createUploadLink    - a short-lived page where a person picks photos from their phone (resized in the browser)
// listUploads shows what arrived through an upload link.

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const LINK_TTL_MS = 60 * 60_000;

type Target = { type: "posts" | "activities"; id: string } | null;

// ---------- signed upload-link tokens ----------
const secret = () => {
  const s = process.env.PAYLOAD_SECRET;
  if (!s) throw new Error("PAYLOAD_SECRET is required");
  return s;
};
const sign = (body: string) => crypto.createHmac("sha256", secret()).update(`upload:${body}`).digest("base64url");

export type UploadLink = { batch: string; exp: number; target: Target };
export const createUploadToken = (target: Target) => {
  const data: UploadLink = { batch: crypto.randomBytes(9).toString("base64url"), exp: Date.now() + LINK_TTL_MS, target };
  const body = Buffer.from(JSON.stringify(data)).toString("base64url");
  return { token: `${body}.${sign(body)}`, ...data };
};
export const readUploadToken = (token: string): UploadLink | null => {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString()) as UploadLink;
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
};

// ---------- saving ----------
const slugify = (name: string) =>
  (name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "image").toLowerCase();

export async function saveImage(
  payload: Payload,
  opts: { data: Buffer; filename?: string; alt?: string; target?: Target; batch?: string },
) {
  if (opts.data.length > MAX_IMAGE_BYTES) throw new Error(`Image is larger than ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`);
  const meta = await sharp(opts.data).metadata().catch(() => null);
  if (!meta?.format || !meta.width) throw new Error("That file is not an image the server can read (JPG, PNG, WebP, GIF, AVIF).");
  const ext = meta.format === "jpeg" ? "jpg" : meta.format;
  const doc = await payload.create({
    collection: "media",
    data: { alt: opts.alt || "", uploadBatch: opts.batch } as never,
    file: { data: opts.data, name: `${slugify(opts.filename || "image")}.${ext}`, mimetype: `image/${meta.format}`, size: opts.data.length },
    // Fresh object per call: the storage plugin flags context.skipCloudStorage while saving.
    context: { disableRevalidate: true },
  });
  if (opts.target) await attach(payload, opts.target, String(doc.id));
  return doc;
}

// Appends to the gallery (and sets an empty post banner) without publishing a draft.
async function attach(payload: Payload, target: NonNullable<Target>, mediaId: string) {
  const doc = (await payload.findByID({ collection: target.type, id: target.id, depth: 0, draft: true })) as {
    gallery?: { image: unknown }[] | null;
    banner?: unknown;
    _status?: string;
  };
  const gallery = [...(doc.gallery ?? []).map((g) => ({ image: typeof g.image === "object" ? (g.image as { id: string }).id : g.image })), { image: mediaId }];
  const data: Record<string, unknown> = { gallery };
  if (target.type === "posts" && !doc.banner) data.banner = mediaId;
  await payload.update({
    collection: target.type,
    id: target.id,
    data: data as never,
    draft: doc._status === "draft",
    context: { disableRevalidate: true },
  });
}

// ---------- downloading (with SSRF protection) ----------
const privateIp = (ip: string): boolean => {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  const l = ip.toLowerCase();
  if (l.startsWith("::ffff:")) return privateIp(l.slice(7));
  return l === "::" || l === "::1" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe80");
};

// Share links that point at a viewer page instead of the file.
export const directLink = (raw: string) => {
  const drive = raw.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([\w-]+)/);
  if (drive) return `https://drive.google.com/uc?export=download&id=${drive[1]}`;
  if (/^https:\/\/(www\.)?dropbox\.com\//.test(raw)) return raw.replace(/([?&])dl=0/, "$1dl=1").replace(/^(?!.*[?&]dl=)(.*)$/, (u) => u + (u.includes("?") ? "&" : "?") + "dl=1");
  return raw;
};

// ponytail: DNS is checked before each hop, not pinned for the connection (rebinding window); fine for an
// admin-only tool, pin the resolved IP if this is ever exposed more widely.
export async function downloadImage(raw: string): Promise<Buffer> {
  let url = directLink(raw.trim());
  for (let hop = 0; hop < 5; hop++) {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("Only http(s) links are supported.");
    if (u.username || u.password) throw new Error("Links with credentials are not allowed.");
    const addrs = net.isIP(u.hostname.replace(/^\[|\]$/g, "")) ? [{ address: u.hostname.replace(/^\[|\]$/g, "") }] : await dns.lookup(u.hostname, { all: true });
    if (!addrs.length || addrs.some((a) => privateIp(a.address))) throw new Error("That address is not reachable from the server.");
    const res = await fetch(u, { redirect: "manual", headers: { "User-Agent": "ATSNEE-media-import/1.0", Accept: "image/*,*/*;q=0.8" }, signal: AbortSignal.timeout(20_000) });
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location")!, u).href;
      continue;
    }
    if (!res.ok) throw new Error(`The link answered HTTP ${res.status}.`);
    if (Number(res.headers.get("content-length") || 0) > MAX_IMAGE_BYTES) throw new Error("Image is larger than 15MB.");
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_IMAGE_BYTES) throw new Error("Image is larger than 15MB.");
    return buf;
  }
  throw new Error("Too many redirects.");
}

// ---------- MCP tools ----------
const targetSchema = {
  attachToPost: z.string().optional().describe("Post id: the image is appended to that post's gallery (and becomes its banner if it has none)."),
  attachToActivity: z.string().optional().describe("Activity id: the image is appended to that activity's gallery."),
};
const toTarget = (a: Record<string, unknown>): Target =>
  a.attachToPost ? { type: "posts", id: String(a.attachToPost) } : a.attachToActivity ? { type: "activities", id: String(a.attachToActivity) } : null;
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const describe = (doc: { id: string | number; url?: string | null; filename?: string | null }, target: Target) =>
  `Uploaded media id ${doc.id} (${doc.filename}) ${doc.url ?? ""}.` +
  (target ? ` Attached to the ${target.type === "posts" ? "post" : "activity"} ${target.id} gallery.` : " Use this id in a post/activity `banner` or `gallery`.");
const fail = (e: unknown) => text(`Upload failed: ${(e as Error).message}`);

export const MCP_UPLOAD_TOOLS = [
  {
    name: "uploadImageFromUrl",
    description:
      "Upload an image from a public link (direct image URL, Google Drive or Dropbox share link, an image from a web page). The server downloads it, converts it to WebP and stores it. Up to 15MB.",
    parameters: { url: z.string().url(), alt: z.string().optional().describe("Short description of the photo."), ...targetSchema },
    handler: async (args: Record<string, unknown>, req: { payload: Payload }) => {
      try {
        const target = toTarget(args);
        const doc = await saveImage(req.payload, { data: await downloadImage(String(args.url)), filename: new URL(String(args.url)).pathname.split("/").pop(), alt: args.alt as string, target });
        return text(describe(doc, target));
      } catch (e) {
        return fail(e);
      }
    },
  },
  {
    name: "uploadImageBase64",
    description:
      "Upload an image you have as bytes: base64 or a data: URI. Keep it under ~3MB (the request limit is about 4.5MB); for bigger photos or photos on the user's phone use createUploadLink.",
    parameters: { data: z.string().describe("Base64 image data or a data:image/... URI."), filename: z.string().optional(), alt: z.string().optional(), ...targetSchema },
    handler: async (args: Record<string, unknown>, req: { payload: Payload }) => {
      try {
        const target = toTarget(args);
        const data = Buffer.from(String(args.data).replace(/^data:[^,]*,/, ""), "base64");
        const doc = await saveImage(req.payload, { data, filename: args.filename as string, alt: args.alt as string, target });
        return text(describe(doc, target));
      } catch (e) {
        return fail(e);
      }
    },
  },
  {
    name: "createUploadLink",
    description:
      "Best way to add photos from the user's phone or computer. Returns a link (valid 60 minutes) to a page where they pick photos from their gallery; each one is resized, uploaded and, if a post/activity id is given, added to its gallery automatically. Afterwards call listUploads with the same batch id.",
    parameters: { ...targetSchema },
    handler: async (args: Record<string, unknown>) => {
      const link = createUploadToken(toTarget(args));
      return text(
        `Open this link on the phone or computer that has the photos: ${ISSUER}/api/upload/${link.token}\n` +
          `It works for 60 minutes. Batch id: ${link.batch}` +
          (link.target ? ` — photos are added to the ${link.target.type === "posts" ? "post" : "activity"} ${link.target.id} gallery.` : ". Call listUploads with this batch id to get the media ids."),
      );
    },
  },
  {
    name: "listUploads",
    description: "List the photos uploaded through an upload link, by batch id (from createUploadLink).",
    parameters: { batch: z.string() },
    handler: async (args: Record<string, unknown>, req: { payload: Payload }) => {
      const { docs } = await req.payload.find({ collection: "media", where: { uploadBatch: { equals: String(args.batch) } }, sort: "createdAt", limit: 100, depth: 0 });
      return text(docs.length ? docs.map((d) => `${d.id} ${d.filename} ${d.url}`).join("\n") : "Nothing uploaded with this batch yet.");
    },
  },
];
