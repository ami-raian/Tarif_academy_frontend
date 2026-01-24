export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  thumbnail: string;
  instructor: string | null;
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
      [sectionTitle: string]: Video[];
    };
  };
  statusCode: number;
}
