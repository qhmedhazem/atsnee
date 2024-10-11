import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import AdmissionInfo from "@/features/website/components/Admission/AdmissionInfo";
import AdmissionStagesContainer from "@/features/website/components/Admission/AdmissionStagesContainer";

export const metadata: Metadata = {
  title: "Admission | Applied Technology School for Nuclear Energy",
  description: `The admissions process for El Dabaa Nuclear School is highly competitive, reflecting the rigorous standards and demanding nature of the program. Only the most exceptional students who demonstrate excellence in academics, physical fitness, and personal qualities will be selected to join this prestigious institution.`,
};

export default function About() {
  return (
    <PageLayout
      imageSrc="/landing1.jpg"
      imageAlt="Advanced Technology School For Nuclear Energy Campus"
      title="Admission"
      description="Join the Ranks of the Best! Your journey to excellence starts here."
      className="gap-6"
    >
      <AdmissionInfo />
      <AdmissionStagesContainer />
    </PageLayout>
  );
}
