import { CourseSliderClient } from "@/app/(home)/_components/course-slider-client";
import { getCourses } from "@/lib/api";
import { Course } from "@/types/course";

export async function CourseSlider() {
  // Fetch published courses from backend
  let courses: Course[] = [];
  let error: string | null = null;

  try {
    const response = await getCourses({
      isPublished: true,
      limit: 10,
      page: 1,
    });

    if (response.success && response.data) {
      courses = response.data;
      console.log(`✅ Fetched ${courses.length} courses for slider`);
    } else {
      error = response.message || "Failed to fetch courses";
      console.error("❌ Course fetch failed:", error);
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch courses";
    console.error("❌ Course fetch error:", error);
  }

  // If no courses, return fallback message
  if (courses.length === 0) {
    return (
      <section className="relative py-16 bg-linear-to-b from-white via-violet-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              কোর্সে{" "}
              <span className="bg-linear-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                যোগ দিন
              </span>
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {error
                ? "কোর্স লোড করতে সমস্যা হয়েছে"
                : "শীঘ্রই নতুন কোর্স যুক্ত হবে"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return <CourseSliderClient courses={courses} />;
}
