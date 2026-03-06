import { useEffect, useState } from "react";
import { fetchAgentProfile } from "../services/agentProfile.service";
import type { AgentProfile } from "../types/agentProfile.types";


export const useAgentProfile = () => {
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  useEffect(() => {
    fetchAgentProfile().then(setProfile);
  }, []);

  return { profile };
};
