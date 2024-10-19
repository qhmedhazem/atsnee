import type { Metadata } from "next";
import CampusAdacemics from "@/features/website/components/Campus/CampusAdacemics";

export const metadata: Metadata = {
  title: "Campus Life | Applied Technology School for Nuclear Energy",
};

export default async function Life() {
  return <CampusAdacemics />;
}
