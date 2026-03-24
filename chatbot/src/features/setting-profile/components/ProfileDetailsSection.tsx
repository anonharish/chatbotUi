import { useState, useEffect } from "react";
import type { AgentProfile } from "@/features/agent-profile/types/agentProfile.types";
import AlertsSection from "./AlertsSection";

type Props = {
  profile: AgentProfile;
  isEditing?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
};

// ✅ Moved OUTSIDE the component — prevents re-mount on every keystroke
const ReadField = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex flex-col gap-1 lg:gap-1.5 xl:gap-2 w-full">
    <span className="text-[11px] lg:text-[11px] xl:text-xs text-gray-700 font-bold">
      {label}
    </span>
    <span className="border-b border-gray-400 pb-1 lg:pb-1.5 xl:pb-2 text-xs lg:text-xs xl:text-sm text-gray-800">
      {value ?? "-"}
    </span>
  </div>
);

// ✅ Moved OUTSIDE the component — prevents focus loss on every keystroke
const EditField = ({
  label,
  value,
  field,
  onChange,
}: {
  label: string;
  value?: string | number;
  field: string;
  onChange: (field: string, value: string) => void;
}) => (
  <div className="flex flex-col gap-1 lg:gap-1.5 xl:gap-2 w-full">
    <span className="text-[11px] lg:text-[11px] xl:text-xs text-gray-700 font-bold">
      {label}
    </span>
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(field, e.target.value)}
      className="
        border-b-2 border-gray-400 pb-1 lg:pb-1.5 xl:pb-2
        text-xs lg:text-xs xl:text-sm text-gray-800
        bg-white outline-none
        focus:border-blue-500
        caret-gray-800
        w-full transition-colors
        px-1
      "
    />
  </div>
);

export default function ProfileDetailsSection({
  profile,
  isEditing = false,
  onSave,
  onCancel,
}: Props) {

  const [editedProfile, setEditedProfile] = useState({
    firstName: profile.firstName,
    lastName:  profile.lastName,
    age:       profile.age,
    phone:     profile.phone,
  });

  // ✅ Reset edited fields to original when editing is turned off
  useEffect(() => {
    if (!isEditing) {
      setEditedProfile({
        firstName: profile.firstName,
        lastName:  profile.lastName,
        age:       profile.age,
        phone:     profile.phone,
      });
    }
  }, [isEditing, profile]);

  const handleChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
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
          text-gray-700 font-bold
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
        {isEditing ? (
          <>
            <EditField label="First Name"   value={editedProfile.firstName} field="firstName" onChange={handleChange} />
            <EditField label="Last Name"    value={editedProfile.lastName}  field="lastName"  onChange={handleChange} />
            <EditField label="Age"          value={editedProfile.age}       field="age"       onChange={handleChange} />
            <EditField label="Phone Number" value={editedProfile.phone}     field="phone"     onChange={handleChange} />
          </>
        ) : (
          <>
            <ReadField label="First Name"   value={profile.firstName} />
            <ReadField label="Last Name"    value={profile.lastName}  />
            <ReadField label="Age"          value={profile.age}       />
            <ReadField label="Phone Number" value={profile.phone}     />
          </>
        )}
      </div>

      {/* ALERTS */}
      <AlertsSection />

    </div>
  );
}