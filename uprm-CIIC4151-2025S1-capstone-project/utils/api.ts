// TODO: Implement API utility functions here.

// A list of all the functions that interact with the backend API can be added here.
/**
 * A basic API structure operations in this project react expo app include:
 * 1. Fetching data from the backend.
 * 2. Submitting data to the backend.
 * 3. Updating existing data.
 * 4. Deleting data.
 * */

import { getToken } from "@/utils/auth"; // Make sure the path is correct

const API_BASE_URL = "http://192.168.0.2:5000"; // Replace with your actual backend URL

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

// 1. Fetch all reports
export async function fetchReports() {
  return request("/report");
}

// 2. Fetch single report by ID
export async function fetchReport(id: number) {
  return request(`/report/${id}`);
}

// 3. Create a new report
export async function createReport(data: any) {
  return request("/report", "POST", data);
}

// 4. Update a report
export async function updateReport(id: number, data: any) {
  return request(`/report/${id}`, "PUT", data);
}

// 5. Delete a report
export async function deleteReport(id: number) {
  return request(`/report/${id}`, "DELETE");
}

