import GlassCutCard from "@/components/pages/GlassCutCardV2";
import "@/features/agent-profile/agentProfile.css";
import { useAgentProfile } from "@/features/agent-profile/hooks/useAgentProfile";
import { ProfileHeader } from "@/features/agent-profile/components/ProfileHeader";
import { AgentInfoSection } from "@/features/agent-profile/components/AgentInfoSection";
import { useLocation } from "react-router-dom";
import type { JSX } from "react";

type Role = "agent" | "fo" | "ro" | "io";

type LocationState = {
  role?: string;
};

const ROLE_KEY_MAP: Record<string, Role> = {
  "agent": "agent",
  "field officer": "fo",
  "fo": "fo",
  "regional officer": "ro",
  "ro": "ro",
  "intelligence officer": "io",
  "io": "io",
};

const ROLE_DISPLAY_LABELS: Record<Role, string> = {
  agent: "Agent",
  fo: "Field Officer",
  ro: "Regional Officer",
  io: "Intelligence Officer",
};

const AgentProfilePage = (): JSX.Element | null => {
  const { profile } = useAgentProfile();

  // ✅ Fix: type the location state explicitly
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  const roleFromState = locationState?.role?.toLowerCase() ?? "agent";
  const role: Role = ROLE_KEY_MAP[roleFromState] ?? "agent";

  // ✅ Fix: use ROLE_DISPLAY_LABELS (not ROLE_LABELS which didn't exist)
  const roleLabel = ROLE_DISPLAY_LABELS[role];

  if (!profile) {
    return null;
  }

  const fullName: string = profile.firstName + " " + profile.lastName;

  return (
    <GlassCutCard>
      <ProfileHeader
        name={fullName}
        photo={profile.photo ? profile.photo : "/src/assets/agents/default.png"}
        verified={profile.verified}
        roleLabel={roleLabel}
      />

      <AgentInfoSection
        profile={profile}
        role={role}
        roleLabel={roleLabel}
      />
    </GlassCutCard>
  );
};

export default AgentProfilePage;