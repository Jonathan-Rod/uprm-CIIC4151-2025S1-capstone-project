// TODO: Implement API utility functions here.

// A list of all the functions that interact with the backend API can be added here.
/**
 * A basic API structure operations in this project react expo app include:
 * 1. Fetching data from the backend.
 * 2. Submitting data to the backend.
 * 3. Updating existing data.
 * 4. Deleting data.
 * */

const API_BASE_URL = "https://api.example.com"; // Replace with your actual API base URL

// Generic request wrapper
async function request(endpoint: string, method = "GET", body?: any) {
  const headers = {
    "Content-Type": "application/json",
    // Add auth token if needed
    // Authorization: `Bearer ${token}`,
  };

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
export async function createReport(data: any) {
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
