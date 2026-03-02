import { useState } from "react";
import { useNavigate } from "react-router";
import type { AgentProfile } from "../types/agentProfile.types";

type Props = {
  profile: AgentProfile;
};

const STATE_REGION_MAP: Record<string, string[]> = {
  "Andhra Pradesh": ["Godavari", "Krishna", "Rayalaseema"],
  Telangana: ["Hyderabad", "Warangal", "Karimnagar"],
  Karnataka: ["Bangalore", "Mysore", "Hubli"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai"],
  Maharashtra: ["Pune", "Mumbai", "Nagpur"]
};

export const AgentInfoSection = ({ profile }: Props) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState(profile);
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (key: keyof AgentProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("Enter valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const regions = STATE_REGION_MAP[formData.state] || [];

  return (
    <div className="combined-card px-8 py-6 space-y-10">

      {/* REGION */}
      <div>
        <h3 className="section-title">Region/Area Assigned</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 mt-6">

          <div>
            <label className="label">Select State</label>
            <select
              className="underline-field w-full"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
            >
              {Object.keys(STATE_REGION_MAP).map(state => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Select Region</label>
            <select
              className="underline-field w-full"
              value={formData.region}
              onChange={(e) => handleChange("region", e.target.value)}
            >
              {regions.map(region => (
                <option key={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Select Area</label>
            <input
              className="underline-field w-full"
              value={formData.area}
              onChange={(e) => handleChange("area", e.target.value)}
            />
          </div>

          {/* RO / IO moved up */}
          <div className="flex justify-end text-green-600 text-sm -mt-3">
            {formData.roOfficer || "RO: Jayanth kumar (GLC 0012)"} &nbsp; | &nbsp;
            {formData.ioOfficer || "IO: Jayanth kumar (GLC 0012)"}
          </div>

        </div>
      </div>

      <div className="divider" />

      {/* AGENT DETAILS */}
      <div>
        <h3 className="section-title">Enter Agents Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 mt-6">

          <div>
            <label className="label">First Name</label>
            <input
              className="underline-field w-full"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Last Name</label>
            <input
              className="underline-field w-full"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Age</label>
            <input
              type="number"
              className="underline-field w-full"
              value={formData.age}
              onChange={(e) => handleChange("age", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input
              className="underline-field w-full"
              value={formData.phone}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange("phone", value);
                validatePhone(value);
              }}
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1">{phoneError}</p>
            )}
          </div>

          {/* FO */}
          <div className="md:col-span-2 flex justify-end text-green-600 text-sm">
            {formData.foOfficer || "FO: Ram Verma (GLC 0019)"}
          </div>

        </div>
      </div>

      <div className="divider" />

      {/* DOCUMENTS */}
      <div>
        <h3 className="section-title">Documents & Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8 mt-6">

          {/* AADHAAR */}
          <div>
            <label className="label">Aadhar Card</label>
            <input
              className="underline-field w-full"
              value={formData.aadhaarNumber}
              onChange={(e) => handleChange("aadhaarNumber", e.target.value)}
            />

            <div className="flex gap-6 mt-5">

              <label className="flex flex-col items-center justify-center border rounded-xl cursor-pointer w-[90px] h-[90px]">
                <img src="/src/assets/icons/upload.png" className="w-6 h-6 mb-1" />
                <input type="file" className="hidden"
                  onChange={(e) => handleChange("aadhaarFrontFile", e.target.files?.[0]?.name)}
                />
                <span className="text-[10px] text-center">
                  {formData.aadhaarFrontFile || "Aadhar_Front.pdf"}
                </span>
              </label>

              <label className="flex flex-col items-center justify-center border rounded-xl cursor-pointer w-[90px] h-[90px]">
                <img src="/src/assets/icons/upload.png" className="w-6 h-6 mb-1" />
                <input type="file" className="hidden"
                  onChange={(e) => handleChange("aadhaarBackFile", e.target.files?.[0]?.name)}
                />
                <span className="text-[10px] text-center">
                  {formData.aadhaarBackFile || "Aadhar_Back.pdf"}
                </span>
              </label>

            </div>
          </div>

          {/* PAN */}
          <div>
            <label className="label">Pan Card</label>
            <input
              className="underline-field w-full"
              value={formData.panNumber}
              onChange={(e) => handleChange("panNumber", e.target.value)}
            />

            <div className="flex mt-5">
              <label className="flex flex-col items-center justify-center border rounded-xl cursor-pointer w-[90px] h-[90px]">
                <img src="/src/assets/icons/upload.png" className="w-6 h-6 mb-1" />
                <input type="file" className="hidden"
                  onChange={(e) => handleChange("panFile", e.target.files?.[0]?.name)}
                />
                <span className="text-[10px] text-center">
                  {formData.panFile || "Pan_Card.pdf"}
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="label">District</label>
            <input
              className="underline-field w-full"
              value={formData.district}
              onChange={(e) => handleChange("district", e.target.value)}
            />
          </div>

          <div>
            <label className="label">Pincode</label>
            <input
              className="underline-field w-full"
              value={formData.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end pt-4">
        <button
          disabled={!!phoneError}
          onClick={() => navigate("/profile-info")}
          className={`px-8 py-2 rounded-full font-medium transition
          ${phoneError ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          Save
        </button>
      </div>

    </div>
  );
};