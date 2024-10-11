import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers"; // Import from next/headers

export default getRequestConfig(async () => {
  // Get cookies from the request
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en"; // Default to 'en' if cookie not found

  return {
    locale,
    messages: (await import(`../../localization/${locale}.json`)).default,
  };
});
