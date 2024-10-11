import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import Overview from "@/features/website/components/About/Overview";

export const metadata: Metadata = {
  title: "Campus | Applied Technology School for Nuclear Energy",
};

export default function Campus() {
  return (
    <PageLayout
      imageSrc="/landing2.jpg"
      imageAlt="Advanced Technology School For Nuclear Energy Campus"
      title="Campus"
      description="A Place to Grow, Learn, and Thrive!"
    >
      Empty for now
    </PageLayout>
  );
}
