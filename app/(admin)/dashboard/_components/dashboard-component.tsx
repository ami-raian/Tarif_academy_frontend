// app/dashboard/_components/dashboard-component
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPlayer } from "@/components/video-player";
import { VideoUploadModal } from "./video-upload-modal";
import { CreateCourseModal } from "./create-course-modal";
import { toggleCoursePublish } from "@/lib/api";
import type {
  Course,
  CoursesResponse,
  Video,
  VideoWithAccess,
  CourseVideosResponse,
} from "@/types";

const API_BASE_URL = "http://localhost:5000/api/v1";

// Icons as simple components
const Icons = {
  back: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  ),
  play: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  close: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  video: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  clock: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  users: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  book: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  star: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  plus: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  chart: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  checkCircle: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  draft: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  chevronDown: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  refresh: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
};

const DashboardComponent = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<{
    [key: string]: Video[] | VideoWithAccess[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [filter, setFilter] = useState<"all" | "published" | "unpublished">(
    "all",
  );
  const [syncing, setSyncing] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [publishingCourse, setPublishingCourse] = useState<string | null>(null);

  // Get auth token from localStorage or cookies
  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    const ls = localStorage.getItem("accessToken");
    if (ls) return ls;
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
        setExpandedSections(new Set(Object.keys(data.data.sections)));
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
    setExpandedSections(new Set());
  };

  const handleVideoSelect = (video: Video | VideoWithAccess) => {
    // For admin view, cast to Video since we have the bunny info
    setSelectedVideo(video as Video);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  // Sync all processing videos with Bunny
  const syncAllVideos = async () => {
    try {
      setSyncing(true);
      const token = getAuthToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/webhooks/sync-all-videos`, {
        method: "POST",
        headers,
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        // Re-fetch videos to get updated status
        if (selectedCourse) {
          await fetchCourseVideos(selectedCourse._id);
        }
        alert(`সিঙ্ক সম্পন্ন! ${data.data.ready} টি ভিডিও প্রস্তুত।`);
      }
    } catch (error) {
      console.error("Failed to sync videos:", error);
      alert("সিঙ্ক করতে সমস্যা হয়েছে");
    } finally {
      setSyncing(false);
    }
  };

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  // Toggle publish status
  const handleTogglePublish = async (e: React.MouseEvent, course: Course) => {
    e.stopPropagation(); // Prevent course selection
    try {
      setPublishingCourse(course._id);
      const res = await toggleCoursePublish(course._id);
      if (res.success) {
        // Update local state
        setCourses((prev) =>
          prev.map((c) =>
            c._id === course._id ? { ...c, isPublished: !c.isPublished } : c,
          ),
        );
      } else {
        alert(res.message || "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
      alert("স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setPublishingCourse(null);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getTotalVideos = () => {
    return Object.values(sections).reduce(
      (acc, videos) => acc + videos.length,
      0,
    );
  };

  const getLevelConfig = (level: string) => {
    switch (level) {
      case "beginner":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          label: "শুরু",
        };
      case "intermediate":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          label: "মধ্যম",
        };
      case "advanced":
        return {
          bg: "bg-rose-50",
          text: "text-rose-700",
          border: "border-rose-200",
          label: "উন্নত",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          label: level,
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ready":
        return {
          bg: "bg-emerald-500",
          text: "text-white",
          icon: "✓",
          label: "প্রস্তুত",
        };
      case "processing":
        return {
          bg: "bg-amber-500",
          text: "text-white",
          icon: "⟳",
          label: "প্রসেসিং",
        };
      case "failed":
        return {
          bg: "bg-rose-500",
          text: "text-white",
          icon: "✕",
          label: "ব্যর্থ",
        };
      default:
        return {
          bg: "bg-slate-500",
          text: "text-white",
          icon: "?",
          label: status,
        };
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // ==================== COURSE VIDEOS VIEW ====================
  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Top Header */}
        <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCourses}
                className="gap-2 text-slate-600 hover:text-slate-900"
              >
                <Icons.back />
                <span className="hidden sm:inline">ফিরে যান</span>
              </Button>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {selectedCourse.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Icons.video />
                    {getTotalVideos()} টি ভিডিও
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.users />
                    {selectedCourse.enrolledStudents} শিক্ষার্থী
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={syncAllVideos}
                disabled={syncing}
                className="gap-2 shrink-0"
              >
                <span className={syncing ? "animate-spin" : ""}>
                  <Icons.refresh />
                </span>
                <span className="hidden sm:inline">
                  {syncing ? "সিঙ্ক হচ্ছে..." : "ভিডিও সিঙ্ক"}
                </span>
              </Button>
              <Button
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                className="gap-2 shrink-0"
              >
                <Icons.plus />
                <span className="hidden sm:inline">ভিডিও আপলোড</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Section */}
            <div className="lg:col-span-2 space-y-4">
              {selectedVideo ? (
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h2 className="font-semibold text-slate-900 truncate">
                          {selectedVideo.title}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                          {selectedVideo.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCloseVideo}
                        className="shrink-0 text-slate-500 hover:text-slate-900"
                      >
                        <Icons.close />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    {selectedVideo.status === "ready" ? (
                      <VideoPlayer
                        videoGuid={selectedVideo.bunnyGuid}
                        title={selectedVideo.title}
                      />
                    ) : selectedVideo.status === "processing" ? (
                      <div className="aspect-video bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-amber-800 font-medium">
                          ভিডিও প্রসেস হচ্ছে
                        </p>
                        <p className="text-amber-600 text-sm mt-1">
                          কিছুক্ষণ পর আবার চেষ্টা করুন
                        </p>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-rose-50 to-rose-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                          <Icons.close />
                        </div>
                        <p className="text-rose-800 font-medium">
                          ভিডিও প্রসেস ব্যর্থ হয়েছে
                        </p>
                        <p className="text-rose-600 text-sm mt-1">
                          পুনরায় আপলোড করুন
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4">
                      <div className="text-slate-400 scale-150">
                        <Icons.play />
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium">
                      একটি ভিডিও সিলেক্ট করুন
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      ডান পাশের তালিকা থেকে ভিডিও বেছে নিন
                    </p>
                  </div>
                </Card>
              )}

              {/* Course Info Card */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    কোর্স সম্পর্কে
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedCourse.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(() => {
                      const levelConfig = getLevelConfig(selectedCourse.level);
                      return (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${levelConfig.bg} ${levelConfig.text} border ${levelConfig.border}`}
                        >
                          {levelConfig.label}
                        </span>
                      );
                    })()}
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
                      {selectedCourse.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                      {selectedCourse.language}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Video List Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-24">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>কোর্স কনটেন্ট</span>
                    <span className="text-sm font-normal text-slate-500">
                      {Object.keys(sections).length} সেকশন
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {videosLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : Object.keys(sections).length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <Icons.video />
                      </div>
                      <p className="text-slate-500">কোনো ভিডিও পাওয়া যায়নি</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {Object.entries(sections).map(
                        ([sectionTitle, videos], sectionIndex) => (
                          <div key={sectionTitle}>
                            {/* Section Header */}
                            <button
                              onClick={() => toggleSection(sectionTitle)}
                              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="text-primary font-semibold text-sm">
                                  {sectionIndex + 1}
                                </span>
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="font-medium text-slate-900 text-sm truncate">
                                  {sectionTitle}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {videos.length} টি ভিডিও
                                </p>
                              </div>
                              <div
                                className={`transition-transform ${expandedSections.has(sectionTitle) ? "rotate-180" : ""}`}
                              >
                                <Icons.chevronDown />
                              </div>
                            </button>

                            {/* Videos List */}
                            {expandedSections.has(sectionTitle) && (
                              <div className="bg-slate-50/50">
                                {videos.map((video, videoIndex) => {
                                  const isSelected =
                                    selectedVideo?._id === video._id;
                                  const statusConfig = getStatusConfig(
                                    video.status,
                                  );

                                  return (
                                    <button
                                      key={video._id}
                                      onClick={() => handleVideoSelect(video)}
                                      className={`w-full px-4 py-3 flex items-start gap-3 transition-all border-l-2 ${
                                        isSelected
                                          ? "bg-primary/5 border-l-primary"
                                          : "border-l-transparent hover:bg-white"
                                      }`}
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                          isSelected
                                            ? "bg-primary text-white"
                                            : "bg-slate-200 text-slate-600"
                                        }`}
                                      >
                                        {isSelected ? (
                                          <Icons.play />
                                        ) : (
                                          <span className="text-xs font-medium">
                                            {videoIndex + 1}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0 text-left">
                                        <p
                                          className={`text-sm truncate ${
                                            isSelected
                                              ? "font-medium text-primary"
                                              : "text-slate-700"
                                          }`}
                                        >
                                          {video.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <span
                                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${statusConfig.bg} ${statusConfig.text}`}
                                          >
                                            {statusConfig.icon}{" "}
                                            {statusConfig.label}
                                          </span>
                                          {video.isFree && (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500 text-white">
                                              ফ্রি
                                            </span>
                                          )}
                                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <Icons.clock />
                                            {formatDuration(video.duration)}
                                          </span>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Video Upload Modal */}
        <VideoUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          courseId={selectedCourse._id}
          courseTitle={selectedCourse.title}
          existingSections={Object.keys(sections)}
          onUploadSuccess={() => fetchCourseVideos(selectedCourse._id)}
        />
      </div>
    );
  }

  // ==================== DASHBOARD MAIN VIEW ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                ড্যাশবোর্ড
              </h1>
              <p className="text-slate-500 mt-1">
                আপনার কোর্স এবং কনটেন্ট ম্যানেজ করুন
              </p>
            </div>
            <Button
              onClick={() => setIsCreateCourseModalOpen(true)}
              className="gap-2 shadow-lg shadow-primary/25"
            >
              <Icons.plus />
              নতুন কোর্স যোগ করুন
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">মোট কোর্স</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    {courses.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
                  <Icons.chart />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">প্রকাশিত</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                    {courses.filter((c) => c.isPublished).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                  <Icons.checkCircle />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">ড্রাফট</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
                    {courses.filter((c) => !c.isPublished).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                  <Icons.draft />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">মোট শিক্ষার্থী</p>
                  <p className="text-2xl sm:text-3xl font-bold text-sky-600 mt-1">
                    {courses.reduce((acc, c) => acc + c.enrolledStudents, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
                  <Icons.users />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">আপনার কোর্সসমূহ</CardTitle>
              <Tabs
                defaultValue="all"
                onValueChange={(value) =>
                  setFilter(value as "all" | "published" | "unpublished")
                }
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    সকল
                  </TabsTrigger>
                  <TabsTrigger value="true" className="text-xs sm:text-sm">
                    প্রকাশিত
                  </TabsTrigger>
                  <TabsTrigger value="false" className="text-xs sm:text-sm">
                    ড্রাফট
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Icons.book />
                </div>
                <p className="text-slate-500 font-medium">
                  কোনো কোর্স পাওয়া যায়নি
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  নতুন কোর্স যোগ করুন
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {courses.map((course) => {
                  const levelConfig = getLevelConfig(course.level);
                  return (
                    <Card
                      key={course._id}
                      onClick={() => handleCourseSelect(course)}
                      className="group cursor-pointer border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Course Thumbnail */}
                      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={(e) => handleTogglePublish(e, course)}
                            disabled={publishingCourse === course._id}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              course.isPublished
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                : "bg-slate-700 hover:bg-slate-800 text-white"
                            } ${publishingCourse === course._id ? "opacity-70 cursor-wait" : ""}`}
                          >
                            {publishingCourse === course._id ? (
                              <span className="flex items-center gap-1">
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              </span>
                            ) : course.isPublished ? (
                              "প্রকাশিত ✓"
                            ) : (
                              "ড্রাফট"
                            )}
                          </button>
                        </div>

                        {/* Price */}
                        <div className="absolute bottom-3 left-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">
                              ৳{course.discountPrice}
                            </span>
                            {course.price !== course.discountPrice && (
                              <span className="text-sm text-white/70 line-through">
                                ৳{course.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <div className="text-primary ml-1 scale-150">
                              <Icons.play />
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        {/* Title */}
                        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-500 line-clamp-2 mt-2">
                          {course.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${levelConfig.bg} ${levelConfig.text}`}
                          >
                            {levelConfig.label}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-700">
                            {course.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-700">
                            {course.language}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Icons.book />
                              {course.totalLessons} লেসন
                            </span>
                            <span className="flex items-center gap-1">
                              <Icons.users />
                              {course.enrolledStudents}
                            </span>
                          </div>
                          {course.rating > 0 && (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <Icons.star />
                              {course.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onCourseCreated={() => {
          // Refresh courses list
          window.location.reload();
        }}
      />
    </div>
  );
};

export default DashboardComponent;
