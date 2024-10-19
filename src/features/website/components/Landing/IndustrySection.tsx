import AlternatingSection from "@/components/AlteratingSection";
import Image from "next/image";
import StatItem from "../../../../components/StatItem";
import { useTranslations } from 'next-intl';

const IndustrySectionImage = () => {
    return (
        <Image
            src="/npp_collaboration.jpg"
            alt="Internship at NPPA"
            width={1024}
            height={1024}
            className="rounded-md object-cover object-center"
        />
    );
};

const IndustrySection = () => {
    const t = useTranslations('home.industry_collaboration')
    return (
        <AlternatingSection
            id="industry"
            image={<IndustrySectionImage />}
            subtitle={t('subtitle')}
            title={t('title')}
        >
            <p>
                {t('description')}
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <StatItem value="+5" label="Annual Internships" />
                <StatItem value="+25" label="Projects Funded" />
            </div>
        </AlternatingSection>
    );
};

export default IndustrySection;
