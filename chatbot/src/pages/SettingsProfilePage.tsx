import GlassCutCard from "@/components/pages/GlassCutCardV2";
import "@/features/agent-profile/agentProfile.css";

import { useEffect, useState } from "react";
import { fetchSettingProfile } from "@/features/agent-profile/services/agentProfile.service"; // ✅ Keshav's data
import type { AgentProfile } from "@/features/agent-profile/types/agentProfile.types";

import { useLocation } from "react-router-dom";

import { HeaderSection } from "@/features/setting-profile/components/HeaderSection";
import ProfileDetailsSection from "@/features/setting-profile/components/ProfileDetailsSection";

import type { JSX } from "react";

type LocationState = {
  role?: string;
};

const ROLE_DISPLAY_LABELS: Record<string, string> = {
  agent: "Agent",
  fo: "Field Officer",
  ro: "Regional Officer",
  io: "Intelligence Officer",
  "field officer": "Field Officer",
  "regional officer": "Regional Officer",
  "intelligence officer": "Intelligence Officer",
};

const SettingProfilePage = (): JSX.Element | null => {

  const [profile, setProfile] = useState<AgentProfile | null>(null); // ✅ own state for Keshav

  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const roleFromState = locationState?.role?.toLowerCase() ?? "agent";
  const roleLabel = ROLE_DISPLAY_LABELS[roleFromState] ?? "Agent";

  useEffect(() => {
    fetchSettingProfile().then(setProfile); // ✅ fetches Keshav's profile
  }, []);

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
        roleLabel={roleLabel}
      />

      {/* PROFILE DETAILS */}
      <ProfileDetailsSection profile={profile} />

    </GlassCutCard>
  );
};

export default SettingProfilePage;