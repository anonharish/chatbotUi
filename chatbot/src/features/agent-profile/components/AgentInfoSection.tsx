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

// ✅ More states added
const STATE_OPTIONS = [
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Kerala",
  "Odisha",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
];

const REGION_OPTIONS: Record<string, string[]> = {
  "Andhra Pradesh": ["Godavari Region", "Krishna Region", "Rayalaseema Region"],
  "Telangana": ["Hyderabad Region", "Warangal Region", "Nizamabad Region"],
  "Karnataka": ["Bangalore Region", "Mysore Region", "Hubli Region"],
  "Tamil Nadu": ["Chennai Region", "Coimbatore Region", "Madurai Region"],
  "Maharashtra": ["Mumbai Region", "Pune Region", "Nagpur Region"],
  "Kerala": ["Thiruvananthapuram Region", "Kochi Region", "Kozhikode Region"],
  "Odisha": ["Bhubaneswar Region", "Cuttack Region", "Rourkela Region"],
  "Gujarat": ["Ahmedabad Region", "Surat Region", "Vadodara Region"],
  "Rajasthan": ["Jaipur Region", "Jodhpur Region", "Udaipur Region"],
  "Madhya Pradesh": ["Bhopal Region", "Indore Region", "Gwalior Region"],
};

const REGION_OFFICERS: Record<string, { ro: string; io: string; fo: string }> = {
  "Godavari Region":       { ro: "RO : Jayanth kumar (GLC 0012)", io: "IO : Jayanth kumar (GLC 0012)", fo: "FO : Ram Verma (GLC 0019)" },
  "Krishna Region":        { ro: "RO : Suresh kumar (GLC 0015)",  io: "IO : Priya Sharma (GLC 0016)",  fo: "FO : Ravi Verma (GLC 0020)" },
  "Rayalaseema Region":    { ro: "RO : Anil Kumar (GLC 0021)",    io: "IO : Meena Reddy (GLC 0022)",   fo: "FO : Kiran Babu (GLC 0023)" },
  "Hyderabad Region":      { ro: "RO : Ravi Teja (GLC 0024)",     io: "IO : Swathi Rao (GLC 0025)",    fo: "FO : Arjun Das (GLC 0026)" },
  "Warangal Region":       { ro: "RO : Mahesh Babu (GLC 0027)",   io: "IO : Sneha Lata (GLC 0028)",    fo: "FO : Pavan Kumar (GLC 0029)" },
  "Nizamabad Region":      { ro: "RO : Dinesh Rao (GLC 0030)",    io: "IO : Kavitha M (GLC 0031)",     fo: "FO : Srikanth V (GLC 0032)" },
  "Bangalore Region":      { ro: "RO : Karthik S (GLC 0033)",     io: "IO : Divya N (GLC 0034)",       fo: "FO : Mohan R (GLC 0035)" },
  "Mysore Region":         { ro: "RO : Sunil B (GLC 0036)",       io: "IO : Rekha P (GLC 0037)",       fo: "FO : Anand K (GLC 0038)" },
  "Hubli Region":          { ro: "RO : Prasad T (GLC 0039)",      io: "IO : Usha V (GLC 0040)",        fo: "FO : Naresh G (GLC 0041)" },
  "Chennai Region":        { ro: "RO : Senthil K (GLC 0042)",     io: "IO : Priya D (GLC 0043)",       fo: "FO : Bala M (GLC 0044)" },
  "Coimbatore Region":     { ro: "RO : Vijay R (GLC 0045)",       io: "IO : Nithya S (GLC 0046)",      fo: "FO : Selvan P (GLC 0047)" },
  "Madurai Region":        { ro: "RO : Murugan A (GLC 0048)",     io: "IO : Deepa L (GLC 0049)",       fo: "FO : Rajesh C (GLC 0050)" },
  "Mumbai Region":         { ro: "RO : Amit Shah (GLC 0051)",     io: "IO : Pooja M (GLC 0052)",       fo: "FO : Rohit V (GLC 0053)" },
  "Pune Region":           { ro: "RO : Nitin P (GLC 0054)",       io: "IO : Sneha K (GLC 0055)",       fo: "FO : Ajay B (GLC 0056)" },
  "Nagpur Region":         { ro: "RO : Suresh W (GLC 0057)",      io: "IO : Varsha T (GLC 0058)",      fo: "FO : Nilesh D (GLC 0059)" },
  "Thiruvananthapuram Region": { ro: "RO : Arun M (GLC 0060)",    io: "IO : Lekha S (GLC 0061)",       fo: "FO : Vijesh R (GLC 0062)" },
  "Kochi Region":          { ro: "RO : Biju T (GLC 0063)",        io: "IO : Anjali N (GLC 0064)",      fo: "FO : Shibu K (GLC 0065)" },
  "Kozhikode Region":      { ro: "RO : Faisal K (GLC 0066)",      io: "IO : Rema P (GLC 0067)",        fo: "FO : Sajeev M (GLC 0068)" },
  "Bhubaneswar Region":    { ro: "RO : Sanjay P (GLC 0069)",      io: "IO : Mamata D (GLC 0070)",      fo: "FO : Tapan S (GLC 0071)" },
  "Cuttack Region":        { ro: "RO : Bikash N (GLC 0072)",      io: "IO : Sarita M (GLC 0073)",      fo: "FO : Rajan K (GLC 0074)" },
  "Rourkela Region":       { ro: "RO : Deepak R (GLC 0075)",      io: "IO : Sunita B (GLC 0076)",      fo: "FO : Manoj T (GLC 0077)" },
  "Ahmedabad Region":      { ro: "RO : Chirag P (GLC 0078)",      io: "IO : Hetal S (GLC 0079)",       fo: "FO : Hardik M (GLC 0080)" },
  "Surat Region":          { ro: "RO : Nilesh V (GLC 0081)",      io: "IO : Komal J (GLC 0082)",       fo: "FO : Tejas R (GLC 0083)" },
  "Vadodara Region":       { ro: "RO : Darshan B (GLC 0084)",     io: "IO : Priti G (GLC 0085)",       fo: "FO : Yash P (GLC 0086)" },
  "Jaipur Region":         { ro: "RO : Vikram S (GLC 0087)",      io: "IO : Meena R (GLC 0088)",       fo: "FO : Gopal V (GLC 0089)" },
  "Jodhpur Region":        { ro: "RO : Bharat M (GLC 0090)",      io: "IO : Sunita K (GLC 0091)",      fo: "FO : Ramesh D (GLC 0092)" },
  "Udaipur Region":        { ro: "RO : Arjun L (GLC 0093)",       io: "IO : Chanda N (GLC 0094)",      fo: "FO : Sohan P (GLC 0095)" },
  "Bhopal Region":         { ro: "RO : Ajay T (GLC 0096)",        io: "IO : Radha S (GLC 0097)",       fo: "FO : Vinod K (GLC 0098)" },
  "Indore Region":         { ro: "RO : Sachin M (GLC 0099)",      io: "IO : Pallavi R (GLC 0100)",     fo: "FO : Rahul G (GLC 0101)" },
  "Gwalior Region":        { ro: "RO : Manish B (GLC 0102)",      io: "IO : Pooja T (GLC 0103)",       fo: "FO : Suresh L (GLC 0104)" },
};

