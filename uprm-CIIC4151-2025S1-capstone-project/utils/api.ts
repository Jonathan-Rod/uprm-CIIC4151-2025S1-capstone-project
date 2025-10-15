import { getToken } from "@/utils/auth";
import type { ReportFormData } from "@/types/interfaces"; // Import the correct type

export const API_BASE_URL = "http://192.168.4.49:5000"; // Replace with your actual backend URL

// Generic request wrapper with token support
async function request(endpoint: string, method = "GET", body?: any) {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

//
// REPORTS
//

// 1. Fetch paginated reports
export async function fetchReports(page?: number, limit?: number) {
  if (page && limit) {
    return request(`/reports?page=${page}&limit=${limit}`);
  } else {
    return request("/reports");
  }
}

// 2. Fetch single report by ID
export async function fetchReport(id: number) {
  return request(`/reports/${id}`);
}

// 3. Create a new report
export async function createReport(data: ReportFormData) {
  return request("/reports", "POST", data);
}

// 4. Update a report
export async function updateReport(id: number, data: any) {
  return request(`/reports/${id}`, "PUT", data);
}

// 5. Delete a report
export async function deleteReport(id: number) {
  return request(`/reports/${id}`, "DELETE");
}

//
// USERS
//

// 6. Login user
export async function loginUser(data: { email: string; password: string }) {
  return request("/login", "POST", data);
}

// 7. Register user
export async function registerUser(data: { email: string; password: string; admin: boolean }) {
  return request("/registration", "POST", data);
}

// 8. Get current user info
export async function fetchCurrentUser() {
  return request("/me");
}
