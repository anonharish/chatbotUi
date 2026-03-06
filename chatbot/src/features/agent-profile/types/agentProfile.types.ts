export interface AgentProfile {
  state: string;
  region: string;
  area: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  district: string;
  pincode: string;

  aadhaarFrontFile?: string;
  aadhaarBackFile?: string;
  panFile?: string;

  roOfficer?: string;
  ioOfficer?: string;
  foOfficer?: string;

  photo?: string;
  verified?: boolean;
}
