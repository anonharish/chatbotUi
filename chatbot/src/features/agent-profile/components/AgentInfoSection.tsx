import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AgentProfile } from "../types/agentProfile.types";

type Role = "agent" | "fo" | "ro" | "io";

type Props = {
  profile: AgentProfile;
  role?: Role;
  roleLabel?: string;
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
    { label: "Phone Number", key: "phone", type: "text" },
  ],
  fo: [
    { label: "First Name", key: "firstName", type: "text" },
    { label: "Last Name", key: "lastName", type: "text" },
    { label: "Phone Number", key: "phone", type: "text" },
  ],
  ro: [
    { label: "Name", key: "firstName", type: "text" },
    { label: "Phone Number", key: "phone", type: "text" },
  ],
  io: [
    { label: "Name", key: "firstName", type: "text" },
    { label: "Phone Number", key: "phone", type: "text" },
  ],
};

// ✅ Dropdown data
const STATE_OPTIONS = [
  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra",
];

const REGION_OPTIONS: Record<string, string[]> = {
  "Andhra Pradesh": ["Godavari Region", "Krishna Region", "Rayalaseema Region"],
  "Telangana": ["Hyderabad Region", "Warangal Region"],
  "Karnataka": ["Bangalore Region", "Mysore Region"],
  "Tamil Nadu": ["Chennai Region", "Coimbatore Region"],
  "Maharashtra": ["Mumbai Region", "Pune Region"],
};

const AREA_OPTIONS: Record<string, string[]> = {
  "Godavari Region": ["Tanuka Area", "Rajahmundry Area", "Kakinada Area"],
  "Krishna Region": ["Vijayawada Area", "Machilipatnam Area"],
  "Rayalaseema Region": ["Kurnool Area", "Tirupati Area"],
};

// ✅ Mock officer data per region
const REGION_OFFICERS: Record<string, { ro: string; io: string; fo: string }> = {
  "Godavari Region": {
    ro: "RO : Jayanth kumar (GLC 0012)",
    io: "IO : Jayanth kumar (GLC 0012)",
    fo: "FO : Ram Verma (GLC 0019)",
  },
  "Krishna Region": {
    ro: "RO : Suresh kumar (GLC 0015)",
    io: "IO : Priya Sharma (GLC 0016)",
    fo: "FO : Ravi Verma (GLC 0020)",
  },
};