// ✅ Reusable dropdown wrapper with arrow
const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    {children}
    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </div>
);

export const AgentInfoSection = ({
  profile,
  role = "agent",
  roleLabel = "Agent",
}: Props) => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState(profile);

  const [selectedState, setSelectedState] = useState("Andhra Pradesh");
  const [selectedRegion, setSelectedRegion] = useState(
    profile.region || "Godavari Region"
  );
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
    "w-full border-b border-gray-400 bg-transparent py-2 mt-3 appearance-none cursor-pointer focus:outline-none pr-8";

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
            <SelectWrapper>
              <select
                className={selectClass}
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedRegion(REGION_OPTIONS[e.target.value]?.[0] || "");
                  setSelectedArea("");
                  handleChange("state", e.target.value);
                }}
              >
                {STATE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </SelectWrapper>
          </div>

          {/* Select Region */}
          <div>
            <label className="text-sm font-bold text-gray-700">Select Region</label>
            <SelectWrapper>
              <select
                className={selectClass}
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedArea("");
                  handleChange("region", e.target.value);
                }}
              >
                {(REGION_OPTIONS[selectedState] || []).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </SelectWrapper>

            {officers && (
              <div className="flex items-center gap-4 mt-3">
                <span className="text-green-600 text-xs font-medium">{officers.ro}</span>
                <span className="text-gray-400 text-xs">|</span>
                <span className="text-green-600 text-xs font-medium">{officers.io}</span>
              </div>
            )}
          </div>

          {/* Select Area — now a plain text input, no dropdown */}
          <div>
            <label className="text-sm font-bold text-gray-700">Select Area</label>
            <input
              type="text"
              className="w-full border-b border-gray-400 bg-transparent py-2 mt-3 focus:outline-none"
              value={selectedArea}
              placeholder="Enter area"
              onChange={(e) => {
                setSelectedArea(e.target.value);
                handleChange("area", e.target.value);
              }}
            />

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
                  field.key === "lastName"  ? "E.g. Verma"   :
                  field.key === "age"       ? "32"            :
                  field.key === "phone"     ? "+91 912-456-7890" : ""
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

          {/* State — read only */}
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