export interface ReportCreateForm {
  building: string;
  floor: string;
  space: string;
  content: string;
  image: File | null;
}

export interface ReportSubmission {
  receiptNumber: string;
  building: string;
  floor: string;
  space: string;
  content: string;
}
