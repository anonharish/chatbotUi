import type { AgentProfile } from "../types/agentProfile.types";

export const fetchAgentProfile = async (): Promise<AgentProfile> => {
  return {
    firstName: "Ram",
    lastName: "Kishore",
    age: 32,
    phone: "+91 91234 56789",
    state: "Andhra Pradesh",
    region: "Godavari Region",
    area: "Tanuku Area",
    aadhaarNumber: "XXXX XXXX 1234",
    panNumber: "ABCDE1234F",
    district: "West Godavari",
    pincode: "534211",
    photo: "/src/assets/agents/photo.png",
    verified: true,
    role: "ro", // ✅ Ram is Regional Officer
  };
};

// ✅ Keshav's profile — used for SettingProfilePage
export const fetchSettingProfile = async (): Promise<AgentProfile> => {
  return {
    firstName: "Keshav",
    lastName: "S.",
    age: 28,
    phone: "+91 9123-456-7890",
    state: "Andhra Pradesh",
    region: "Godavari Region",
    area: "Tanuku Area",
    aadhaarNumber: "XXXX XXXX 5678",
    panNumber: "FGHIJ5678K",
    district: "West Godavari",
    pincode: "534211",
    photo: "/src/assets/agents/keshav.png",
    verified: true,
    role: "ro", // ✅ Keshav is Regional Officer — change as needed
  };
};