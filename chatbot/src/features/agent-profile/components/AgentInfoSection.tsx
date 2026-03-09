import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AgentProfile } from "../types/agentProfile.types";

type Role = "agent" | "fo" | "ro" | "io";

type Props = {
  profile: AgentProfile;
  role?: Role;
};

type FieldConfig = {
  label: string;
  key: keyof AgentProfile;
  type: string;
};

const ROLE_FORM_CONFIG: Record<Role, FieldConfig[]> = {
  agent: [
    { label: "First Name", key: "firstName", type: "text" },
    { label: "Last Name", key: "lastName", type: "text" },
    { label: "Age", key: "age", type: "number" },
    { label: "Phone Number", key: "phone", type: "text" }
  ],
  fo: [
    { label: "First Name", key: "firstName", type: "text" },
    { label: "Last Name", key: "lastName", type: "text" },
    { label: "Phone Number", key: "phone", type: "text" }
  ],
  ro: [
    { label: "Name", key: "firstName", type: "text" },
    { label: "Phone Number", key: "phone", type: "text" }
  ],
  io: [
    { label: "Name", key: "firstName", type: "text" },
    { label: "Phone Number", key: "phone", type: "text" }
  ]
};

export const AgentInfoSection = ({ profile, role = "agent" }: Props) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState(profile);

  const [aadhaarFront, setAadhaarFront] = useState("Aadhar_Front.pdf");
  const [aadhaarBack, setAadhaarBack] = useState("Aadhar_Back.pdf");
  const [panFile, setPanFile] = useState("Pan_Card.pdf");

  const uploadBoxStyle =
    "w-[110px] h-[110px] bg-white rounded-xl border shadow-sm flex flex-col items-center justify-center text-xs text-gray-500 cursor-pointer";

  const handleChange = (key: keyof AgentProfile, value: string | number) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  return (

    <div className="bg-[#F4F5F6] rounded-[40px] px-14 py-12 space-y-16 w-full">

      {/* REGION */}

      <div>

        <h3 className="text-[18px] font-bold text-[#4B4F52]">
          Region/Area Assigned
        </h3>

        <div className="grid grid-cols-2 gap-x-20 gap-y-14 mt-12">

          <div>
            <label className="text-sm font-bold text-gray-700">
              Select State
            </label>

            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Select Region
            </label>

            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
              value={formData.region || ""}
              onChange={(e) => handleChange("region", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Select Area
            </label>

            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
              value={formData.area || ""}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

        </div>

      </div>

      {/* AGENT DETAILS */}

      <div>

        <h3 className="text-[18px] font-bold text-[#4B4F52]">
          Enter Agent Details
        </h3>

        <div className="grid grid-cols-2 gap-x-20 gap-y-14 mt-12">

          {ROLE_FORM_CONFIG[role].map((field) => (

            <div key={field.key}>

              <label className="text-sm font-bold text-gray-700">
                {field.label}
              </label>

              <input
                type={field.type}
                className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
                value={String(formData[field.key] ?? "")}
                onChange={(e) =>
                  handleChange(
                    field.key,
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
              />

            </div>

          ))}

        </div>

      </div>

      {/* DOCUMENTS */}

      <div>

        <h3 className="text-[18px] font-bold text-[#4B4F52]">
          Documents & Details
        </h3>

        <div className="grid grid-cols-2 gap-x-20 gap-y-14 mt-12">

          {/* Aadhaar */}

          <div>

            <label className="text-sm font-bold text-gray-700">
              Aadhaar Card
            </label>

            <input
              placeholder="Aadhaar Card Number"
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
            />

            <div className="flex gap-6 mt-8">

              <label className={uploadBoxStyle}>

                <img src="/src/assets/icons/upload.png" className="w-6 mb-2" />

                {aadhaarFront}

                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setAadhaarFront(e.target.files?.[0]?.name || "")
                  }
                />

              </label>

              <label className={uploadBoxStyle}>

                <img src="/src/assets/icons/upload.png" className="w-6 mb-2" />

                {aadhaarBack}

                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setAadhaarBack(e.target.files?.[0]?.name || "")
                  }
                />

              </label>

            </div>

          </div>

          {/* PAN */}

          <div>

            <label className="text-sm font-bold text-gray-700">
              Pan Card
            </label>

            <input
              placeholder="Pan Card Number"
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
            />

            <div className="flex mt-8">

              <label className={uploadBoxStyle}>

                <img src="/src/assets/icons/upload.png" className="w-6 mb-2" />

                {panFile}

                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setPanFile(e.target.files?.[0]?.name || "")
                  }
                />

              </label>

            </div>

          </div>

          {/* District */}

          <div>

            <label className="text-sm font-bold text-gray-700">
              District
            </label>

            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
              value={formData.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
            />

          </div>

          {/* State */}

          <div>

            <label className="text-sm font-bold text-gray-700">
              State
            </label>

            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
            />

          </div>

          {/* Pincode */}

          <div>

            <label className="text-sm font-bold text-gray-700">
              Pincode
            </label>

            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3"
              value={formData.pincode || ""}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />

          </div>

        </div>

      </div>

      {/* BUTTONS */}

      <div className="flex justify-end gap-4 pt-6">

        <button className="px-6 py-2 border rounded-full text-gray-600">
          Cancel
        </button>

        <button
          onClick={() => navigate("/profile-info")}
          className="px-8 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Save Profile
        </button>

      </div>

    </div>

  );
};