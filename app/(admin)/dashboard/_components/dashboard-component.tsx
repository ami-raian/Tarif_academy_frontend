"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "@/components/video-player";
import type {
  Course,
  CoursesResponse,
  Video,
  CourseVideosResponse,
} from "@/types";

const API_BASE_URL = "http://localhost:5000/api/v1";

const DashboardComponent = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<{ [key: string]: Video[] }>({});
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "unpublished">(
    "all",
  );

  // Get auth token from localStorage or cookies
  const getAuthToken = () => {
    if (typeof window === "undefined") return null;

    // Prefer localStorage if available
    const ls = localStorage.getItem("accessToken");
    if (ls) return ls;

    // Fallback to cookie (accessToken)
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    if (match) return decodeURIComponent(match[2]);

    return null;
  };

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(
          `${API_BASE_URL}/courses?isPublished=${filter}`,
          {
            headers,
            credentials: "include",
          },
        );

        const data: CoursesResponse = await response.json();
        if (data.success) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filter]);

  // Fetch videos for selected course
  const fetchCourseVideos = async (courseId: string) => {
    try {
      setVideosLoading(true);
      const token = getAuthToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${API_BASE_URL}/videos/course/${courseId}`,
        {
          headers,
          credentials: "include",
        },
      );
      const data: CourseVideosResponse = await response.json();
      if (data.success) {
        setSections(data.data.sections);
      }
    } catch (error) {
      console.error("Failed to fetch course videos:", error);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    fetchCourseVideos(course._id);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedVideo(null);
    setSections({});
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Course Videos View
  if (selectedCourse) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToCourses}>
            ← Back to Courses
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
            <p className="text-muted-foreground">
              {selectedCourse.totalLessons} lessons •{" "}
              {selectedCourse.enrolledStudents} students enrolled
            </p>
          </div>
        </div>

        {/* Video Player Modal/Section */}
        {selectedVideo && (
          <Card className="border-primary">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedVideo.title}</CardTitle>
                  <CardDescription>{selectedVideo.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleCloseVideo}>
                  ✕ Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedVideo.status === "ready" ? (
                <VideoPlayer
                  videoGuid={selectedVideo.bunnyGuid}
                  title={selectedVideo.title}
                />
              ) : selectedVideo.status === "processing" ? (
                <div className="flex flex-col items-center justify-center bg-muted rounded-lg aspect-video">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">
                    Video is still processing. Please check back later.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center bg-muted rounded-lg aspect-video">
                  <p className="text-destructive">
                    Video processing failed. Please re-upload.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {videosLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(sections).length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center min-h-[200px]">
              <p className="text-muted-foreground">
                No videos found for this course.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(sections).map(([sectionTitle, videos]) => (
              <Card key={sectionTitle}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    📂 {sectionTitle}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({videos.length} videos)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {videos.map((video, index) => (
                      <div
                        key={video._id}
                        onClick={() => handleVideoSelect(video)}
                        className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                          selectedVideo?._id === video._id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{video.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {video.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {video.isFree && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              Free
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusBadgeColor(
                              video.status,
                            )}`}
                          >
                            {video.status}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {video.duration > 0
                              ? `${Math.floor(video.duration / 60)}:${String(
                                  video.duration % 60,
                                ).padStart(2, "0")}`
                              : "--:--"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoSelect(video);
                            }}
                          >
                            ▶ Play
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Courses List View
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses and content
          </p>
        </div>
        <Button>+ Add New Course</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Courses</CardDescription>
            <CardTitle className="text-3xl">{courses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-3xl">
              {courses.filter((c) => c.isPublished).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Draft</CardDescription>
            <CardTitle className="text-3xl">
              {courses.filter((c) => !c.isPublished).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">
              {courses.reduce((acc, c) => acc + c.enrolledStudents, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Courses Tabs */}
      <Tabs
        defaultValue="all"
        onValueChange={(value) =>
          setFilter(value as "all" | "published" | "unpublished")
        }
      >
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="true">Published</TabsTrigger>
          <TabsTrigger value="false">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <CourseGrid
            courses={courses}
            onSelect={handleCourseSelect}
            formatDate={formatDate}
            getLevelBadgeColor={getLevelBadgeColor}
          />
        </TabsContent>
        <TabsContent value="true" className="mt-4">
          <CourseGrid
            courses={courses.filter((c) => c.isPublished)}
            onSelect={handleCourseSelect}
            formatDate={formatDate}
            getLevelBadgeColor={getLevelBadgeColor}
          />
        </TabsContent>
        <TabsContent value="false" className="mt-4">
          <CourseGrid
            courses={courses.filter((c) => !c.isPublished)}
            onSelect={handleCourseSelect}
            formatDate={formatDate}
            getLevelBadgeColor={getLevelBadgeColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Course Grid Component
interface CourseGridProps {
  courses: Course[];
  onSelect: (course: Course) => void;
  formatDate: (date: string) => string;
  getLevelBadgeColor: (level: string) => string;
}

const CourseGrid = ({
  courses,
  onSelect,
  formatDate,
  getLevelBadgeColor,
}: CourseGridProps) => {
  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">No courses found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <Card
          key={course._id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(course)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {course.description}
                </CardDescription>
              </div>
              <span
                className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                  course.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded capitalize ${getLevelBadgeColor(
                    course.level,
                  )}`}
                >
                  {course.level}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                  {course.category}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {course.language}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <span className="line-through text-muted-foreground">
                    ৳{course.price}
                  </span>
                  <span className="font-semibold text-primary">
                    ৳{course.discountPrice}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>📚 {course.totalLessons} lessons</span>
                  <span>👥 {course.enrolledStudents}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>Created: {formatDate(course.createdAt)}</span>
                {course.rating > 0 && (
                  <span>
                    ⭐ {course.rating} ({course.totalReviews})
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardComponent;
