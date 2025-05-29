import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";

import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";

import Information from "./globals/Information";
import Navigation from "./globals/Navigation";
import Footer from "./globals/Footer";

import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Categories } from "./collections/Categories";
import { Messages } from "./collections/Messages";
import { Subscribers } from "./collections/Subscribers";
import { Activities } from "./collections/Activities";

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
// import contactInfo from "./blocks/Contact/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [Information, Navigation, Footer],
  collections: [
    // actual
    Pages,
    Posts,
    Activities,
    Categories,
    Media,
    // data
    Messages,
    Subscribers,
    // management
    Users,
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
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // formBuilderPlugin({
    //   fields: {
    //     payment: false,
    //   },
    //   // formOverrides: {
    //   //   fields: ({ defaultFields }) => {
    //   //     return defaultFields.map((field) => ({
    //   //       ...field,
    //   //       localized: true,
    //   //     }));
    //   //   },
    //   // },
    // }),
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
