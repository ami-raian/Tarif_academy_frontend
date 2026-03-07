const API_BASE_URL =
  process.env.NEXT_PUBLIC_TARIFACADEMY_API_URL ||
  "http://localhost:5000/api/v1";

// Get backend base URL (without /api/v1)
export function getBackendUrl(): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_TARIFACADEMY_API_URL ||
    "http://localhost:5000/api/v1";
  return baseUrl.replace(/\/api\/v1/i, "");
}

// Get full thumbnail URL (returns default if no thumbnail or invalid path)
export function getThumbnailUrl(thumbnail: string | undefined): string {
  const fallback = "/default-course-thumbnail.png";
  if (!thumbnail) return fallback;

  const value = thumbnail.trim().replace(/\\/g, "/");
  if (!value) return fallback;

  if (/^(data:|blob:|https?:\/\/)/i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;

  if (value.startsWith("/uploads/") || value.startsWith("uploads/")) {
    return `${getBackendUrl()}${value.startsWith("/") ? value : `/${value}`}`;
  }

  if (value.startsWith("/")) return value;
  return `${getBackendUrl()}/${value.replace(/^\/+/, "")}`;
}

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

export async function updateStudentProfile(data: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/auth/student/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
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
  categoryId?: string;
  category?: string;
  level?: string;
  isPublished?: boolean;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.level) searchParams.set("level", params.level);
  if (params?.isPublished !== undefined)
    searchParams.set("isPublished", params.isPublished.toString());

  const response = await fetch(
    `${API_BASE_URL}/courses?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
      cache: "no-store", // For Next.js server components
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch courses: ${response.statusText}`);
  }

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

export async function uploadCourseThumbnail(courseId: string, file: File) {
  const formData = new FormData();
  formData.append("thumbnail", file);

  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/thumbnail`,
    {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    },
  );
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

// Create enrollment with payment info
export async function createEnrollment(data: {
  courseId: string;
  paymentAmount: number;
  transactionId?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/enrollments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Admin: Get all enrollments
export async function getAllEnrollments(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/enrollments/admin/all?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Admin: Approve enrollment
export async function approveEnrollment(enrollmentId: string) {
  const response = await fetch(
    `${API_BASE_URL}/enrollments/${enrollmentId}/approve`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Admin: Reject enrollment
export async function rejectEnrollment(enrollmentId: string, reason?: string) {
  const response = await fetch(
    `${API_BASE_URL}/enrollments/${enrollmentId}/reject`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
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

// ========================
// MCQ EXAM API
// ========================

// Types
export interface McqOption {
  text: string;
  isCorrect?: boolean;
}

export interface McqQuestion {
  _id: string;
  examId: string;
  questionText: string;
  options: McqOption[];
  marks: number;
  order: number;
}

export interface McqExam {
  _id: string;
  title: string;
  description?: string;
  courseId?: { _id: string; title: string } | string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: number; // marks to deduct per wrong answer (0 means no negative marking)
  isPublished: boolean;
  isResultPublished: boolean;
  hasAccessCode?: boolean; // true if exam requires an access code
  accessCode?: string; // only present in admin responses
  startTime?: string;
  endTime?: string;
  createdBy?: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIndex: number | null;
  isCorrect?: boolean;
  marksObtained?: number;
}

export interface McqSubmission {
  _id: string;
  examId: McqExam | string;
  studentId:
    | { _id: string; roll?: string; fullName: string; email: string }
    | string;
  answers: StudentAnswer[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt?: string;
  isAutoSubmitted: boolean;
  status: "in_progress" | "submitted" | "evaluated";
}

// Admin: Get all exams
export async function getMcqExams(params?: {
  page?: number;
  limit?: number;
  isPublished?: boolean;
  isResultPublished?: boolean;
  search?: string;
  courseId?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.isPublished !== undefined)
    searchParams.set("isPublished", params.isPublished.toString());
  if (params?.isResultPublished !== undefined)
    searchParams.set("isResultPublished", params.isResultPublished.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.courseId) searchParams.set("courseId", params.courseId);

  const response = await fetch(
    `${API_BASE_URL}/mcq/exams?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Student: Get published exams
export async function getPublishedMcqExams(params?: {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.courseId) searchParams.set("courseId", params.courseId);

  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/published?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Get single exam (Admin)
export async function getMcqExam(examId: string) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// Get single exam (Student - Published only)
export async function getMcqExamForStudent(examId: string) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/published/${examId}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Admin: Create exam
export async function createMcqExam(data: {
  title: string;
  description?: string;
  courseId?: string;
  duration: number;
  passingMarks: number;
  negativeMarking?: number;
  accessCode?: string;
  startTime?: string;
  endTime?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Admin: Update exam
export async function updateMcqExam(
  examId: string,
  data: {
    title?: string;
    description?: string;
    duration?: number;
    passingMarks?: number;
    negativeMarking?: number;
    accessCode?: string;
    startTime?: string;
    endTime?: string;
  },
) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Admin: Delete exam
export async function deleteMcqExam(examId: string) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response.json();
}

// Admin: Toggle publish
export async function toggleMcqExamPublish(examId: string) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}/publish`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return response.json();
}

// Admin: Publish results
export async function publishMcqResults(examId: string) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/publish-results`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Admin: Unpublish results
export async function unpublishMcqResults(examId: string) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/unpublish-results`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// ========================
// MCQ QUESTION API
// ========================

// Admin: Get questions with answers
export async function getMcqQuestions(examId: string) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/questions`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Student: Get questions without answers
export async function getMcqQuestionsForStudent(examId: string) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/questions/student`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Admin: Create question
export async function createMcqQuestion(data: {
  examId: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  marks?: number;
  order?: number;
}) {
  const response = await fetch(`${API_BASE_URL}/mcq/questions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Admin: Update question
export async function updateMcqQuestion(
  questionId: string,
  data: {
    questionText?: string;
    options?: { text: string; isCorrect: boolean }[];
    marks?: number;
    order?: number;
  },
) {
  const response = await fetch(`${API_BASE_URL}/mcq/questions/${questionId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Admin: Delete question
export async function deleteMcqQuestion(questionId: string) {
  const response = await fetch(`${API_BASE_URL}/mcq/questions/${questionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response.json();
}

// Admin: Bulk create questions
export async function bulkCreateMcqQuestions(
  examId: string,
  questions: {
    questionText: string;
    options: { text: string; isCorrect: boolean }[];
    marks?: number;
  }[],
) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/questions/bulk`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ questions }),
    },
  );
  return response.json();
}

// ========================
// MCQ SUBMISSION API
// ========================

// Student: Start exam
export async function verifyMcqExamCode(examId: string, accessCode: string) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/verify-code`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ accessCode }),
    },
  );
  return response.json();
}

