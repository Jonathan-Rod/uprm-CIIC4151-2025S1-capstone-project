import { Platform } from "react-native";
import type { ReportFormData } from "@/types/interfaces";
import { getStoredCredentials } from "@/utils/auth";

// =============================================================================
// BASE URL (per platform)
// =============================================================================
const getApiBaseUrl = () => {
  if (__DEV__) {
    console.log("Platform:", Platform.OS);

    // Android emulator -> host localhost
    if (Platform.OS === "android") {
      const androidUrl = "http://10.0.2.2:5000";
      console.log("Using Android URL:", androidUrl);
      return androidUrl;
    }

    // iOS simulator (adjust to your LAN IP)
    if (Platform.OS === "ios") {
      const iosUrl = "http://192.168.4.49:5000";
      console.log("Using iOS URL:", iosUrl);
      return iosUrl;
    }

    // Web
    const webUrl = "http://localhost:5000";
    console.log("Using Web URL:", webUrl);
    return webUrl;
  }

  // Production
  return "https://tu-api-real.com";
};

export const API_BASE_URL = getApiBaseUrl();

// =============================================================================
// REQUEST WRAPPER
// =============================================================================
async function request(endpoint: string, method = "GET", body?: any) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    console.log(`API Request: ${method} ${url}`);
    if (body) console.log("Request data:", body);

    const response = await fetch(url, options);
    console.log(`Response Status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 401)
        throw new Error("Authentication failed - Please log in again");
      if (response.status === 403) throw new Error("Access forbidden");
      if (response.status === 404) throw new Error("Resource not found");
      if (response.status >= 500) throw new Error("Server error");
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) return null;

    const data = await response.json();
    console.log("API Response Data:", data);
    return data;
  } catch (error: any) {
    console.error(`API Error for ${method} ${endpoint}:`, error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `Cannot connect to server at ${url}. Please check if the backend is running.`
      );
    }

    throw error;
  }
}

// =============================================================================
// AUTHENTICATION
// =============================================================================
export async function login(data: { email: string; password: string }) {
  const result = await request("/login", "POST", data);
  if (result && result.success) return result;
  throw new Error(result?.error_msg || "Login failed");
}

export async function logout() {
  return request("/logout", "POST");
}

export async function getSystemHealth() {
  return request("/system/health", "GET");
}

// =============================================================================
// USERS
// =============================================================================
export async function getUsers(page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  const query = params.toString();
  return request(`/users${query ? `?${query}` : ""}`);
}

export async function getUser(id: number) {
  return request(`/users/${id}`);
}

export async function createUser(data: {
  email: string;
  password: string;
  admin: boolean;
}) {
  const result = await request("/users", "POST", data);
  if (result && result.id) return result;
  throw new Error(result?.error_msg || "User creation failed");
}

export async function updateUser(id: number, data: any) {
  return request(`/users/${id}`, "PUT", data);
}

export async function deleteUser(id: number) {
  return request(`/users/${id}`, "DELETE");
}

// =============================================================================
// USER MANAGEMENT
// =============================================================================
export async function suspendUser(id: number) {
  return request(`/users/${id}/suspend`, "POST");
}

export async function unsuspendUser(id: number) {
  return request(`/users/${id}/unsuspend`, "POST");
}

export async function pinUser(id: number) {
  return request(`/users/${id}/pin`, "POST");
}

export async function unpinUser(id: number) {
  return request(`/users/${id}/unpin`, "POST");
}

export async function upgradeToAdmin(userId: number, code: string) {
  return request(`/users/${userId}/upgrade-admin`, "POST", { code });
}

// =============================================================================
// REPORTS
// =============================================================================
export async function getReports(
  page?: number,
  limit?: number,
  sort?: "asc" | "desc"
) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (sort) params.append("sort", sort); // ✅ NEW

  const query = params.toString();
  return request(`/reports${query ? `?${query}` : ""}`);
}

export async function getReport(id: number) {
  return request(`/reports/${id}`);
}

export async function createReport(data: ReportFormData) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");

  const reportData = {
    ...data,
    user_id: credentials.userId, // created_by on server
  };

  return request("/reports", "POST", reportData);
}

export async function updateReport(id: number, data: any) {
  return request(`/reports/${id}`, "PUT", data);
}

export async function deleteReport(id: number) {
  return request(`/reports/${id}`, "DELETE");
}

// =============================================================================
// REPORT ACTIONS
// =============================================================================
export async function validateReport(
  reportId: number,
  data: { admin_id: number }
) {
  return request(`/reports/${reportId}/validate`, "POST", data);
}

export async function resolveReport(
  reportId: number,
  data: { admin_id: number }
) {
  return request(`/reports/${reportId}/resolve`, "POST", data);
}

export async function rateReport(reportId: number, data: { rating: number }) {
  return request(`/reports/${reportId}/rate`, "POST", data);
}

// =============================================================================
// REPORT SEARCH & FILTER (with category + date sort)
// =============================================================================
export async function searchReports(
  query: string,
  status?: string,
  category?: string,
  page?: number,
  limit?: number,
  sort?: "asc" | "desc"
) {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (status) params.append("status", status);
  if (category) params.append("category", category);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (sort) params.append("sort", sort); // ✅ NEW LINE

  return request(`/reports/search?${params.toString()}`);
}

export async function filterReports(
  status?: string,
  category?: string,
  page?: number,
  limit?: number,
  sort?: "asc" | "desc"
) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (category) params.append("category", category);
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (sort) params.append("sort", sort); // ✅ NEW

  return request(`/reports/filter?${params.toString()}`);
}

export async function getUserReports(
  userId: number,
  page?: number,
  limit?: number
) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  return request(`/reports/user/${userId}?${params.toString()}`);
}

// =============================================================================
// LOCATIONS
// =============================================================================
export async function getLocations(page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  const query = params.toString();
  return request(`/locations${query ? `?${query}` : ""}`);
}

export async function getLocation(id: number) {
  return request(`/locations/${id}`);
}

export async function createLocation(data: {
  latitude: number;
  longitude: number;
}) {
  return request("/locations", "POST", data);
}

export async function updateLocation(id: number, data: any) {
  return request(`/locations/${id}`, "PUT", data);
}

export async function deleteLocation(id: number) {
  return request(`/locations/${id}`, "DELETE");
}

// =============================================================================
// LOCATION SEARCH & ANALYTICS
// =============================================================================
export async function getLocationsNearby(params: {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  searchParams.append("latitude", params.latitude.toString());
  searchParams.append("longitude", params.longitude.toString());
  if (params.radius) searchParams.append("radius", params.radius.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  return request(`/locations/nearby?${searchParams.toString()}`);
}

export async function getLocationsWithReports(page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  return request(`/locations/with-reports?${params.toString()}`);
}

export async function getLocationStats() {
  return request("/locations/stats");
}

export async function searchLocations(params?: {
  latitude?: number;
  longitude?: number;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.latitude)
    searchParams.append("latitude", params.latitude.toString());
  if (params?.longitude)
    searchParams.append("longitude", params.longitude.toString());
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  const query = searchParams.toString();
  return request(`/locations/search${query ? `?${query}` : ""}`);
}

// =============================================================================
// ADMINISTRATORS
// =============================================================================
export async function getAdministrators(page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  const query = params.toString();
  return request(`/administrators${query ? `?${query}` : ""}`);
}

export async function getAdministrator(id: number) {
  return request(`/administrators/${id}`);
}

export async function createAdministrator(data: {
  user_id: number;
  department: string;
}) {
  return request("/administrators", "POST", data);
}

export async function updateAdministrator(id: number, data: any) {
  return request(`/administrators/${id}`, "PUT", data);
}

export async function deleteAdministrator(id: number) {
  return request(`/administrators/${id}`, "DELETE");
}

// =============================================================================
// ADMINISTRATOR MANAGEMENT
// =============================================================================
export async function getAdministratorsByDepartment(department: string) {
  return request(`/administrators/department/${department}`);
}

export async function getAdministratorWithDetails(id: number) {
  return request(`/administrators/${id}/details`);
}

export async function getAvailableAdministrators() {
  return request("/administrators/available");
}

export async function checkUserIsAdministrator(userId: number) {
  return request(`/administrators/check/${userId}`);
}

export async function getAdministratorPerformanceReport(days?: number) {
  const params = new URLSearchParams();
  if (days) params.append("days", days.toString());
  const query = params.toString();
  return request(`/administrators/performance${query ? `?${query}` : ""}`);
}

// =============================================================================
// DEPARTMENTS
// =============================================================================
export async function getDepartments() {
  return request("/departments");
}

export async function getDepartment(name: string) {
  return request(`/departments/${name}`);
}

export async function createDepartment(data: {
  department: string;
  admin_id?: number;
}) {
  return request("/departments", "POST", data);
}

export async function updateDepartment(name: string, data: any) {
  return request(`/departments/${name}`, "PUT", data);
}

export async function deleteDepartment(name: string) {
  return request(`/departments/${name}`, "DELETE");
}

export async function getDepartmentAdmin(departmentName: string) {
  return request(`/departments/${departmentName}/admin`);
}

export async function assignDepartmentAdmin(
  departmentName: string,
  data: { admin_id: number }
) {
  return request(`/departments/${departmentName}/admin`, "POST", data);
}

export async function removeDepartmentAdmin(departmentName: string) {
  return request(`/departments/${departmentName}/admin`, "DELETE");
}

// =============================================================================
// DEPARTMENT MANAGEMENT
// =============================================================================
export async function getDepartmentsWithAdminInfo() {
  return request("/departments/with-admin-info");
}

export async function getDepartmentsByAdmin(adminId: number) {
  return request(`/departments/admin/${adminId}`);
}

export async function getAvailableDepartments() {
  return request("/departments/available");
}

export async function getDepartmentDetailedStats(departmentName: string) {
  return request(`/departments/${departmentName}/department-stats`);
}

export async function getAllDepartmentsStats() {
  return request("/departments/stats/all");
}

export async function checkAdminAssignment(
  adminId: number,
  departmentName: string
) {
  return request(`/departments/check-assignment/${adminId}/${departmentName}`);
}

// =============================================================================
// PINNED REPORTS (requires logged-in user)
// =============================================================================
export async function getPinnedReports(
  userId?: number,
  page?: number,
  limit?: number
) {
  if (!userId) {
    const credentials = await getStoredCredentials();
    if (!credentials) throw new Error("User not authenticated");
    userId = credentials.userId;
  }

  const params = new URLSearchParams();
  params.append("user_id", userId.toString());
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());

  const query = params.toString();
  return request(`/pinned-reports${query ? `?${query}` : ""}`);
}

export async function pinReport(data: { user_id: number; report_id: number }) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");
  if (data.user_id !== credentials.userId) throw new Error("User ID mismatch");
  return request("/pinned-reports", "POST", data);
}

export async function unpinReport(userId: number, reportId: number) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");
  if (userId !== credentials.userId) throw new Error("User ID mismatch");

  const params = new URLSearchParams();
  params.append("user_id", userId.toString());
  return request(`/pinned-reports/${reportId}?${params.toString()}`, "DELETE");
}

export async function getUserPinnedReports(
  userId: number,
  page?: number,
  limit?: number
) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");
  if (userId !== credentials.userId) throw new Error("User ID mismatch");

  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  return request(`/users/${userId}/pinned-reports?${params.toString()}`);
}

export async function checkPinnedStatus(userId: number, reportId: number) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");
  if (userId !== credentials.userId) throw new Error("User ID mismatch");
  return request(`/pinned-reports/check/${userId}/${reportId}`);
}

export async function getPinnedReportDetail(userId: number, reportId: number) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");
  if (userId !== credentials.userId) throw new Error("User ID mismatch");
  return request(`/pinned-reports/${userId}/${reportId}/details`);
}

// =============================================================================
// STATS & ADMIN
// =============================================================================
export async function getOverviewStats() {
  return request("/stats/overview");
}

export async function getDepartmentOverviewStats(department: string) {
  return request(`/stats/department/${department}`);
}

export async function getUserStats(userId: number) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");
  if (userId !== credentials.userId) throw new Error("User ID mismatch");
  return request(`/stats/user/${userId}`);
}

export async function getAdminStats(adminId: number) {
  return request(`/stats/admin/${adminId}`);
}

export async function getAllAdminStats() {
  return request("/administrators/stats/all");
}

// =============================================================================
// ADMIN DASHBOARD
// =============================================================================
export async function getAdminDashboard() {
  return request("/admin/dashboard");
}

export async function getPendingReports(page?: number, limit?: number) {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  const query = params.toString();
  return request(`/admin/reports/pending${query ? `?${query}` : ""}`);
}

export async function getAssignedReports(
  adminId: number,
  page?: number,
  limit?: number
) {
  const params = new URLSearchParams();
  params.append("admin_id", adminId.toString());
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  return request(`/admin/reports/assigned?${params.toString()}`);
}

// =============================================================================
// DEBUG
// =============================================================================
export async function testConnection() {
  console.log("Testing API connection to:", API_BASE_URL);
  try {
    const response = await fetch(`${API_BASE_URL}/`, { method: "GET" });
    console.log("Connection test successful, status:", response.status);
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
}

// =============================================================================
// TODO REPORT ACTIONS - MISSING ROUTES IN BACKEND (Later)
// =============================================================================

// TODO Add/Remove rating (like) to report
export async function toggleRating(
  reportId: number
): Promise<{ rating: number; rated: boolean }> {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");

  return request(`/reports/${reportId}/rate`, "POST", {
    user_id: credentials.userId,
  });
}

// TODO Check if user rated the report
export async function checkReportRated(
  reportId: number
): Promise<{ rated: boolean; rating: number }> {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");

  return request(
    `/reports/${reportId}/rating-status?user_id=${credentials.userId}`
  );
}

// TODO Get rating count for report
export async function getReportRating(
  reportId: number
): Promise<{ rating: number }> {
  return request(`/reports/${reportId}/rating`);
}

// TODO Check if report is pinned by current user
export async function checkReportPinned(
  reportId: number
): Promise<{ pinned: boolean }> {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");

  return request(
    `/reports/${reportId}/pinned-status?user_id=${credentials.userId}`
  );
}

// TODO Pin/Unpin report
export async function togglePinReport(reportId: number, pin: boolean) {
  const credentials = await getStoredCredentials();
  if (!credentials) throw new Error("User not authenticated");

  if (pin) {
    return request("/pinned-reports", "POST", {
      user_id: credentials.userId,
      report_id: reportId,
    });
  } else {
    return unpinReport(credentials.userId, reportId);
  }
}

// TODO Edit report (author only)
export async function editReport(
  reportId: number,
  data: {
    title?: string;
    description?: string;
    category?: string;
  }
) {
  return request(`/reports/${reportId}`, "PUT", data);
}

// TODO Admin status changes
export async function changeReportStatus(
  reportId: number,
  status: string,
  adminId: number
) {
  return request(`/reports/${reportId}/status`, "PUT", {
    status,
    admin_id: adminId,
  });
}

// TODO Get available status options (for admin)
export async function getStatusOptions() {
  return request("/reports/status-options");
}


// TODO Get location details with address
export async function getLocationDetails(locationId: number): Promise<{
  id: number;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}> {
  return request(`/locations/${locationId}/details`);
}