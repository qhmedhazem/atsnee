import { LocaleContext } from "@/providers/LocaleProvider";
import { useContext } from "react";

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context.locale;
};
