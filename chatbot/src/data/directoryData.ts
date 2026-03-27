export type Agent = {
  name: string;
  sub: string;
  image: string;
};

export type Officer = {
  name: string;
  sub: string;
  image: string;
  agents: Agent[]; 
};

export type Role = {
  name: string;
  sub: string;
  contact: string;
  image: string;
};


export const roles: Role[] = [
  {
    name: "Ram Verma - Regional Officer",
    sub: "Role ID - AG00049",
    contact: "91 982-902-5254",
    image: "/src/assets/profiles/profile1.png",
  },
  {
    name: "Ram Verma - Intelligence Officer",
    sub: "Role ID - AG00049",
    contact: "91 982-902-5254",
    image: "/src/assets/profiles/profile2.png",
  },
];


export const officers: Officer[] = [
  {
    name: "Satish Kumar",
    sub: "FO0113",
    image: "/src/assets/profiles/profile3.png",
    agents: [
      { name: "Satish Kumar", sub: "AG0113", image: "/src/assets/profiles/profile7.png" },
      { name: "Ram Verma", sub: "AG0113", image: "/src/assets/profiles/profile8.png" },
      { name: "Satish Kumar", sub: "AG0113", image: "/src/assets/profiles/profile9.png" },
      { name: "Ram Verma", sub: "AG0113", image: "/src/assets/profiles/profile5.png" },
    ],
  },
  {
    name: "Ram Verma",
    sub: "FO0113",
    image: "/src/assets/profiles/profile4.png",
    agents: [
      { name: "Agent Alpha", sub: "AG0201", image: "/src/assets/profiles/profile7.png" },
      { name: "Agent Beta", sub: "AG0202", image: "/src/assets/profiles/profile8.png" },
      { name: "Agent Gamma", sub: "AG0203", image: "/src/assets/profiles/profile9.png" },
      { name: "Agent Beta", sub: "AG0202", image: "/src/assets/profiles/profile8.png" },
    ],
  },
  {
    name: "Satish Kumar",
    sub: "FO0113",
    image: "/src/assets/profiles/profile5.png",
    agents: [
      { name: "Field Agent X", sub: "AG0301", image: "/src/assets/profiles/profile7.png" },
      { name: "Field Agent Y", sub: "AG0302", image: "/src/assets/profiles/profile8.png" },
      { name: "Field Agent Z", sub: "AG0303", image: "/src/assets/profiles/profile9.png" },
      { name: "Field Agent X", sub: "AG0301", image: "/src/assets/profiles/profile7.png" },
    ],
  },
  {
    name: "Ram Verma",
    sub: "FO0113",
    image: "/src/assets/profiles/profile6.png",
    agents: [
      { name: "Special Agent 1", sub: "AG0401", image: "/src/assets/profiles/profile7.png" },
      { name: "Special Agent 2", sub: "AG0402", image: "/src/assets/profiles/profile8.png" },
      { name: "Special Agent 3", sub: "AG0401", image: "/src/assets/profiles/profile7.png" },
      { name: "Special Agent 4", sub: "AG0402", image: "/src/assets/profiles/profile8.png" },
    ],
  },
];
export interface RoleData {
  title: string;
  desc: string;
  tag: string;
  img: string;
}

export const roleCards: RoleData[] = [
  {
    title: "Regional Officer",
    desc: "Oversees territory strategy and approves final land acquisitions.",
    tag: "Approval Authority",
    img: "/src/assets/create-role/regional-officer.png",
  },
  {
    title: "Intelligence Officer",
    desc: "Validates documentation and ensures all assets are risk-free.",
    tag: "Risk Assessment",
    img: "/src/assets/create-role/intelligence-officer.png",
  },
  {
    title: "Field Officer",
    desc: "Conducts physical inspections to verify boundaries and reality.",
    tag: "Physical Verification",
    img: "/src/assets/create-role/field-officer.png",
  },
  {
    title: "Agent",
    desc: "Sources new land opportunities and drives the deal pipeline.",
    tag: "Deal Sourcing",
    img: "/src/assets/create-role/agent.png",
  },
]

