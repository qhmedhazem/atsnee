import AlternatingSection from "@/components/AlteratingSection";
import Image from "next/image";
import StatItem from "../../../../components/StatItem";

const AboutSectionImage = () => {
  return (
    <Image
      src="/landing5.jpg"
      alt="School"
      width={1024}
      height={1024}
      className="rounded-md object-cover object-center"
    />
  );
};

const AboutSection = () => {
  return (
    <AlternatingSection
      id="about"
      image={<AboutSectionImage />}
      subtitle="ATSNEE"
      title="The Future of Nuclear Education"
    >
      <p>
        El-Dabaa Nuclear School is a premier institution dedicated to educating
        and training the next generation of nuclear engineers and scientists. We
        are proud to be a key component of Egypt&apos;s ambitious nuclear energy
        program.
      </p>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <StatItem value="+300" label="Students" />
        <StatItem value="+60" label="Staff" />
        <StatItem value="100%" label="Discipline" />
      </div>
    </AlternatingSection>
  );
};

export default AboutSection;
