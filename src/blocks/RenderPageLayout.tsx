import React, { Fragment } from "react";
import type { Page } from "@/payload-types";
import { RenderPageBlocks } from "./RenderPageBlocks";

import BlockGroup from "@/blocks/BlockGroup";
import CarouselHeader from "@/blocks/CarouselHeader";
import ImageHeader from "@/blocks/ImageHeader";
import CardsSection from "@/blocks/CardsSection";
import NewsLetter from "@/blocks/NewsLetter";
import ScrollingSection from "@/blocks/ScrollingSection";

const blockComponents = {
  blockGroup: BlockGroup,
  carouselHeader: CarouselHeader,
  imageHeader: ImageHeader,
  cardsSection: CardsSection,
  newsLetter: NewsLetter,
  scrollingSection: ScrollingSection,
};

interface RenderPageLayoutProps {
  blocks: Page["blocks"];
}

export const RenderPageLayout: React.FC<RenderPageLayoutProps> = (props) => {
  const { blocks } = props;
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <main className="min-h-screen flex flex-col items-center">
        {blocks.map((block) => {
          const { id, blockType } = block;
          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType];
            if (Block) {
              return (
                // @ts-ignore
                <Block key={id} {...block}>
                  {/* @ts-ignore */}
                  <RenderPageBlocks blocks={block.blocks} />
                </Block>
              );
            }
          }
          return null;
        })}
      </main>
    );
  }

  return null;
};
