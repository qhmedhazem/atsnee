import AlternatingSection from "@/components/AlteratingSection";
import Image from "next/image";
import StatItem from "../../../../components/StatItem";
import { useTranslations } from 'next-intl';

const ExpertFacultySectionImage = () => {
    return (
        <Image
            src="/faculty_2.jpg"
            alt="Inside the classroom"
            width={1024}
            height={1024}
            className="rounded-md object-cover object-center"
        />
    );
};

const ExpertFacultySection = () => {
    const t = useTranslations('home.expert_faculty')
    return (
        <AlternatingSection
            id="expert_faculty"
            image={<ExpertFacultySectionImage />}
            subtitle={t('subtitle')}
            title={t('title')}
            reverse
        >
            <p>
                {t('description')}
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
                <StatItem value="+10" label="Professors" />
                <StatItem value="+50" label="Teachers" />
            </div>
        </AlternatingSection>
    );
};

export default ExpertFacultySection;
