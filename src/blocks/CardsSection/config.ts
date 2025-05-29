import { Block, Field } from "payload";
import { LucideIconPicker } from "payload-lucide-picker";

const cardsSectionConfig: Block = {
  slug: "cardsSection",
  interfaceName: "CardsSection",
  fields: [
    {
      name: "cards",
      type: "array",
      minRows: 1,
      maxRows: 6,
      fields: [
        LucideIconPicker({
          name: "featureIcon",
          label: "Feature Icon",
          required: true,
        }) as unknown as Field,
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          localized: true,
        },
      ],
    },
  ],
};

export default cardsSectionConfig;