export const lineData = [
  { m: "Jan", v: 200 },
  { m: "Feb", v: 260 },
  { m: "Mar", v: 210 },
  { m: "Apr", v: 340 },
  { m: "May", v: 240 },
  { m: "Jun", v: 290 },
  { m: "Jul", v: 250 },
];

export const barData = [
  { n: "R.O.", v: 120 },
  { n: "I.O.", v: 140 },
  { n: "F.O.", v: 320 },
  { n: "Agents", v: 450 },
];

// directoryData.tsx

export interface Performer {
  name: string;
  value: number;
  image: string;
}

export const performersData: Performer[] = [
  { name: "Sam",   value: 45, image: "https://i.pravatar.cc/100?img=1" },
  { name: "Rig",   value: 22, image: "https://i.pravatar.cc/100?img=2" },
  { name: "Amy",   value: 10, image: "https://i.pravatar.cc/100?img=3" },
  { name: "Sunny", value: 18, image: "https://i.pravatar.cc/100?img=4" },
  { name: "Ben",   value: 12, image: "https://i.pravatar.cc/100?img=5" },
  { name: "Sam",   value: 42, image: "https://i.pravatar.cc/100?img=6" },
  { name: "Rig",   value: 15, image: "https://i.pravatar.cc/100?img=7" },
  { name: "Amy",   value: 14, image: "https://i.pravatar.cc/100?img=8" },
  { name: "Sunny", value: 58, image: "https://i.pravatar.cc/100?img=9" },
  { name: "Ben",   value: 12, image: "https://i.pravatar.cc/100?img=10" },
  { name: "Sam",   value: 10, image: "https://i.pravatar.cc/100?img=11" },
  { name: "Rig",   value: 75, image: "https://i.pravatar.cc/100?img=12" },
];

// filters
export const stateOptions = ["Select State", "AP", "TS"];
export const districtOptions = ["Select District", "Krishna", "Guntur"];
export const areaOptions = ["Select Area", "Urban", "Rural"];


// ─── Sales Report Data ────────────────────────────────────────────────────────

export interface SalesData {
  location: string;
  target:   number; // in Lakhs (L) or Crores (CR)
  actual:   number;
}

export interface SalesMonthData {
  [key: string]: SalesData[];
}

export const salesReportData: SalesMonthData = {
  "This Month": [
    { location: "Tanuku",    target: 2500, actual: 1625 },
    { location: "Attili",    target: 2500, actual: 2000 },
    { location: "Palakollu", target: 2500, actual: 2250 },
    { location: "Rajole",    target: 2500, actual: 1375 },
    { location: "Eluru",     target: 2500, actual: 2375 },
  ],
  "Last Month": [
    { location: "Tanuku",    target: 2500, actual: 1800 },
    { location: "Attili",    target: 2500, actual: 1500 },
    { location: "Palakollu", target: 2500, actual: 2100 },
    { location: "Rajole",    target: 2500, actual: 900  },
    { location: "Eluru",     target: 2500, actual: 2400 },
  ],
  "This Year": [
    { location: "Tanuku",    target: 2500, actual: 2000 },
    { location: "Attili",    target: 2500, actual: 2200 },
    { location: "Palakollu", target: 2500, actual: 2500 },
    { location: "Rajole",    target: 2500, actual: 1700 },
    { location: "Eluru",     target: 2500, actual: 2450 },
  ],
};

export const salesFilterOptions = ["This Month", "Last Month", "This Year"];

// Y-axis labels for the chart
export const salesYLabels = ["25 CR", "1 CR", "50L", "25L"];

// ─── Website Visitors Data ────────────────────────────────────────────────────

export interface VisitorDataPoint {
  month: string;
  value: number;
}

export const websiteVisitorsData: VisitorDataPoint[] = [
  { month: "Jan", value: 25000 },
  { month: "Feb", value: 28000 },
  { month: "Mar", value: 22000 },
  { month: "Apr", value: 35000 },
  { month: "May", value: 37000 },
  { month: "Jun", value: 30000 },
];

export const peakPoint = { index: 4, label: "37K Visitors" };