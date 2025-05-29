import React from "react";
import { Contact as ContactInterface } from "@/payload-types";

import RichText from "@/components/RichText";
import ContactForm from "./ContactForm";

const Contact: React.FC<ContactInterface> = ({
  title,
  subtitle,
  content,
  reverse,
  form,
}) => {
  return (
    <div className="gap-8 flex flex-col w-full lg:grid lg:grid-cols-2">
      {!reverse && <ContactForm {...form} />}
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="space-y-2">
          {subtitle && (
            <h3 className="text-sm font-bold uppercase text-blue-500 tracking-wider">
              {subtitle}
            </h3>
          )}
          {title && <h2 className="text-4xl font-bold">{title}</h2>}
        </div>
        {content && (
          <RichText data={content} enableGutter={false} enableProse={false} />
        )}
      </div>
      {reverse && <ContactForm {...form} />}
    </div>
  );
};

export default Contact;
