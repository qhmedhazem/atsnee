import type { Metadata } from "next";
import CampusLife from "@/features/website/components/Campus/CampusLife";

export const metadata: Metadata = {
  title: "Campus Life | Applied Technology School for Nuclear Energy",
};

export default async function Life() {
  return <CampusLife />;
}
