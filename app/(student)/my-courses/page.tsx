// app/(student)/my-courses/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/(home)/_components/navbar";
import { Button } from "@/components/ui/button";
import { getMyEnrollments, getCourseProgress, getCookie } from "@/lib/api";
import type { Enrollment } from "@/types";

// Icons
const Icons = {
  play: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
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
  check: () => (
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  progress: () => (
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
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  emptyBox: () => (
    <svg
      className="w-16 h-16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  logout: () => (
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
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
};

interface CourseWithProgress extends Enrollment {
  progressData?: {
    totalVideos: number;
    completedVideos: number;
    progress: number;
  };
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "student") {
      router.push("/login");
      return;
    }

    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await getMyEnrollments();
        if (res.success) {
          // Fetch progress for each enrollment
          const enrollmentsWithProgress = await Promise.all(
            res.data.map(async (enrollment: Enrollment) => {
              try {
                const progressRes = await getCourseProgress(
                  enrollment.course._id,
                );
                return {
                  ...enrollment,
                  progressData: progressRes.success ? progressRes.data : null,
                };
              } catch {
                return { ...enrollment, progressData: null };
              }
            }),
          );
          setEnrollments(enrollmentsWithProgress);
        }
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [router]);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter === "pending") return enrollment.status === "pending";
    if (filter === "approved") return enrollment.status === "approved";
    if (filter === "rejected") return enrollment.status === "rejected";
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          border: "border-amber-200",
          label: "অপেক্ষমাণ",
        };
      case "approved":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          border: "border-emerald-200",
          label: "অনুমোদিত",
        };
      case "rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          label: "প্রত্যাখ্যাত",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          label: status,
        };
    }
  };

  // const formatDuration = (minutes: number) => {
  //   if (minutes < 60) return `${minutes} মিনিট`;
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   return mins > 0 ? `${hours} ঘন্টা ${mins} মিনিট` : `${hours} ঘন্টা`;
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">আমার কোর্স</h1>
              <p className="text-gray-600 mt-1">
                আপনার এনরোল করা কোর্স সমূহ এখানে দেখুন
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                className={
                  filter === "all" ? "bg-purple-600 hover:bg-purple-700" : ""
                }
              >
                সব ({enrollments.length})
              </Button>
              <Button
                onClick={() => setFilter("pending")}
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                className={
                  filter === "pending" ? "bg-amber-500 hover:bg-amber-600" : ""
                }
              >
                অপেক্ষমাণ (
                {enrollments.filter((e) => e.status === "pending").length})
              </Button>
              <Button
                onClick={() => setFilter("approved")}
                variant={filter === "approved" ? "default" : "outline"}
                size="sm"
                className={
                  filter === "approved"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : ""
                }
              >
                অনুমোদিত (
                {enrollments.filter((e) => e.status === "approved").length})
              </Button>
              <Button
                onClick={() => setFilter("rejected")}
                variant={filter === "rejected" ? "default" : "outline"}
                size="sm"
                className={
                  filter === "rejected" ? "bg-red-500 hover:bg-red-600" : ""
                }
              >
                প্রত্যাখ্যাত (
                {enrollments.filter((e) => e.status === "rejected").length})
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  <Icons.book />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrollments.length}
                  </p>
                  <p className="text-sm text-gray-500">মোট এনরোল</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Icons.clock />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrollments.filter((e) => e.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-500">অপেক্ষমাণ</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Icons.check />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrollments.filter((e) => e.status === "approved").length}
                  </p>
                  <p className="text-sm text-gray-500">অনুমোদিত</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <Icons.progress />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enrollments.filter((e) => e.status === "rejected").length}
                  </p>
                  <p className="text-sm text-gray-500">প্রত্যাখ্যাত</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredEnrollments.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <div className="flex justify-center text-gray-300 mb-4">
                <Icons.emptyBox />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === "all"
                  ? "এখনো কোন কোর্সে এনরোল করেননি"
                  : filter === "pending"
                    ? "কোন পেন্ডিং কোর্স নেই"
                    : filter === "approved"
                      ? "কোন অনুমোদিত কোর্স নেই"
                      : "কোন প্রত্যাখ্যাত কোর্স নেই"}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === "all"
                  ? "আমাদের কোর্স সমূহ দেখুন এবং শেখা শুরু করুন"
                  : "অন্য ফিল্টার ব্যবহার করে দেখুন"}
              </p>
              {filter === "all" && (
                <Link href="/courses">
                  <Button>কোর্স খুঁজুন</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEnrollments.map((enrollment) => {
                const course = enrollment.course;
                const progress =
                  enrollment.progressData?.progress || enrollment.progress || 0;
                const completedVideos =
                  enrollment.progressData?.completedVideos ||
                  enrollment.completedVideos?.length ||
                  0;
                const totalVideos =
                  enrollment.progressData?.totalVideos ||
                  course?.totalLessons ||
                  0;
                const statusConfig = getStatusConfig(enrollment.status);
                const isApproved = enrollment.status === "approved";

                return (
                  <div
                    key={enrollment._id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-lg transition-shadow ${
                      enrollment.status === "rejected"
                        ? "border-red-200 opacity-75"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-linear-to-br from-purple-100 to-cyan-100">
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      {isApproved && (
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              progress === 100
                                ? "bg-emerald-500 text-white"
                                : progress > 0
                                  ? "bg-amber-500 text-white"
                                  : "bg-gray-500 text-white"
                            }`}
                          >
                            {progress === 100
                              ? "সম্পন্ন"
                              : progress > 0
                                ? `${Math.round(progress)}%`
                                : "শুরু করুন"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course?.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-2">
                        এনরোল: {formatDate(enrollment.enrolledAt)}
                      </p>

                      {enrollment.status === "pending" && (
                        <p className="text-sm text-amber-600 mb-4">
                          আপনার এনরোলমেন্ট অনুমোদনের অপেক্ষায় আছে
                        </p>
                      )}

                      {enrollment.status === "rejected" && (
                        <p className="text-sm text-red-600 mb-4">
                          {enrollment.rejectionReason ||
                            "এনরোলমেন্ট প্রত্যাখ্যাত হয়েছে"}
                        </p>
                      )}

                      {/* Progress Bar - Only show for approved enrollments */}
                      {isApproved && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">অগ্রগতি</span>
                            <span className="text-gray-900 font-medium">
                              {completedVideos}/{totalVideos} ভিডিও
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                progress === 100
                                  ? "bg-emerald-500"
                                  : "bg-linear-to-r from-purple-500 to-cyan-500"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Continue Button - Only for approved enrollments */}
                      {isApproved ? (
                        <Link href={`/learn/${course?._id}`}>
                          <Button className="w-full bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600">
                            <span className="flex items-center gap-2">
                              <Icons.play />
                              {progress > 0
                                ? "কোর্স চালিয়ে যান"
                                : "কোর্স শুরু করুন"}
                            </span>
                          </Button>
                        </Link>
                      ) : enrollment.status === "pending" ? (
                        <Button
                          disabled
                          className="w-full bg-amber-100 text-amber-700 cursor-not-allowed"
                        >
                          অনুমোদনের অপেক্ষায়...
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                        >
                          এক্সেস নেই
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
