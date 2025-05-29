"use client";

import * as React from "react";

import { SelectInput, useField, FieldLabel } from "@payloadcms/ui";
import { OptionObject } from "payload";

import { DynamicIcon, IconName, iconNames } from "lucide-react/dynamic";

export const lucideOptions = () => {
  const options: OptionObject[] = [];
  iconNames.forEach((label) => {
    options.push({
      // @ts-ignore
      label: label,
      value: label,
    });
  });

  return options;
};

type LucideSelectComponentProps = {
  path: string;
};

export const Select: React.FC<LucideSelectComponentProps> = ({ path }) => {
  const { value, setValue } = useField<IconName>({ path });

  let icon = iconNames[0];
  if (value) {
    icon = value;
  }

  return (
    <div>
      <SelectInput
        path={path}
        name={path}
        value={value}
        required={true}
        label={"Icon"}
        description={
          "You can find all icons on the page https://lucide.dev/icons/"
        }
        hasMany={false}
        options={lucideOptions()}
        onChange={(e) => {
          // @ts-ignore
          setValue(e?.value);
        }}
      />
      {icon && (
        <div className="mt-4">
          <p>
            Icon Preview: <DynamicIcon name={icon} size={24} />
          </p>
        </div>
      )}
    </div>
  );
};
