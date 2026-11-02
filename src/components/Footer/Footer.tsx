import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import Brand from "../Brand";
import FooterLinksList from "./FooterLinksList";
import FooterSocialMediaLinks from "./FooterSocialMediaLinks";
import NewsletterBand from "../NewsletterBand";
import { Separator } from "../ui/Separator";
import RichText from "../RichText";
import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";

const STRINGS = {
  en: { rights: "All rights reserved." },
  ar: { rights: "جميع الحقوق محفوظة." },
};

// "+201221681400" -> "+20 122 168 1400"; anything else is shown as stored.
const formatPhone = (n: string) => n.replace(/^\+20(\d{3})(\d{3})(\d{4})$/, "+20 $1 $2 $3");

const Footer = async () => {
  const locale = await getLocale();
  const t = STRINGS[locale];

  const [information, footer] = await Promise.all([
    payload.findGlobal({ slug: "information", locale }),
    payload.findGlobal({ slug: "footer", locale }),
  ]);

  const connections = information.connections ?? [];
  const contacts = connections.flatMap((c) =>
    c.blockType === "phone"
      ? [{ id: c.id, label: c.title, value: formatPhone(c.phoneNumber), href: `tel:${c.phoneNumber}`, Icon: Phone }]
      : c.blockType === "email"
        ? [{ id: c.id, label: c.title, value: c.email, href: `mailto:${c.email}`, Icon: Mail }]
        : []
  );
  const socials = connections.filter((c) => c.blockType !== "phone" && c.blockType !== "email");

  return (
    <>
      <NewsletterBand
        title={footer.newsletter?.title}
        text={footer.newsletter?.text}
        placeholder={footer.newsletter?.emailPrompt}
        buttonLabel={footer.newsletter?.ctaLabel}
      />
      <footer className="w-full bg-black/95 text-primary-foreground">
        <div className="container">
          <div className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div className="flex max-w-lg flex-col items-start gap-5">
              <Brand />
              {information.description && <p className="text-primary-foreground/80">{information.description}</p>}

              {contacts.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {contacts.map(({ id, label, value, href, Icon }) => (
                    <li key={id}>
                      <a href={href} className="group flex items-center gap-3 text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/40 transition-colors group-hover:bg-blue-500">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="flex flex-col">
                          {label && <span className="text-xs text-primary-foreground/50">{label}</span>}
                          <span dir="ltr" className="text-start">
                            {value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {socials.length > 0 && <FooterSocialMediaLinks connections={socials} />}
            </div>

            <FooterLinksList title={footer.sitemapTitle || ""} links={footer.sitemap || []} />
          </div>

          <div className="flex flex-col gap-4 py-5 text-sm">
            {information.address?.address && (
              <a
                href={information.address.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-primary-foreground/60 transition-colors hover:text-blue-500"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                {information.address.address}
              </a>
            )}
            <Separator className="bg-primary-foreground/30" />
            <div className="flex flex-col gap-2 text-primary-foreground/70 lg:flex-row lg:justify-between">
              {footer.copyrightPrimary ? (
                <RichText data={footer.copyrightPrimary} enableGutter={false} enableProse={false} className="text-primary-foreground/70! text-sm! p-0!" />
              ) : (
                <p>
                  © {new Date().getFullYear()} {information.short}. {t.rights}
                </p>
              )}
              {footer.copyrightSecondary && (
                <RichText data={footer.copyrightSecondary} enableGutter={false} enableProse={false} className="text-primary-foreground/70! text-sm! p-0!" />
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
