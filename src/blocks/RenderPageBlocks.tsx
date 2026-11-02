import React, { Fragment } from "react";
import type { BlockGroup } from "@/payload-types";

import InfoSection from "@/blocks/InfoSection";
import AnnouncementList from "@/blocks/AnnouncementList";
import RichText from "@/blocks/RichText";
import LogoList from "@/blocks/LogosList";
import Tabs from "@/blocks/Tabs";

const blockComponents = {
  infoSection: InfoSection,
  announcementList: AnnouncementList,
  richText: RichText,
  logoList: LogoList,
  tabs: Tabs,
};

interface RenderPageBlocksProps {
  blocks: BlockGroup["blocks"];
}

export const RenderPageBlocks: React.FC<RenderPageBlocksProps> = ({
  blocks,
}) => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block) => {
          const { id, blockType } = block;
          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];
            if (Block) {
              // @ts-ignore
              return <Block key={id} {...block} />;
            }
          }
          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
