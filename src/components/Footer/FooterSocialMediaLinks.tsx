"use client";
import React, { FC } from "react";
import Link from "next/link";
import { Information } from "@/payload-types";

import {
  Facebook,
  PhoneIcon,
  Instagram,
  Linkedin,
  MailIcon,
  Twitter,
  Youtube,
} from "lucide-react"; // Import Lucide icons

const typeToIcon = {
  email: <MailIcon size={20} />,
  facebook: <Facebook size={20} />,
  instagram: <Instagram size={20} />,
  linkedin: <Linkedin size={20} />,
  phone: <PhoneIcon size={20} />,
  whatsapp: <PhoneIcon size={20} />,
  x: <Twitter size={20} />,
  youtube: <Youtube size={20} />,
};

interface FooterSocialMediaLinksProps {
  connections: Information["connections"];
}

const FooterSocialMediaLinks: FC<FooterSocialMediaLinksProps> = ({
  connections,
}) => {
  return (
    <ul className="flex gap-4">
      {connections?.map((connection) => {
        let href = "";
        if (connection.blockType == "phone") {
          href = "tel:" + connection.phoneNumber;
        } else if (connection.blockType == "email") {
          href = "mailto:" + connection.email;
        } else if (connection.blockType == "whatsapp") {
          href = `https://wa.me/${connection.phoneNumber}`;
        } else {
          href = connection.link;
        }

        return (
          <li key={connection.id}>
            <Link href={href} target="_blank" rel="noopener noreferrer">
              <div className="border border-border/40 flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-500 hover:text-primary-foreground transition-colors duration-300">
                {typeToIcon[connection.blockType]}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default FooterSocialMediaLinks;
