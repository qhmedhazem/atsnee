"use client";

import React, { createContext, ReactNode } from "react";
import { Locale } from "@/lib/locale";

type LocaleContextType = {
  locale: Locale;
};

export const LocaleContext = createContext<LocaleContextType | undefined>(
  undefined
);

const LocaleProvider = ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) => {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
