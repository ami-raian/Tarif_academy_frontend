// app/(student)/courses/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/app/(home)/_components/navbar";
import {
  getCourses,
  getCourseCategories,
  getThumbnailUrl,
  type CourseCategory,
} from "@/lib/api";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Course, CoursesResponse } from "@/types";

const Icons = {
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
  search: () => (
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  filter: () => (
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
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  ),
};

const levels = [
  { value: "all", label: "সব লেভেল" },
  { value: "beginner", label: "শুরু" },
  { value: "intermediate", label: "মধ্যম" },
  { value: "advanced", label: "উন্নত" },
];

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const categorySlug = searchParams.get("category");

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categoryIdFromUrl,
  );
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 12,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await getCourseCategories({ isActive: true, limit: 50 });
        if (res.success) {
          setCategories(res.data);
          // If categoryId is already in URL, use it directly
          if (categoryIdFromUrl) {
            setSelectedCategoryId(categoryIdFromUrl);
          }
          // Otherwise, if category slug is in URL, find and select that category
          else if (categorySlug) {
            const matchedCategory = res.data.find(
              (cat: CourseCategory) => cat.slug === categorySlug,
            );
            if (matchedCategory) {
              setSelectedCategoryId(matchedCategory._id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [categorySlug, categoryIdFromUrl]);

  // Fetch courses when filters change
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params: Record<string, unknown> = {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          isPublished: true,
        };
        if (selectedCategoryId) {
          params.categoryId = selectedCategoryId;
        }
        if (selectedLevel !== "all") {
          params.level = selectedLevel;
        }

        const data: CoursesResponse = await getCourses(
          params as Parameters<typeof getCourses>[0],
        );
        if (data.success) {
          setCourses(data.data);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [
    selectedCategoryId,
    selectedLevel,
    pagination.currentPage,
    pagination.pageSize,
  ]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} মিনিট`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ঘন্টা ${mins} মিনিট` : `${hours} ঘন্টা`;
  };

  // const getLevelBadge = (level: string) => {
  //   switch (level) {
  //     case "beginner":
  //       return {
  //         bg: "bg-emerald-100",
  //         text: "text-emerald-700",
  //         label: "শুরু",
  //       };
  //     case "intermediate":
  //       return { bg: "bg-amber-100", text: "text-amber-700", label: "মধ্যম" };
  //     case "advanced":
  //       return { bg: "bg-red-100", text: "text-red-700", label: "উন্নত" };
  //     default:
  //       return { bg: "bg-gray-100", text: "text-gray-700", label: level };
  //   }
  // };

  // Normalize and validate thumbnail URLs for Next/Image
  // const resolveImageSrc = (thumbnail?: string) => {
  //   const defaultImg = "/tarifacademy-logo.png";
  //   if (!thumbnail || typeof thumbnail !== "string") return defaultImg;

  //   // allow data: and blob: URLs
  //   if (/^(data:|blob:)/.test(thumbnail)) return thumbnail;

  //   // protocol-relative or absolute http(s)
  //   if (/^(https?:)?\/\//i.test(thumbnail)) {
  //     if (/^\/\//.test(thumbnail)) return `https:${thumbnail}`;
  //     return thumbnail;
  //   }

  //   // root-relative path
  //   if (thumbnail.startsWith("/")) return thumbnail;

  //   // otherwise try to build from API base (if provided)
  //   const apiBase = process.env.NEXT_PUBLIC_TARIFACADEMY_API_URL?.replace(
  //     /\/$/,
  //     "",
  //   );
  //   if (apiBase) return `${apiBase}/${thumbnail.replace(/^\/+/, "")}`;

  //   // fallback to a safe public asset
  //   return `/${thumbnail.replace(/^\/+/, "")}`;
  // };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              আমাদের কোর্স সমূহ
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              আপনার দক্ষতা উন্নত করুন আমাদের বিশেষজ্ঞ-নির্দেশিত কোর্স দিয়ে
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                  <Icons.search />
                </div>
                <Input
                  type="text"
                  placeholder="কোর্স খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Level Filter */}
              <div className="w-full lg:w-48">
                <FormField
                  type="select"
                  value={selectedLevel}
                  onValueChange={setSelectedLevel}
                  placeholder="লেভেল নির্বাচন করুন"
                  options={levels.map((level) => ({
                    value: level.value,
                    label: level.label,
                  }))}
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categoriesLoading ? (
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <Button
                    variant={
                      selectedCategoryId === null ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedCategoryId(null);
                      router.push("/courses");
                    }}
                    className={`rounded-full ${
                      selectedCategoryId === null
                        ? "bg-purple-600 hover:bg-purple-700"
                        : ""
                    }`}
                  >
                    সব
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category._id}
                      variant={
                        selectedCategoryId === category._id
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setSelectedCategoryId(category._id);
                        router.push(`/courses?categoryId=${category._id}`);
                      }}
                      className={`rounded-full ${
                        selectedCategoryId === category._id
                          ? "bg-purple-600 hover:bg-purple-700"
                          : ""
                      }`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                কোন কোর্স পাওয়া যায়নি
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => {
                // const levelBadge = getLevelBadge(course.level);
                return (
                  <Link
                    key={course._id}
                    href={`/courses/${course.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-500"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-linear-to-br from-purple-100 to-cyan-100">
                      <Image
                        src={getThumbnailUrl(course.thumbnail)}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Icons.clock />
                          <span>{formatDuration(course.duration)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icons.book />
                          <span>{course.totalLessons} লেসন</span>
                        </div>
                      </div>

                      {/* Rating & Students */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Icons.star />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {(course.rating ?? 0).toFixed(1)}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500">
                            ({course.totalReviews ?? 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <Icons.users />
                          <span>{course.enrolledStudents}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          {course.discountPrice > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                ৳{course.discountPrice}
                              </span>
                              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                ৳{course.price}
                              </span>
                            </div>
                          ) : course.price === 0 ? (
                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              বিনামূল্যে
                            </span>
                          ) : (
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                              ৳{course.price}
                            </span>
                          )}
                        </div>
                        <span className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          বিস্তারিত →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    currentPage: p.currentPage - 1,
                  }))
                }
                disabled={pagination.currentPage === 1}
              >
                আগের
              </Button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={
                    pagination.currentPage === i + 1 ? "default" : "outline"
                  }
                  onClick={() =>
                    setPagination((p) => ({ ...p, currentPage: i + 1 }))
                  }
                  className={
                    pagination.currentPage === i + 1
                      ? "bg-purple-600 hover:bg-purple-700"
                      : ""
                  }
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((p) => ({
                    ...p,
                    currentPage: p.currentPage + 1,
                  }))
                }
                disabled={pagination.currentPage === pagination.totalPages}
              >
                পরের
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <Navbar />
          <div className="pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  লোড হচ্ছে...
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
