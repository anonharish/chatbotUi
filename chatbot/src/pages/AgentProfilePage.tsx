import GlassCutCard from "@/components/pages/GlassCutCard";
import "@/features/agent-profile/agentProfile.css";
import { useAgentProfile } from "@/features/agent-profile/hooks/useAgentProfile";
import { ProfileHeader } from "@/features/agent-profile/components/ProfileHeader";
import { AgentInfoSection } from "@/features/agent-profile/components/AgentInfoSection";


import type { JSX } from "react";

const AgentProfilePage = (): JSX.Element | null => {
  const { profile } = useAgentProfile();

  if (!profile) return null;

  return (
    <GlassCutCard>


     <ProfileHeader
  name={`${profile.firstName} ${profile.lastName}`}
  photo={profile.photo || "/src/assets/agents/default.png"}
  verified={profile.verified}
/>


      <AgentInfoSection profile={profile} />


    </GlassCutCard>
  );
};

export default AgentProfilePage;
