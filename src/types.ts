export interface ContractData {
  branch: string;
  instructorName: string;
  contractStartDate: string;
  contractEndDate: string;
  hourlyRate: string;
  outerHourlyRate: string;
  contractYear: string;
  contractMonth: string;
  contractDay: string;
  instructorAddress: string;
  instructorContact: string;
  instructorRrn: string;
  companyStamp: string | null;
  instructorSignature: string | null;
}

export interface CompanyContractData {
  branch: string;
  centerName: string;
  contractStartDate: string;
  contractEndDate: string;
  
  subject1: string; day1: string; time1: string;
  subject2: string; day2: string; time2: string;
  subject3: string; day3: string; time3: string;
  subject4: string; day4: string; time4: string;
  subject5: string; day5: string; time5: string;
  
  hourlyRate: string;
  paymentDay: string;
  
  contractYear: string;
  contractMonth: string;
  contractDay: string;
  
  companyBusinessNumber: string;
  companyAddress: string;
  companyRepresentative: string;
  companyContact: string;
  companyEmail: string;
  
  companySignature: string | null;
  janggoStamp: string | null;
}
