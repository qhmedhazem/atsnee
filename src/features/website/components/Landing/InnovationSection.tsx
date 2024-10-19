import AlternatingSection from "@/components/AlteratingSection";
import Image from "next/image";
import StatItem from "../../../../components/StatItem";
import { useTranslations } from 'next-intl';

const InnovationSectionImage = () => {
    return (
        <Image
            src="/innovation_1.jpg"
            alt="School"
            width={1024}
            height={1024}
            className="rounded-md object-cover object-center"
        />
    );
};

const InnovationSection = () => {
    const t = useTranslations('home.innovation')
    return (
        <AlternatingSection
            id="innovation"
            image={<InnovationSectionImage />}
            subtitle={t('subtitle')}
            title={t('title')}
        >
            <p>
                {t('description')}
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <StatItem value="+50" label="Research Projects" />
                <StatItem value="+15" label="Awarded Projects" />
            </div>
        </AlternatingSection>
    );
};

export default InnovationSection;
