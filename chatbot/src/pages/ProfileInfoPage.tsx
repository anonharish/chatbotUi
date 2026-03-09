import GlassCutCard from "@/components/pages/GlassCutCardV2";
import "@/features/agent-profile/agentProfile.css";
import { ProfileHeader } from "@/features/agent-profile/components/ProfileHeader";
import { ProfileInfoCards } from "@/features/profile-info/ProfileInfoCards";

export default function ProfileHeaderGlassPage() {
  return (
    <GlassCutCard>
      <ProfileHeader
        name="Ram Kishore"
        photo="/src/assets/agents/photo.png"
        verified
      />
       <ProfileInfoCards />
    </GlassCutCard>
  );
}