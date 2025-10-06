// This is a mock list of reports
// It can add more reports after submissions

interface ReportData {
  title: string;
  description: string;
  date: string;
  lastSeen: string;
  department:
    | "infrastructure"
    | "energy_water"
    | "sanitation"
    | "environment_security";

  status: "created" | "in_review" | "open" | "in_progress" | "closed";
  created_at: string;
}

const mockReport: Record<string, ReportData> = {
  "report-1": {
    title: "Pothole on Main St",
    description:
      "There's a large pothole on Main St near the intersection with 2nd Ave.",
    date: "2023-10-01",
    lastSeen: "2023-10-02",
    department: "infrastructure",
    status: "open",
    created_at: "2023-10-01T12:00:00Z",
  },
  "report-2": {
    title: "Streetlight Out",
    description: "The streetlight in front of 123 Elm St is not working.",
    date: "2023-10-01",
    lastSeen: "2023-10-02",
    department: "infrastructure",
    status: "closed",
    created_at: "2023-10-01T12:00:00Z",
  },
};

// Function to add a new report to the mockReport dictionary
export function addReport(id: string, report: ReportData): void {
  mockReport[id] = report;
}

export default mockReport;
