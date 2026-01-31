"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getCourseVideos, getCookie } from "@/lib/api";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function LearnCourseRedirect({ params }: PageProps) {
  const { courseId } = use(params);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "student") {
      router.push("/login");
      return;
    }

    // Fetch videos and redirect to first video
    const redirectToFirstVideo = async () => {
      try {
        const res = await getCourseVideos(courseId);
        if (res.success && res.data.sections) {
          const sections = Object.values(res.data.sections) as Array<
            Array<{ _id: string; order: number }>
          >;
          if (sections.length > 0) {
            // Find first video from first section
            const firstSection = sections[0];
            if (firstSection && firstSection.length > 0) {
              const sortedVideos = [...firstSection].sort(
                (a, b) => a.order - b.order,
              );
              router.replace(`/learn/${courseId}/${sortedVideos[0]._id}`);
              return;
            }
          }
        }
        // No videos found, go back to my-courses
        router.replace("/my-courses");
      } catch (error) {
        console.error("Failed to fetch course videos:", error);
        router.replace("/my-courses");
      }
    };

    redirectToFirstVideo();
  }, [courseId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">কোর্স লোড হচ্ছে...</p>
      </div>
    </div>
  );
}
