import React from "react";
import { RichText as RichTextInterface } from "@/payload-types";
import RichText from "@/components/RichText";

const RichTextBlock: React.FC<RichTextInterface> = ({ content }) => {
  return (
    <RichText
      data={content}
      enableGutter={false}
      enableProse={false}
      dir="auto"
    />
  );
};

export default RichTextBlock;
