import Image from "next/image";
import Link from "@/components/ui/Link";

const PowerPlantOverview = () => {
  return (
    <div className="w-full px-4 flex justify-center py-8">
      <div className="max-w-3xl flex flex-col justify-center items-center gap-16">
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-3xl font-bold">
            Egypt&apos;s First Step Towards Sustainable Nuclear Energy
          </h1>
          <p className="text-lg">
            El-Dabaa Nuclear Power Plant, located in the El-Dabaa region on
            Egypt’s Mediterranean coast, is Egypt’s first nuclear power
            facility. The project, developed in collaboration with Russia, is a
            key part of Egypt&apos;s efforts to diversify its energy sources and
            meet growing electricity demands. The plant will feature four
            reactors with a total capacity of 4,800 megawatts, designed to
            provide a stable and sustainable energy supply. The construction of
            the first reactor began in 2021, and it is expected to become
            operational by 2028. Upon completion, El-Dabaa will play a crucial
            role in Egypt’s transition to nuclear energy, contributing
            significantly to the nation’s power grid and economic development,{" "}
            <Link
              className="text-light-blue-500 underline"
              href="https://nppa.gov.eg/ElDabaa"
            >
              More Information
            </Link>
            .
          </p>
        </div>
        <div className="w-full gap-8 flex flex-col md:flex-row justify-around items-center">
          <Image
            src="/NPPA.png"
            alt="Nuclear Power Plants Authority"
            width={192}
            height={192}
          />
          <Image src="/ROSATOM.png" alt="ROSATOM" width={192} height={192} />
        </div>
      </div>
    </div>
  );
};

export default PowerPlantOverview;
