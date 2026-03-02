export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  thumbnail: string;
  instructor: string | null;
  categoryId?: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  duration: number;
  totalLessons: number;
  isPublished: boolean;
  enrolledStudents: number;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  isDeleted: boolean;
}

export interface CoursesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Course[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  sectionTitle: string;
  order: number;
  duration: number;
  bunnyVideoId: string;
  bunnyGuid: string;
  status: "processing" | "ready" | "failed";
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CourseVideosResponse {
  success: boolean;
  message: string;
  data: {
    sections: {
      [sectionTitle: string]: VideoWithAccess[];
    };
    isEnrolled: boolean;
  };
  statusCode: number;
}

// Video with access info (for course video list)
export interface VideoWithAccess extends Omit<
  Video,
  "bunnyVideoId" | "bunnyGuid"
> {
  locked: boolean;
  completed?: boolean;
}

// Video stream response
export interface VideoStreamResponse {
  success: boolean;
  statusCode: number;
  data: {
    streamUrl: string;
    embedUrl: string;
    video: {
      _id: string;
      title: string;
      description?: string;
      duration: number;
    };
  };
}

// Enrollment types
export type EnrollmentStatus = "pending" | "approved" | "rejected";

export interface Enrollment {
  _id: string;
  student: string;
  studentId?: {
    _id: string;
    roll?: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  course: Course;
  courseId?: {
    _id: string;
    title: string;
    price: number;
    thumbnail?: string;
  };
  enrolledAt: string;
  completedVideos: string[];
  progress: number;
  isActive: boolean;
  status: EnrollmentStatus;
  paymentAmount: number;
  transactionId?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface EnrollmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Enrollment;
}

export interface MyEnrollmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Enrollment[];
}

export interface EnrollmentCheckResponse {
  success: boolean;
  statusCode: number;
  data: {
    isEnrolled: boolean;
    status: EnrollmentStatus | null;
    enrollment?: Enrollment;
  };
}

// Admin enrollment list response
export interface AdminEnrollmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    enrollments: Enrollment[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface CourseProgressResponse {
  success: boolean;
  statusCode: number;
  data: {
    totalVideos: number;
    completedVideos: number;
    progress: number;
    completedVideoIds: string[];
  };
}
