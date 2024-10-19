import AlternatingSection from "@/components/AlteratingSection";
import Image from "next/image";
import Markdown from "react-markdown";

const CampusAdacemicsImage1 = () => {
    return (
        <Image
            width={1024}
            height={1024}
            src="/landing5.jpg"
            alt=""
            className="rounded-md object-contain object-center"
        />
    );
};
const CampusAdacemicsImage2 = () => {
    return (
        <Image
            width={1024}
            height={1024}
            src="/campus1.jpg"
            alt=""
            className="rounded-md object-contain object-center"
        />
    );
};
const CampusAdacemicsImage3 = () => {
    return (
        <Image
            width={1024}
            height={1024}
            src="/campus1.jpg"
            alt=""
            className="rounded-md object-contain object-center"
        />
    );
};

const CampusAdacemics = () => {
    return (
        <div className="w-full space-y-32">
            <AlternatingSection
                image={<CampusAdacemicsImage1 />}
                title="Vibrant Campus Activities"
                subtitle="Engage, Connect, and Thrive"
                reverse
            >
                <p>
                    At ATSNEE Campus, student life is enriched with diverse activities
                    that cater to every interest. From cultural festivals and academic
                    competitions to social gatherings and workshops, there’s always
                    something happening. Join us to make lasting memories and form
                    connections that will last a lifetime!
                </p>
            </AlternatingSection>
            <AlternatingSection
                image={<CampusAdacemicsImage2 />}
                title="Inclusive Student Communities"
                subtitle="Belonging Beyond Boundaries"
            >
                <div className="space-y-2">
                    <p>
                        Embrace the spirit of community at ATSNEE Campus! Our inclusive
                        environment fosters friendships and collaboration among students
                        from diverse backgrounds, offering:
                    </p>
                    <ul className="list-inside list-disc">
                        <li>Join a variety of groups that match your interests.</li>
                        <li>Collaborate and learn together with peers.</li>
                        <li>Attend mixers, workshops, and lectures that inspire.</li>
                        <li>Access resources for personal and academic growth.</li>
                    </ul>
                </div>
            </AlternatingSection>
            <AlternatingSection
                image={<CampusAdacemicsImage3 />}
                title="Exciting Sports and Recreation"
                subtitle="Stay Active"
                reverse
            >
                <div className="space-y-2">
                    <p>
                        Get ready to stay active at ATSNEE Campus! With a variety of sports
                        teams, fitness classes, and recreational activities, there’s
                        something for everyone, including:
                    </p>
                    <ul className="list-inside list-disc">
                        <li>Compete at a high level in various sports.</li>
                        <li>Join friendly competitions with fellow students.</li>
                    </ul>
                </div>
            </AlternatingSection>
        </div>
    );
};

export default CampusAdacemics;
