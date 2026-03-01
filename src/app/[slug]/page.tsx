import { Metadata } from "next";
import { profileService } from "@/services/profile-service";
import { ProfileContent } from "./ProfileContent";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const profile = await profileService.getProfileBySlug(slug);
    
    if (!profile) {
        return {
            title: "Profile Not Found",
        };
    }

    const { personalInfo } = profile.resumeData;
    return {
        title: `${personalInfo.name} | ${personalInfo.role}`,
        description: personalInfo.about.slice(0, 160),
        openGraph: {
            title: `${personalInfo.name} - Professional Portfolio`,
            description: `View the professional portfolio of ${personalInfo.name}, ${personalInfo.role}.`,
            type: 'website',
        }
    };
}

export default async function ProfilePage({ params }: Props) {
    const { slug } = await params;
    const profile = await profileService.getProfileBySlug(slug);

    if (!profile) {
        notFound();
    }

    // Serialize to plain object to avoid "toJSON" methods error with Firestore Timestamps
    const serializedProfile = JSON.parse(JSON.stringify(profile));

    return <ProfileContent profile={serializedProfile} />;
}
