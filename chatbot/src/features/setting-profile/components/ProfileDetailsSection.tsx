import { useState } from "react";
import type { AgentProfile } from "@/features/agent-profile/types/agentProfile.types";
import AlertsSection from "./AlertsSection";

type Props = {
  profile: AgentProfile;
  isEditing?: boolean;
  onSave?: () => void;
};

export default function ProfileDetailsSection({ profile, isEditing = false, onSave }: Props) {

  const [editedProfile, setEditedProfile] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    age: profile.age,
    phone: profile.phone,
  });

  const handleChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saved profile:", editedProfile);
    onSave?.();
  };

  const ReadField = ({
    label,
    value,
  }: {
    label: string;
    value?: string | number;
  }) => (
    <div className="flex flex-col gap-1 lg:gap-1.5 xl:gap-2 w-full">
      <span className="text-[11px] lg:text-[11px] xl:text-xs text-gray-700 font-bold"> {/* ← font-bold */}
        {label}
      </span>
      <span className="border-b border-gray-400 pb-1 lg:pb-1.5 xl:pb-2 text-xs lg:text-xs xl:text-sm text-gray-800">
        {value ?? "-"}
      </span>
    </div>
  );

  const EditField = ({
    label,
    value,
    field,
  }: {
    label: string;
    value?: string | number;
    field: string;
  }) => (
    <div className="flex flex-col gap-1 lg:gap-1.5 xl:gap-2 w-full">
      <span className="text-[11px] lg:text-[11px] xl:text-xs text-gray-700 font-bold"> {/* ← font-bold */}
        {label}
      </span>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className="
          border-b border-gray-400 pb-1 lg:pb-1.5 xl:pb-2
          text-xs lg:text-xs xl:text-sm text-gray-800
          bg-transparent outline-none focus:border-gray-600
          w-full transition-colors
        "
      />
    </div>
  );

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
            <EditField label="First Name"   value={editedProfile.firstName} field="firstName" />
            <EditField label="Last Name"    value={editedProfile.lastName}  field="lastName"  />
            <EditField label="Age"          value={editedProfile.age}       field="age"        />
            <EditField label="Phone Number" value={editedProfile.phone}     field="phone"      />
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

      {/* SAVE BUTTON — below alerts, only visible in edit mode */}
      {isEditing && (
        <div className="flex justify-end mt-6 lg:mt-8 xl:mt-10">
          <button
            onClick={handleSave}
            className="
              bg-blue-600 text-white font-medium rounded-full
              px-8 py-2
              lg:px-10 lg:py-2.5
              xl:px-14 xl:py-3
              text-xs lg:text-sm xl:text-base
              hover:bg-blue-700 transition-colors
            "
          >
            Save
          </button>
        </div>
      )}

    </div>
  );
}