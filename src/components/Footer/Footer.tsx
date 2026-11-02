import React from "react";
import Brand from "../Brand";
import FooterLinksList from "./FooterLinksList";
import { Separator } from "../ui/Separator";
import Link from "@/components/ui/Link";
import FooterSocialMediaLinks from "./FooterSocialMediaLinks";
import { MapPin } from "lucide-react";
import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import RichText from "../RichText";
import { headers } from "next/headers";

const Footer = async () => {
  const locale = await getLocale();

  const [information, footer] = await Promise.all([
    payload.findGlobal({
      slug: "information",
      locale,
    }),
    payload.findGlobal({
      slug: "footer",
      locale,
    }),
  ]);

  return (
    <footer className="bg-black/95 w-full text-primary-foreground">
      <div className="container">
        <div className="flex flex-col gap-8 md:gap-8 md:flex-row justify-between py-8">
          <div className="max-w-lg flex flex-col items-start gap-4">
            <div className="flex flex-col items-start gap-5">
              <Brand />
              <p className="text-primary-foreground/80 text-md">
                {information.description}
              </p>
            </div>
            <div className="w-full flex items-center mt-2 md:mt-5">
              <FooterSocialMediaLinks connections={information.connections} />
            </div>
          </div>

          <div className="w-full flex flex-col gap-8">
            <div className="justify-end flex flex-col md:flex-row gap-3 md:gap-12 lg:gap-24">
              <FooterLinksList
                title={footer.sitemapTitle || ""}
                links={footer.sitemap || []}
              />
            </div>
          </div>
        </div>

        <div className="text-xs flex flex-col gap-4 py-4">
          {information.address && (
            <Link
              href={information.address?.link || "#"}
              className="flex gap-2 text-primary-foreground/50 text-xs transition-colors hover:text-blue-500"
            >
              <MapPin size={16} />
              {information.address?.address}
            </Link>
          )}
          <Separator className="bg-primary-foreground/30" />
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between text-primary-foreground/80">
            {footer.copyrightPrimary && (
              <RichText
                data={footer.copyrightPrimary}
                enableGutter={false}
                enableProse={false}
                className="text-primary-foreground/80! text-sm! p-0!"
              />
            )}
            {footer.copyrightSecondary && (
              <RichText
                data={footer.copyrightSecondary}
                enableGutter={false}
                enableProse={false}
                className="text-primary-foreground/80! text-sm! p-0!"
              />
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
