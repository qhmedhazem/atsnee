import { NavbarMenu } from "./NavbarMenu";

import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import { headers } from "next/headers";

const Navbar = async () => {
  const locale = await getLocale();
  const [information, navigation] = await Promise.all([
    payload.findGlobal({
      slug: "information",
      locale: locale,
    }),
    payload.findGlobal({
      slug: "navigation",
      locale: locale,
    }),
  ]);

  return <NavbarMenu navigation={navigation} information={information} />;
};

export default Navbar;
