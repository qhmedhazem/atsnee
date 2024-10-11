import Link from "@/components/ui/Link";
import React, { FC } from "react";

interface Link {
  title?: string;
  href: string;
  icon?: React.ReactNode; // Add icon prop
}

interface Props {
  title: string;
  links: Link[];
}

const FooterLinksList: FC<Props> = ({ title, links }) => {
  return (
    <div className="flex flex-col gap-6">
      {title && <h6 className="text-xl">{title}</h6>}
      <ul className="grid grid-cols-2 gap-y-4 gap-x-16">
        {links.map((link) => (
          <FooterLink key={link.href} {...link} />
        ))}
      </ul>
    </div>
  );
};

const FooterLink: FC<Link> = ({ title, href, icon }) => {
  return (
    <li className="text-md text-primary-foreground/70">
      <Link
        href={href}
        className="flex items-center gap-2 hover:text-primary-foreground/95 transition-colors duration-300"
      >
        {icon} {/* Render the icon */}
        {title}
      </Link>
    </li>
  );
};

export default FooterLinksList;
