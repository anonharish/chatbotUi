import GlassCutCard from "@/components/pages/GlassCutCard";
import "@/features/agent-profile/agentProfile.css";

import { useAgentProfile } from "@/features/agent-profile/hooks/useAgentProfile";

import { HeaderSection } from "@/features/setting-profile/components/HeaderSection";
import ProfileDetailsSection from "@/features/setting-profile/components/ProfileDetailsSection";

import type { JSX } from "react";

const SettingProfilePage = (): JSX.Element | null => {

  const { profile } = useAgentProfile();

  if (!profile) {
    return null;
  }

  const fullName: string = `${profile.firstName} ${profile.lastName}`;

  const profilePhoto =
    profile.photo && profile.photo.length > 0
      ? profile.photo
      : "/src/assets/agents/keshav.png";

  return (
    <GlassCutCard>

      {/* PROFILE HEADER */}
      <HeaderSection
        name={fullName}
        photo={profilePhoto}
        verified={profile.verified}
      />

      {/* PROFILE DETAILS */}
      <ProfileDetailsSection profile={profile} />

    </GlassCutCard>
  );
};

export default SettingProfilePage;