export async function startMcqExam(examId: string, accessCode?: string) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}/start`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: accessCode ? JSON.stringify({ accessCode }) : undefined,
  });
  return response.json();
}

// Student: Get current submission
export async function getMcqSubmission(examId: string) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/submission`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Student: Save answer
export async function saveMcqAnswer(
  examId: string,
  data: {
    questionId: string;
    selectedOptionIndex: number | null;
  },
) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}/answer`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Student: Submit exam
export async function submitMcqExam(examId: string, isAutoSubmit = false) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ isAutoSubmit }),
  });
  return response.json();
}

// Student: Get my exams
export async function getMyMcqExams() {
  const response = await fetch(`${API_BASE_URL}/mcq/my-exams`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// Student: Get exam result
export async function getMcqExamResult(examId: string) {
  const response = await fetch(`${API_BASE_URL}/mcq/exams/${examId}/result`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

// Admin: Get exam submissions
export async function getMcqExamSubmissions(
  examId: string,
  params?: { page?: number; limit?: number },
) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/submissions?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// Get leaderboard
export async function getMcqLeaderboard(examId: string, limit = 10) {
  const response = await fetch(
    `${API_BASE_URL}/mcq/exams/${examId}/leaderboard?limit=${limit}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

// ========================
// STUDENTS API (Admin)
// ========================

export async function getAllStudents(params?: {
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/students?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

export async function getStudent(studentId: string) {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function updateStudent(
  studentId: string,
  data: Record<string, unknown>,
) {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteStudent(studentId: string) {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return response.json();
}

// ========================
// COURSE CATEGORIES API
// ========================

export interface CourseCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getCourseCategories(params?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.search) searchParams.set("search", params.search);
  if (params?.isActive !== undefined)
    searchParams.set("isActive", params.isActive.toString());

  const response = await fetch(
    `${API_BASE_URL}/course-categories?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

export async function getCourseCategory(categoryId: string) {
  const response = await fetch(
    `${API_BASE_URL}/course-categories/${categoryId}`,
    {
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}

export async function createCourseCategory(data: {
  name: string;
  description?: string;
  isActive?: boolean;
}) {
  const response = await fetch(`${API_BASE_URL}/course-categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateCourseCategory(
  categoryId: string,
  data: { name?: string; description?: string; isActive?: boolean },
) {
  const response = await fetch(
    `${API_BASE_URL}/course-categories/${categoryId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    },
  );
  return response.json();
}

export async function deleteCourseCategory(categoryId: string) {
  const response = await fetch(
    `${API_BASE_URL}/course-categories/${categoryId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );
  return response.json();
}
