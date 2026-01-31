"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/(home)/_components/navbar";
import { Button } from "@/components/ui/button";
import {
  getCourseBySlug,
  getCourseVideos,
  checkEnrollment,
  createEnrollment,
  getCookie,
} from "@/lib/api";
import type { Course, VideoWithAccess, EnrollmentStatus } from "@/types";

// Icons
const Icons = {
  clock: () => (
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  users: () => (
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
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  book: () => (
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
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  play: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  lock: () => (
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
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  check: () => (
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  chevronDown: () => (
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
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  language: () => (
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
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      />
    </svg>
  ),
  level: () => (
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
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CourseDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<{
    [key: string]: VideoWithAccess[];
  }>({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] =
    useState<EnrollmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // bKash Payment Info
  const BKASH_NUMBER = "01XXXXXXXXX"; // Change this to your bKash number

  useEffect(() => {
    const token = getCookie("accessToken");
    const type = getCookie("userType");
    setIsLoggedIn(!!token);
    setUserType(type);
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const courseRes = await getCourseBySlug(slug);
        if (courseRes.success) {
          setCourse(courseRes.data);

          // Fetch course videos
          const videosRes = await getCourseVideos(courseRes.data._id);
          if (videosRes.success) {
            setSections(videosRes.data.sections || {});
            setIsEnrolled(videosRes.data.isEnrolled || false);
            // Expand first section by default
            const sectionTitles = Object.keys(videosRes.data.sections || {});
            if (sectionTitles.length > 0) {
              setExpandedSections(new Set([sectionTitles[0]]));
            }
          }

          // Check enrollment status if logged in as student
          if (isLoggedIn && userType === "student") {
            const enrollRes = await checkEnrollment(courseRes.data._id);
            if (enrollRes.success) {
              setIsEnrolled(enrollRes.data.isEnrolled);
              setEnrollmentStatus(enrollRes.data.status);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug, isLoggedIn, userType]);

  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (userType !== "student") {
      alert("শুধুমাত্র ছাত্ররা কোর্সে এনরোল করতে পারে");
      return;
    }

    if (!course) return;

    // Show enrollment modal
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async () => {
    if (!course) return;

    if (!transactionId.trim()) {
      alert("ট্রানজেকশন আইডি দিন");
      return;
    }

    try {
      setEnrolling(true);
      const res = await createEnrollment({
        courseId: course._id,
        paymentAmount: course.discountPrice || course.price,
        transactionId: transactionId.trim(),
      });

      if (res.success) {
        setEnrollmentStatus("pending");
        setShowEnrollModal(false);
        setTransactionId("");
        alert(
          "এনরোলমেন্ট রিকোয়েস্ট সফল হয়েছে! অ্যাডমিন অনুমোদন করলে আপনি কোর্সটি দেখতে পারবেন।",
        );
      } else {
        alert(res.message || "এনরোলমেন্ট ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert("এনরোলমেন্ট করতে সমস্যা হয়েছে");
    } finally {
      setEnrolling(false);
    }
  };

  const handleVideoClick = (video: VideoWithAccess) => {
    if (video.locked) {
      if (!isLoggedIn) {
        alert("ভিডিও দেখতে লগইন করুন");
        router.push("/login");
      } else {
        alert("এই ভিডিও দেখতে কোর্সে এনরোল করুন");
      }
      return;
    }
    router.push(`/learn/${course?._id}/${video._id}`);
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

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const formatCourseDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} মিনিট`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ঘন্টা ${mins} মিনিট` : `${hours} ঘন্টা`;
  };

  const getTotalVideos = () => {
    return Object.values(sections).reduce(
      (acc, videos) => acc + videos.length,
      0,
    );
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner":
        return "শুরু";
      case "intermediate":
        return "মধ্যম";
      case "advanced":
        return "উন্নত";
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-64 bg-gray-200 rounded-2xl" />
                  <div className="h-40 bg-gray-200 rounded-2xl" />
                </div>
                <div className="h-96 bg-gray-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              কোর্স পাওয়া যায়নি
            </h1>
            <p className="text-gray-600 mb-8">
              এই কোর্সটি বিদ্যমান নেই বা মুছে ফেলা হয়েছে
            </p>
            <Link href="/courses">
              <Button>সব কোর্স দেখুন</Button>
            </Link>
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
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-purple-600">
              হোম
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-purple-600">
              কোর্স
            </Link>
            <span>/</span>
            <span className="text-gray-900">{course.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {getLevelLabel(course.level)}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>

                <p className="text-gray-600 mb-6">{course.description}</p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="text-amber-500">
                      <Icons.star />
                    </div>
                    <span className="font-medium">
                      {course.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-400">
                      ({course.totalReviews} রিভিউ)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.users />
                    <span>{course.enrolledStudents} জন শিক্ষার্থী</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.clock />
                    <span>{formatCourseDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.book />
                    <span>{course.totalLessons || getTotalVideos()} লেসন</span>
                  </div>
                </div>
              </div>

              {/* Course Thumbnail */}
              {course.thumbnail && (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                  {/* <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  /> */}
                </div>
              )}

              {/* Course Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">
                    কোর্স কনটেন্ট
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {Object.keys(sections).length} সেকশন • {getTotalVideos()}{" "}
                    ভিডিও
                  </p>
                </div>

                {Object.keys(sections).length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-3">📹</div>
                    <p className="text-gray-500">এখনো কোন ভিডিও যুক্ত হয়নি</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {Object.entries(sections).map(([sectionTitle, videos]) => (
                      <div key={sectionTitle}>
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(sectionTitle)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`transform transition-transform ${
                                expandedSections.has(sectionTitle)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            >
                              <Icons.chevronDown />
                            </span>
                            <span className="font-medium text-gray-900">
                              {sectionTitle}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {videos.length} ভিডিও
                          </span>
                        </button>

                        {/* Videos */}
                        {expandedSections.has(sectionTitle) && (
                          <div className="bg-gray-50 divide-y divide-gray-100">
                            {videos
                              .sort((a, b) => a.order - b.order)
                              .map((video) => (
                                <button
                                  key={video._id}
                                  onClick={() => handleVideoClick(video)}
                                  className={`w-full px-6 py-4 flex items-center gap-4 text-left transition-colors ${
                                    video.locked
                                      ? "opacity-60 hover:bg-gray-100"
                                      : "hover:bg-purple-50"
                                  }`}
                                >
                                  {/* Status Icon */}
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                      video.completed
                                        ? "bg-emerald-100 text-emerald-600"
                                        : video.locked
                                          ? "bg-gray-200 text-gray-400"
                                          : "bg-purple-100 text-purple-600"
                                    }`}
                                  >
                                    {video.completed ? (
                                      <Icons.check />
                                    ) : video.locked ? (
                                      <Icons.lock />
                                    ) : (
                                      <Icons.play />
                                    )}
                                  </div>

                                  {/* Video Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900 truncate">
                                        {video.title}
                                      </span>
                                      {video.isFree && (
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                          ফ্রি
                                        </span>
                                      )}
                                    </div>
                                    {video.description && (
                                      <p className="text-sm text-gray-500 truncate">
                                        {video.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Duration */}
                                  <span className="text-sm text-gray-500 shrink-0">
                                    {formatDuration(video.duration)}
                                  </span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Purchase Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                {/* Preview Image */}
                <div className="relative aspect-video bg-linear-to-br from-purple-500 to-cyan-500">
                  {/* {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                  )} */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Icons.play />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    {course.discountPrice > 0 ? (
                      <div className="space-y-1">
                        <div className="text-3xl font-bold text-purple-600">
                          ৳{course.discountPrice}
                        </div>
                        <div className="text-lg text-gray-400 line-through">
                          ৳{course.price}
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">
                          {Math.round(
                            ((course.price - course.discountPrice) /
                              course.price) *
                              100,
                          )}
                          % ছাড়!
                        </div>
                      </div>
                    ) : course.price === 0 ? (
                      <div className="text-3xl font-bold text-emerald-600">
                        বিনামূল্যে
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-purple-600">
                        ৳{course.price}
                      </div>
                    )}
                  </div>

                  {/* Enroll Button */}
                  {isEnrolled ? (
                    <Link href={`/my-courses`} className="block">
                      <Button className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700">
                        কোর্স শুরু করুন →
                      </Button>
                    </Link>
                  ) : enrollmentStatus === "pending" ? (
                    <div className="space-y-3">
                      <Button
                        disabled
                        className="w-full py-6 text-lg bg-amber-100 text-amber-800 cursor-not-allowed"
                      >
                        অনুমোদনের অপেক্ষায়...
                      </Button>
                      <p className="text-sm text-amber-600 text-center">
                        আপনার এনরোলমেন্ট রিকোয়েস্ট জমা হয়েছে। অ্যাডমিন অনুমোদন
                        করলে আপনি কোর্সটি দেখতে পারবেন।
                      </p>
                    </div>
                  ) : enrollmentStatus === "rejected" ? (
                    <div className="space-y-3">
                      <Button
                        onClick={handleEnrollClick}
                        className="w-full py-6 text-lg bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                      >
                        পুনরায় এনরোল করুন
                      </Button>
                      <p className="text-sm text-red-600 text-center">
                        আপনার আগের এনরোলমেন্ট প্রত্যাখ্যাত হয়েছে।
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleEnrollClick}
                      disabled={enrolling}
                      className="w-full py-6 text-lg bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                    >
                      {enrolling ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          এনরোল হচ্ছে...
                        </span>
                      ) : course.price === 0 ? (
                        "ফ্রি এনরোল করুন"
                      ) : (
                        "এনরোল করুন"
                      )}
                    </Button>
                  )}

                  {/* Course Features */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      কোর্সে যা আছে:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-600">
                        <Icons.clock />
                        <span>
                          {formatCourseDuration(course.duration)} ভিডিও
                        </span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <Icons.book />
                        <span>
                          {course.totalLessons || getTotalVideos()} লেসন
                        </span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <Icons.level />
                        <span>{getLevelLabel(course.level)} লেভেল</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-600">
                        <Icons.language />
                        <span>{course.language}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enrollment Modal */}
      {showEnrollModal && course && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              কোর্সে এনরোল করুন
            </h3>

            {/* Course Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {course.title}
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">মূল্য:</span>
                <span className="text-xl font-bold text-purple-600">
                  ৳{course.discountPrice || course.price}
                </span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">bKash</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    বিকাশে পেমেন্ট করুন
                  </p>
                  <p className="text-sm text-gray-600">Send Money</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-600">বিকাশ নম্বর:</span>
                  <span className="font-bold text-pink-600 text-lg">
                    {BKASH_NUMBER}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-600">পরিমাণ:</span>
                  <span className="font-bold text-gray-900">
                    ৳{course.discountPrice || course.price}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm">
                  <strong>নির্দেশনা:</strong>
                </p>
                <ol className="text-amber-700 text-sm mt-1 list-decimal list-inside space-y-1">
                  <li>উপরের বিকাশ নম্বরে Send Money করুন</li>
                  <li>পেমেন্ট করার পর Transaction ID নিচে দিন</li>
                  <li>অ্যাডমিন ভেরিফাই করলে কোর্স অ্যাক্সেস পাবেন</li>
                </ol>
              </div>
            </div>

            {/* Transaction ID Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="যেমন: TXN1234567890"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                বিকাশ থেকে পাওয়া Transaction ID দিন
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEnrollModal(false);
                  setTransactionId("");
                }}
                className="flex-1"
                disabled={enrolling}
              >
                বাতিল
              </Button>
              <Button
                onClick={handleEnrollSubmit}
                disabled={enrolling || !transactionId.trim()}
                className="flex-1 bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
              >
                {enrolling ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    জমা হচ্ছে...
                  </span>
                ) : (
                  "এনরোল রিকোয়েস্ট জমা দিন"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
