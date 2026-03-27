import GlassCutCard from "@/components/pages/GlassCutCardV2";
import "@/features/agent-profile/agentProfile.css";

import { useEffect, useState } from "react";
import { fetchSettingProfile } from "@/features/agent-profile/services/agentProfile.service";
import type { AgentProfile } from "@/features/agent-profile/types/agentProfile.types";

import { useLocation } from "react-router-dom";

import { HeaderSection } from "@/features/setting-profile/components/HeaderSection";
import ProfileDetailsSection from "@/features/setting-profile/components/ProfileDetailsSection";

import type { JSX } from "react";

type LocationState = {
  role?: string;
};

const ROLE_DISPLAY_LABELS: Record<string, string> = {
  agent:                  "Agent",
  fo:                     "Field Officer",
  ro:                     "Regional Officer",
  io:                     "Intelligence Officer",
  "field officer":        "Field Officer",
  "regional officer":     "Regional Officer",
  "intelligence officer": "Intelligence Officer",
};

const EMPTY_PROFILE: AgentProfile = {
  firstName:    "",
  lastName:     "",
  age:          "" as any,
  phone:        "",
  state:        "",
  region:       "",
  area:         "",
  aadhaarNumber: "",
  panNumber:    "",
  district:     "",
  pincode:      "",
  photo:        "",
  verified:     false,
  role:         "",
};

const SettingProfilePage = (): JSX.Element | null => {

  const [profile, setProfile]     = useState<AgentProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const roleFromNav   = locationState?.role?.toLowerCase() ?? null;

  useEffect(() => {
    if (roleFromNav) {
      setProfile({ ...EMPTY_PROFILE, role: roleFromNav });
    } else {
      fetchSettingProfile().then(setProfile);
    }
  }, [roleFromNav]);

  if (!profile) return null;

  const activeRole = roleFromNav ?? profile.role ?? "agent";
  const roleLabel  = ROLE_DISPLAY_LABELS[activeRole] ?? "Agent";

  const fullName = roleFromNav
    ? `New ${roleLabel}`
    : `${profile.firstName} ${profile.lastName}`;

  const profilePhoto =
    profile.photo && profile.photo.length > 0
      ? profile.photo
      : "/src/assets/agents/keshav.png";

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    // ✅ Just turn off editing — ProfileDetailsSection resets itself via useEffect
    setIsEditing(false);
  };

  return (
    <GlassCutCard>

      {/* PROFILE HEADER */}
      <HeaderSection
        name={fullName}
        photo={profilePhoto}
        verified={profile.verified}
        roleLabel={roleLabel}
        showEdit={true}
        isEditing={isEditing}
        onEditProfile={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {/* PROFILE DETAILS */}
      <ProfileDetailsSection
        profile={profile}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
      />

    </GlassCutCard>
  );
};

export default SettingProfilePage;