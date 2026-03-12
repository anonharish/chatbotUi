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
      <div className="flex flex-col gap-1 lg:gap-1.5 xl:gap-2 w-full">
        <span className="text-[11px] lg:text-[11px] xl:text-xs text-gray-500 font-medium">
          {label}
        </span>
        <input
          type={type}
          value={String(formData[field] ?? "")}
          onChange={(e) => handleChange(field, e.target.value)}
          className="border-b border-gray-400 pb-1 lg:pb-1.5 xl:pb-2 bg-transparent outline-none text-xs lg:text-xs xl:text-sm text-gray-800"
        />
      </div>
    );
  };

  return (
    <div
      className="
        px-4 pt-4 pb-8
        lg:px-6 lg:pt-5 lg:pb-10
        xl:px-10 xl:pt-8 xl:pb-16
        bg-white
        rounded-[24px] lg:rounded-[24px] xl:rounded-[32px]
        mt-2
      "
    >

      {/* PERSONAL DETAILS */}
      <h2
        className="
          text-gray-600 font-semibold
          text-sm lg:text-sm xl:text-base
          mb-4 lg:mb-4 xl:mb-8
        "
      >
        Personal Details
      </h2>

      <div
        className="
          grid grid-cols-2
          gap-x-8 gap-y-6
          lg:gap-x-10 lg:gap-y-6
          xl:gap-x-24 xl:gap-y-12
        "
      >
        <Field label="First Name" field="firstName" />
        <Field label="Last Name" field="lastName" />
        <Field label="Age" field="age" type="number" />
        <Field label="Phone Number" field="phone" />
      </div>

      {/* ALERTS */}
      <AlertsSection />

    </div>
  );
}