import { buildConfig, UnauthorizedError, type PayloadRequest, type Plugin } from "payload";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";

import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { s3Storage } from "@payloadcms/storage-s3";
import { mcpPlugin, type MCPAccessSettings } from "@payloadcms/plugin-mcp";

import Information from "./globals/Information";
import Navigation from "./globals/Navigation";
import Footer from "./globals/Footer";
import Admission from "./globals/Admission";
import NewsPage from "./globals/NewsPage";
import ActivitiesPage from "./globals/ActivitiesPage";
import ContactPage from "./globals/ContactPage";

import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Categories } from "./collections/Categories";
import { Subscribers } from "./collections/Subscribers";
import { AdmissionSubscribers } from "./collections/AdmissionSubscribers";
import { ContactMessages } from "./collections/ContactMessages";
import { Activities } from "./collections/Activities";
import { OAuthGrants } from "./collections/OAuthGrants";
import { isAdmin } from "./collections/defaultAccess";
import { RESOURCE_METADATA_URL, userIdForAccessToken } from "./lib/oauth";

import infoSectionConfig from "./blocks/InfoSection/config";
import blockGroupConfig from "./blocks/BlockGroup/config";
import carouselConfig from "./blocks/CarouselHeader/config";
import imageHeaderConfig from "./blocks/ImageHeader/config";
import cardsSectionConfig from "./blocks/CardsSection/config";
import announcementListConfig from "./blocks/AnnouncementList/config";
import newsLetterConfig from "./blocks/NewsLetter/config";
import richTextConfig from "./blocks/RichText/config";
import logosListConfig from "./blocks/LogosList/config";
import scrollingSectionBlock from "./blocks/ScrollingSection/config";
import tabsConfig from "./blocks/Tabs/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// What MCP clients may do: API keys pick a subset in the admin, OAuth grants (Claude login) get all of it.
// No deletes and no users; media is read-only because staging and production share one R2 bucket.
const MCP_ENTITIES = {
  collections: {
    posts: {
      enabled: { find: true, create: true, update: true },
      description:
        "Announcements (news). Arabic only. Use `gallery` for photos (media ids), `brief` for the short summary, `publishedAt` for the date. Create as draft unless asked to publish.",
    },
    activities: {
      enabled: { find: true, create: true, update: true },
      description:
        "Activities shown on /activities/<type>: type is programs, competitions or clubs; teams[].members[] hold participant names; gallery holds media ids.",
    },
    pages: { enabled: { find: true, update: true }, description: "CMS pages built from blocks (en + ar)." },
    categories: { enabled: { find: true, create: true }, description: "Announcement categories." },
    media: { enabled: { find: true }, description: "Uploaded images. Read-only here: reference existing ids." },
    subscribers: { enabled: { find: true }, description: "Newsletter subscribers (read-only)." },
    "admission-subscribers": { enabled: { find: true }, description: "People waiting for admission updates (read-only)." },
    "contact-messages": { enabled: { find: true }, description: "Messages sent from the Contact page form (read-only)." },
  },
  globals: {
    admission: {
      enabled: { find: true, update: true },
      description:
        "Admission page: status auto|open|closed, opensAt/closesAt dates, applyUrl (Ministry link), academicYear, testsNote, hero, stages[].",
    },
    "news-page": { enabled: { find: true, update: true }, description: "News page hero (image, title, description)." },
    "activities-page": { enabled: { find: true, update: true }, description: "Activities page hero (image, title, description)." },
    "contact-page": {
      enabled: { find: true, update: true },
      description: "Contact page: hero, principal, counselors (classes = graduation years), workingHours (7 days), hoursNote, replyTime, address, map links, faq.",
    },
    information: { enabled: { find: true, update: true }, description: "School name, description, address and contacts." },
    navigation: { enabled: { find: true }, description: "Header menu (read-only)." },
    footer: { enabled: { find: true, update: true }, description: "Footer: newsletter band text, site map links, credits." },
  },
} as const;

// OAuth access tokens (atk_...) act as the admin who connected the app; anything else is an MCP API key.
const overrideAuth = async (
  req: Parameters<NonNullable<Parameters<typeof mcpPlugin>[0]["overrideAuth"]>>[0],
  getDefault: () => Promise<MCPAccessSettings>,
): Promise<MCPAccessSettings> => {
  const token = req.headers.get("authorization")?.match(/^Bearer\s+(atk_\S+)$/)?.[1];
  if (!token) return getDefault();
  const userId = await userIdForAccessToken(req.payload, token);
  const user = userId && (await req.payload.findByID({ collection: "users", id: userId, depth: 0 }).catch(() => null));
  if (!user || !isAdmin(user)) throw new UnauthorizedError();
  const caps = Object.fromEntries(
    Object.entries({ ...MCP_ENTITIES.collections, ...MCP_ENTITIES.globals }).map(([slug, { enabled }]) => [
      slug.replace(/-(.)/g, (_, c: string) => c.toUpperCase()),
      enabled,
    ]),
  );
  return { ...caps, user: { ...user, collection: "users", _strategy: "mcp-oauth" } } as MCPAccessSettings;
};

// MCP clients discover the OAuth server from the 401 (MCP authorization spec / RFC 9728).
// Payload runs plugins by `order`; the MCP plugin is 10, so this must come after it.
const mcpOAuthChallenge: Plugin = Object.assign((config: Parameters<Plugin>[0]) => ({
  ...config,
  endpoints: config.endpoints?.map((e) =>
    e.path !== "/mcp"
      ? e
      : {
          ...e,
          handler: async (req: PayloadRequest) => {
            try {
              return await e.handler(req);
            } catch (err) {
              if ((err as { status?: number }).status !== 401) throw err;
              return Response.json(
                { errors: [{ message: "Unauthorized" }] },
                { status: 401, headers: { "WWW-Authenticate": `Bearer resource_metadata="${RESOURCE_METADATA_URL}"` } },
              );
            }
          },
        },
  ),
}), { order: 11 });

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [Information, Navigation, Footer, Admission, NewsPage, ActivitiesPage, ContactPage],
  collections: [
    // actual
    Pages,
    Posts,
    Activities,
    Categories,
    Media,
    // data
    ContactMessages,
    Subscribers,
    AdmissionSubscribers,
    // management
    Users,
    OAuthGrants,
  ],
  blocks: [
    carouselConfig,
    imageHeaderConfig,
    cardsSectionConfig,
    blockGroupConfig,
    infoSectionConfig,
    announcementListConfig,
    newsLetterConfig,
    richTextConfig,
    logosListConfig,
    scrollingSectionBlock,
    tabsConfig,
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  sharp,
  plugins: [
    // MCP endpoint at /api/mcp: Bearer API keys ("MCP API Keys" in the admin) or OAuth (/api/oauth/*, "Connected apps").
    mcpPlugin({ ...MCP_ENTITIES, overrideAuth }),
    mcpOAuthChallenge,
    // Media lives in Cloudflare R2 (atsnee-media / atsnee-media-staging), served from media[-staging].atsnee.org.
    s3Storage({
      enabled: !!process.env.R2_BUCKET,
      collections: {
        media: {
          disablePayloadAccessControl: true, // media is public; URLs point straight at the R2 domain
          generateFileURL: ({ filename, prefix }) =>
            `${process.env.R2_PUBLIC_URL}/${prefix ? `${prefix}/` : ""}${filename}`,
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
  localization: {
    locales: [
      {
        label: "English",
        code: "en",
      },
      {
        label: "Arabic",
        code: "ar",
        rtl: true,
      },
    ],
    defaultLocale: "en",
    fallback: true,
  },
});
