// Full report from backend
export type ReportData = {
  id: number;
  title: string;
  description: string;
  department: string;
  status: "open" | "in_progress" | "resolved" | "denied";
  rating?: number;
  image_url?: string;
  created_at: string;
  resolved_at?: string;
  ocurred_on: string;
};

// Form submission type
export type ReportFormData = {
  title: string;
  description: string;
  department: string;
  ocurred_on: Date;
};
