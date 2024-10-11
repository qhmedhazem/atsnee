import type { Metadata } from "next";
import { FC, ReactNode, useRef } from "react";
import { PageLayout } from "@/components/PageLayout";
import PowerPlantOverview from "@/features/website/components/PowerPlant/PowerPlantOverview";

export const metadata: Metadata = {
  title: "Nuclear Power Plant | Applied Technology School for Nuclear Energy",
  description: `El-Dabaa Nuclear Power Plant, located in the El-Dabaa region on Egypt’s Mediterranean coast, is Egypt’s first nuclear power facility. The project, developed in collaboration with Russia, is a key part of Egypt&apos;s efforts to diversify its energy sources and meet growing electricity demands.`,
};

const AcademicsPage: FC = () => {
  return (
    <PageLayout
      imageSrc="/nuclearpowerplant.jpg"
      imageAlt="Advanced Technology School For Nuclear Energy Campus"
      title="Nuclear Power Plant"
      description=""
      className="max-w-full w-full space-y-12 py-12"
    >
      <PowerPlantOverview />
    </PageLayout>
  );
};

export default AcademicsPage;
