import AlternatingSection from "@/components/AlteratingSection";
import Image from "next/image";
import StatItem from "../../../../components/StatItem";
import { useTranslations } from 'next-intl';
const RigorousCurriculumSectionImage = () => {
    return (
        <Image
            src="/curriculum_1.jpg"
            alt="School"
            width={1024}
            height={1024}
            className="rounded-md object-cover object-center"
        />
    );
};

const RigorousCurriculumSection = () => {
    const t = useTranslations('home.rigorous_curriculum')
    return (
        <AlternatingSection
            id="rigorous_curriculum"
            image={<RigorousCurriculumSectionImage />}
            subtitle={t('subtitle')}
            title={t('title')}
            reverse
        >
            <p>
                {t('description')}
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <StatItem value="20%" label="Nuclear Courses" />
                <StatItem value="60%" label="Engineering Courses" />
                <StatItem value="20%" label="General Education" />
            </div>
        </AlternatingSection>
    );
};

export default RigorousCurriculumSection;
