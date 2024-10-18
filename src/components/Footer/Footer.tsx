"use client";

import React, { useEffect, useState } from "react";
import Brand from "../Brand";
import FooterLinksList from "./FooterLinksList";
import { Separator } from "../ui/Separator";
import {
  getA7medInstagram,
  getMohamedInstagram,
  getMuhammedInstagram,
} from "@/lib/utils";
import Link from "@/components/ui/Link";
import FooterSocialMediaLinks from "./FooterSocialMediaLinks";
import {
  Building2Icon,
  Contact2,
  GraduationCapIcon,
  HomeIcon,
  InfoIcon,
  LocateIcon,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const [isLayoutFound, setIsLayoutFound] = useState(true);

  useEffect(() => {
    const checkForLayout = () => {
      const layoutElement = document.getElementById("pageLayout");
      setIsLayoutFound(!!layoutElement);
    };

    checkForLayout();
    const observer = new MutationObserver(() => {
      checkForLayout();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    isLayoutFound && (
      <footer className="bg-black/95 w-full text-primary-foreground">
        <div className="container">
          <div className="flex flex-col gap-8 md:gap-8 md:flex-row justify-between py-8">
            <div className="max-w-lg flex flex-col items-start gap-4">
              <div className="flex flex-col items-start gap-5">
                <Brand />
                <p className="text-primary-foreground/80 text-md">
                  El-Dabaa Nuclear School is a premier institution dedicated to
                  educating and training the next generation of nuclear
                  engineers and scientists.
                </p>
              </div>
              <div className="w-full flex items-center mt-2 md:mt-5">
                <FooterSocialMediaLinks />
              </div>
            </div>

            <div className="w-full flex flex-col gap-8">
              <div className="justify-end flex flex-col md:flex-row gap-3 md:gap-12 lg:gap-24">
                <FooterLinksList
                  title="Site Map"
                  links={[
                    { title: "Home", href: "/" },
                    {
                      title: "About",
                      href: "/about",
                    },

                    {
                      title: "Academics",
                      href: "/academics",
                    },

                    {
                      title: "Nuclear Power Plant",
                      href: "/nuclearpowerplant",
                    },

                    {
                      title: "Campus",
                      href: "/campus",
                    },
                    {
                      title: "Announcements",
                      href: "/announcements",
                    },
                    {
                      title: "Admission",
                      href: "/admission",
                    },
                    {
                      title: "Activities",
                      href: "/activities",
                    },
                    {
                      title: "Contact us",
                      href: "/contact",
                    },
                  ]}
                />
              </div>
            </div>
            {/* <div className="flex flex-col md:flex-row gap-4 md:gap-12 lg:gap-24">
              <FooterLinksList
                title="Keep In Touch"
                
              />
            </div> */}
          </div>

          <div className="text-xs flex flex-col gap-4 py-4">
            <Link
              href="https://maps.app.goo.gl/2avSU5dTStbnYdBi9"
              className="flex gap-2 text-primary-foreground/50 text-xs transition-colors hover:text-blue-500"
            >
              <MapPin size={16} />
              ATSNEE, El-Dabaa, Marsa Matrouh Governorate 5002945
            </Link>
            <Separator className="bg-primary-foreground/30" />
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between text-primary-foreground/80">
              <p>© 2024 ATSNEE. All rights reserved</p>
              <p>
                Developed by <Link href={getA7medInstagram()}>Ahmed Hazem</Link>
                , <Link href={getMohamedInstagram()}>Mohamed Wasfy</Link>, and{" "}
                <Link href={getMuhammedInstagram()}>Muhammed Dahman</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