export const AgentInfoSection = ({
  profile,
  role = "agent",
  roleLabel = "Agent",
}: Props) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState(profile);

  const [selectedState, setSelectedState] = useState(profile.state || "Andhra Pradesh");
  const [selectedRegion, setSelectedRegion] = useState(profile.region || "Godavari Region");
  const [selectedArea, setSelectedArea] = useState(profile.area || "");

  const [aadhaarFront, setAadhaarFront] = useState("Aadhar_Front.pdf");
  const [aadhaarBack, setAadhaarBack] = useState("Aadhar_Back.pdf");
  const [panFile, setPanFile] = useState("Pan_Card.pdf");

  const uploadBoxStyle =
    "w-[110px] h-[110px] bg-white rounded-xl border shadow-sm flex flex-col items-center justify-center text-xs text-gray-500 cursor-pointer";

  const handleChange = (key: keyof AgentProfile, value: string | number) => {
    setFormData({ ...formData, [key]: value });
  };

  const officers = REGION_OFFICERS[selectedRegion];

  const selectClass =
    "w-full border-b border-gray-400 bg-transparent py-2 mt-3 appearance-none cursor-pointer focus:outline-none";

  return (
    <div className="bg-[#F4F5F6] rounded-[40px] px-14 py-12 space-y-16 w-full">

      {/* REGION */}
      <div>
        <h3 className="text-[18px] font-bold text-[#4B4F52]">
          Region/Area Assigned
        </h3>

        <div className="grid grid-cols-2 gap-x-20 gap-y-10 mt-12">

          {/* Select State */}
          <div>
            <label className="text-sm font-bold text-gray-700">Select State</label>
            <div className="relative">
              <select
                className={selectClass}
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedRegion("");
                  setSelectedArea("");
                  handleChange("state", e.target.value);
                }}
              >
                {STATE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Select Region */}
          <div>
            <label className="text-sm font-bold text-gray-700">Select Region</label>
            <div className="relative">
              <select
                className={selectClass}
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedArea("");
                  handleChange("region", e.target.value);
                }}
              >
                <option value="">-- Select Region --</option>
                {(REGION_OPTIONS[selectedState] || []).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* ✅ Green officer text — RO and IO side by side */}
            {officers && (
              <div className="flex items-center gap-4 mt-3">
                <span className="text-green-600 text-xs font-medium">{officers.ro}</span>
                <span className="text-gray-400 text-xs">|</span>
                <span className="text-green-600 text-xs font-medium">{officers.io}</span>
              </div>
            )}
          </div>

          {/* Select Area */}
          <div>
            <label className="text-sm font-bold text-gray-700">Select Area</label>
            <div className="relative">
              <select
                className={selectClass}
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  handleChange("area", e.target.value);
                }}
              >
                <option value="">-- Select Area --</option>
                {(AREA_OPTIONS[selectedRegion] || []).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* ✅ Green FO text below area */}
            {officers && (
              <div className="mt-3">
                <span className="text-green-600 text-xs font-medium">{officers.fo}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* AGENT DETAILS */}
      <div>
        <h3 className="text-[18px] font-bold text-[#4B4F52]">
          Enter {roleLabel} Details
        </h3>

        <div className="grid grid-cols-2 gap-x-20 gap-y-14 mt-12">
          {(ROLE_FORM_CONFIG[role] ?? ROLE_FORM_CONFIG["agent"]).map((field) => (
            <div key={field.key}>
              <label className="text-sm font-bold text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                className="w-full border-b border-gray-400 bg-transparent py-2 mt-3 focus:outline-none"
                value={String(formData[field.key] ?? "")}
                placeholder={
                  field.key === "firstName" ? "E.g. Kishore" :
                  field.key === "lastName" ? "E.g. Verma" :
                  field.key === "age" ? "32" :
                  field.key === "phone" ? "+91 912-456-7890" : ""
                }
                onChange={(e) =>
                  handleChange(
                    field.key,
                    field.type === "number" ? Number(e.target.value) : e.target.value
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
            <label className="text-sm font-bold text-gray-700">Aadhaar Card</label>
            <input
              placeholder="Aadhaar Card Number"
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3 focus:outline-none"
            />
            <div className="flex gap-6 mt-8">
              <label className={uploadBoxStyle}>
                <img src="/src/assets/icons/upload.png" className="w-6 mb-2" />
                {aadhaarFront}
                <input type="file" hidden onChange={(e) => setAadhaarFront(e.target.files?.[0]?.name || "")} />
              </label>
              <label className={uploadBoxStyle}>
                <img src="/src/assets/icons/upload.png" className="w-6 mb-2" />
                {aadhaarBack}
                <input type="file" hidden onChange={(e) => setAadhaarBack(e.target.files?.[0]?.name || "")} />
              </label>
            </div>
          </div>

          {/* PAN */}
          <div>
            <label className="text-sm font-bold text-gray-700">Pan Card</label>
            <input
              placeholder="Pan Card Number"
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3 focus:outline-none"
            />
            <div className="flex mt-8">
              <label className={uploadBoxStyle}>
                <img src="/src/assets/icons/upload.png" className="w-6 mb-2" />
                {panFile}
                <input type="file" hidden onChange={(e) => setPanFile(e.target.files?.[0]?.name || "")} />
              </label>
            </div>
          </div>

          {/* District */}
          <div>
            <label className="text-sm font-bold text-gray-700">District</label>
            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3 focus:outline-none"
              value={formData.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
            />
          </div>

          {/* State */}
          <div>
            <label className="text-sm font-bold text-gray-700">State</label>
            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3 focus:outline-none"
              value={selectedState}
              readOnly
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="text-sm font-bold text-gray-700">Pincode</label>
            <input
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3 focus:outline-none"
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