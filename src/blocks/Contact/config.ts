import { Block } from "payload";

const contactInfo: Block = {
  slug: "contact",
  labels: {
    singular: "Contact Section",
    plural: "Contact Sections",
  },
  interfaceName: "Contact",
  fields: [
    {
      name: "subtitle",
      type: "text",
      label: "Subtitle",
      required: false,
      localized: true,
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      required: false,
      localized: true,
    },
    {
      name: "content",
      type: "richText",
      required: false,
      localized: true,
    },
    {
      name: "reverse",
      type: "checkbox",
      label: "Reverse Layout",
      required: false,
    },
    {
      name: "form",
      type: "group",
      label: "Contact Form",
      required: true,
      fields: [
        {
          name: "name",
          type: "text",
          label: "Name Label",
          required: true,
          localized: true,
        },
        {
          name: "namePlaceholder",
          type: "text",
          label: "Name Placeholder",
          required: true,
          localized: true,
        },
        {
          name: "phone",
          type: "text",
          label: "Phone Label",
          required: true,
          localized: true,
        },
        {
          name: "phonePlaceholder",
          type: "text",
          label: "Phone Placeholder",
          required: true,
          localized: true,
        },
        {
          name: "email",
          type: "text",
          label: "Email Label",
          required: true,
          localized: true,
        },
        {
          name: "emailPlaceholder",
          type: "text",
          label: "Email Placeholder",
          required: true,
          localized: true,
        },
        {
          name: "message",
          type: "text",
          label: "Message Label",
          required: true,
          localized: true,
        },
        {
          name: "messagePlaceholder",
          type: "text",
          label: "Message Placeholder",
          required: true,
          localized: true,
        },
        {
          name: "sendButton",
          type: "group",
          label: "Send Button",
          fields: [
            {
              name: "send",
              type: "text",
              label: "Send State Label",
              required: true,
              localized: true,
            },
            {
              name: "sent",
              type: "text",
              label: "Sent State Label",
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
  ],
};

export default contactInfo;
