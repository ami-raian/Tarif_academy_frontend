const API_BASE_URL =
  process.env.NEXT_PUBLIC_TARIFACADEMY_API_URL ||
  "http://localhost:5000/api/v1";

// Cookie utilities
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const ls = localStorage.getItem("accessToken");
  if (ls) return ls;
  return getCookie("accessToken");
}

// Get auth headers
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

// ========================
// AUTH API
// ========================

export async function loginStudent(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/student/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function getStudentProfile() {
  const response = await fetch(`${API_BASE_URL}/auth/student/me`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getAdminProfile() {
  const response = await fetch(`${API_BASE_URL}/auth/admin/me`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// ========================
// STUDENT REGISTRATION API
// ========================

export async function registerStudent(data: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/students/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

// ========================
// COURSES API
// ========================

export async function getCourses(params?: {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  isPublished?: boolean;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.category) searchParams.set("category", params.category);
  if (params?.level) searchParams.set("level", params.level);
  if (params?.isPublished !== undefined)
    searchParams.set("isPublished", params.isPublished.toString());

  const response = await fetch(
    `${API_BASE_URL}/courses?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

export async function getCourse(courseId: string) {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getCourseBySlug(slug: string) {
  const response = await fetch(`${API_BASE_URL}/courses/slug/${slug}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createCourse(data: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateCourse(
  courseId: string,
  data: Record<string, unknown>,
) {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function toggleCoursePublish(courseId: string) {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/publish`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function deleteCourse(courseId: string) {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response.json();
}

// ========================
// VIDEOS API
// ========================

export async function getCourseVideos(courseId: string) {
  const response = await fetch(`${API_BASE_URL}/videos/course/${courseId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getVideoStreamUrl(videoId: string) {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/stream`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function markVideoCompleted(videoId: string) {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/complete`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createVideo(data: {
  title: string;
  description?: string;
  courseId: string;
  sectionTitle: string;
  order: number;
  isFree?: boolean;
}) {
  const response = await fetch(`${API_BASE_URL}/videos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function uploadVideo(formData: FormData) {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/videos/upload`, {
    method: "POST",
    headers,
    body: formData,
  });
  return response.json();
}

export async function updateVideo(
  videoId: string,
  data: Record<string, unknown>,
) {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteVideo(videoId: string) {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function checkVideoEncodingStatus(videoId: string) {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}/status`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// ========================
// ENROLLMENT API
// ========================

export async function enrollInCourse(courseId: string) {
  const response = await fetch(`${API_BASE_URL}/enrollments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ courseId }),
  });
  return response.json();
}

export async function getMyEnrollments() {
  const response = await fetch(`${API_BASE_URL}/enrollments/my-courses`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function checkEnrollment(courseId: string) {
  const response = await fetch(
    `${API_BASE_URL}/enrollments/check/${courseId}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

export async function getCourseProgress(courseId: string) {
  const response = await fetch(
    `${API_BASE_URL}/enrollments/progress/${courseId}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// ========================
// SYNC API (Admin)
// ========================

export async function syncAllVideos() {
  const response = await fetch(`${API_BASE_URL}/webhooks/sync-all-videos`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return response.json();
}
