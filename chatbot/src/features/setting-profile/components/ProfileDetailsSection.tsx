import { useState } from "react";
import type { AgentProfile } from "@/features/agent-profile/types/agentProfile.types";
import AlertsSection from "./AlertsSection";

type Props = {
  profile: AgentProfile;
};

export default function ProfileDetailsSection({ profile }: Props) {

  const [formData, setFormData] = useState<AgentProfile>(profile);

  const handleChange = (field: keyof AgentProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "age" ? Number(value) : value,
    }));
  };

  const Field = ({
    label,
    field,
    type = "text",
  }: {
    label: string;
    field: keyof AgentProfile;
    type?: string;
  }) => {
    return (
      <div className="flex flex-col gap-2 w-full">

        <span className="text-xs text-gray-500 font-medium">
          {label}
        </span>

        <input
          type={type}
          value={String(formData[field] ?? "")}
          onChange={(e) => handleChange(field, e.target.value)}
          className="border-b border-gray-400 pb-2 bg-transparent outline-none text-sm text-gray-800"
        />

      </div>
    );
  };

  return (
    <div className="px-10 pt-8 pb-16 bg-white rounded-[32px] mt-2">

      {/* PERSONAL DETAILS */}
      <h2 className="text-gray-600 font-semibold mb-8">
        Personal Details
      </h2>

      <div className="grid grid-cols-2 gap-x-24 gap-y-12">

        <Field label="First Name" field="firstName" />

        <Field label="Last Name" field="lastName" />

        <Field label="Age" field="age" type="number" />

        <Field label="Phone Number" field="phoneNumber" />

      </div>

      {/* ALERTS */}
      <AlertsSection />

    </div>
  );
}