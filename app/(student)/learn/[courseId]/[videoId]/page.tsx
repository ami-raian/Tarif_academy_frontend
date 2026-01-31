"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getCourse,
  getCourseVideos,
  getVideoStreamUrl,
  markVideoCompleted,
  getCookie,
} from "@/lib/api";
import type { Course, VideoWithAccess } from "@/types";

// Icons
const Icons = {
  back: () => (
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
  ),
  play: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
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
  next: () => (
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
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
  prev: () => (
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
  ),
  menu: () => (
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
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  close: () => (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
};

interface PageProps {
  params: Promise<{ courseId: string; videoId: string }>;
}

export default function VideoPlayerPage({ params }: PageProps) {
  const { courseId, videoId } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<{
    [key: string]: VideoWithAccess[];
  }>({});
  const [currentVideo, setCurrentVideo] = useState<VideoWithAccess | null>(
    null,
  );
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completingVideo, setCompletingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all videos in order
  const getAllVideos = (): VideoWithAccess[] => {
    const allVideos: VideoWithAccess[] = [];
    Object.values(sections).forEach((sectionVideos) => {
      allVideos.push(...[...sectionVideos].sort((a, b) => a.order - b.order));
    });
    return allVideos;
  };

  // Find next and previous videos
  const allVideos = getAllVideos();
  const currentIndex = allVideos.findIndex((v) => v._id === videoId);
  const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
  const nextVideo =
    currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "student") {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course
        const courseRes = await getCourse(courseId);
        if (courseRes.success) {
          setCourse(courseRes.data);
        } else {
          setError(courseRes.message || "কোর্স লোড করা যায়নি");
          return;
        }

        // Fetch videos
        const videosRes = await getCourseVideos(courseId);
        if (videosRes.success) {
          setSections(videosRes.data.sections || {});
          // Expand all sections
          setExpandedSections(
            new Set(Object.keys(videosRes.data.sections || {})),
          );

          // Find current video
          let foundVideo: VideoWithAccess | null = null;
          Object.values(videosRes.data.sections || {}).forEach(
            (sectionVideos) => {
              const video = (sectionVideos as VideoWithAccess[]).find(
                (v) => v._id === videoId,
              );
              if (video) foundVideo = video;
            },
          );

          if (foundVideo) {
            setCurrentVideo(foundVideo);
          } else {
            setError("ভিডিও পাওয়া যায়নি");
          }
        } else {
          setError(
            videosRes.message ||
              "ভিডিও লোড করা যায়নি। আপনার এনরোলমেন্ট অনুমোদিত কিনা চেক করুন।",
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, videoId, router]);

  // Fetch video stream URL when current video changes
  useEffect(() => {
    if (!currentVideo || currentVideo.locked) return;

    const fetchStreamUrl = async () => {
      try {
        setVideoLoading(true);
        const res = await getVideoStreamUrl(currentVideo._id);
        if (res.success) {
          setEmbedUrl(res.data.embedUrl);
        }
      } catch (error) {
        console.error("Failed to fetch stream URL:", error);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchStreamUrl();
  }, [currentVideo]);

  const handleVideoSelect = (video: VideoWithAccess) => {
    if (video.locked) {
      alert("এই ভিডিও দেখতে কোর্সে এনরোল করুন");
      return;
    }
    router.push(`/learn/${courseId}/${video._id}`);
  };

  const handleMarkComplete = async () => {
    if (!currentVideo || completingVideo) return;

    try {
      setCompletingVideo(true);
      const res = await markVideoCompleted(currentVideo._id);
      if (res.success) {
        // Update local state
        setSections((prevSections) => {
          const newSections = { ...prevSections };
          Object.keys(newSections).forEach((sectionTitle) => {
            newSections[sectionTitle] = newSections[sectionTitle].map((v) =>
              v._id === currentVideo._id ? { ...v, completed: true } : v,
            );
          });
          return newSections;
        });
        setCurrentVideo((prev) => (prev ? { ...prev, completed: true } : null));

        // Auto-navigate to next video
        if (nextVideo && !nextVideo.locked) {
          router.push(`/learn/${courseId}/${nextVideo._id}`);
        }
      }
    } catch (error) {
      console.error("Failed to mark video complete:", error);
    } finally {
      setCompletingVideo(false);
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

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const getProgress = () => {
    const completed = allVideos.filter((v) => v.completed).length;
    return Math.round((completed / allVideos.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Show error if video not found
  if (!currentVideo || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            ভিডিও পাওয়া যায়নি
          </h1>
          <p className="text-gray-400 mb-6">
            {error || "এই ভিডিওটি বিদ্যমান নেই বা আপনার এক্সেস নেই"}
          </p>
          <Link href="/my-courses">
            <Button className="bg-purple-600 hover:bg-purple-700">
              আমার কোর্সে ফিরে যান
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/my-courses"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Icons.back />
              <span className="hidden sm:inline">ফিরে যান</span>
            </Link>
            <div className="h-6 w-px bg-gray-700" />
            <h1 className="text-white font-medium truncate max-w-xs sm:max-w-md">
              {course?.title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-500 to-cyan-500 rounded-full"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">{getProgress()}%</span>
            </div>

            {/* Toggle Sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              {sidebarOpen ? <Icons.close /> : <Icons.menu />}
            </button>
          </div>
        </div>
      </header>

      <div className="pt-14 flex">
        {/* Main Video Area */}
        <main
          className={`flex-1 transition-all ${sidebarOpen ? "lg:mr-80" : ""}`}
        >
          {/* Video Player */}
          <div className="bg-black">
            {videoLoading ? (
              <div className="aspect-video flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : embedUrl ? (
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  title={currentVideo?.title || "Video"}
                  className="w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-800">
                <p className="text-gray-400">ভিডিও লোড করা যায়নি</p>
              </div>
            )}
          </div>

          {/* Video Info & Controls */}
          <div className="p-4 sm:p-6 bg-gray-800 border-t border-gray-700">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {currentVideo?.title}
              </h2>
              {currentVideo?.description && (
                <p className="text-gray-400 mb-4">{currentVideo.description}</p>
              )}

              {/* Navigation & Complete Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {prevVideo && !prevVideo.locked && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/learn/${courseId}/${prevVideo._id}`)
                      }
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      <Icons.prev />
                      <span className="hidden sm:inline ml-2">আগের ভিডিও</span>
                    </Button>
                  )}
                  {nextVideo && !nextVideo.locked && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/learn/${courseId}/${nextVideo._id}`)
                      }
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      <span className="hidden sm:inline mr-2">পরের ভিডিও</span>
                      <Icons.next />
                    </Button>
                  )}
                </div>

                {currentVideo && !currentVideo.completed && (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={completingVideo}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {completingVideo ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        সেভ হচ্ছে...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Icons.check />
                        সম্পন্ন হিসেবে চিহ্নিত করুন
                      </span>
                    )}
                  </Button>
                )}

                {currentVideo?.completed && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Icons.check />
                    <span>সম্পন্ন!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar - Course Content */}
        <aside
          className={`fixed right-0 top-14 bottom-0 w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto transform transition-transform lg:transform-none ${
            sidebarOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold text-white">কোর্স কনটেন্ট</h3>
            <p className="text-sm text-gray-400 mt-1">
              {allVideos.filter((v) => v.completed).length}/{allVideos.length}{" "}
              সম্পন্ন
            </p>
          </div>

          <div className="divide-y divide-gray-700">
            {Object.entries(sections).map(([sectionTitle, videos]) => (
              <div key={sectionTitle}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionTitle)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-medium text-white text-sm truncate pr-2">
                    {sectionTitle}
                  </span>
                  <span
                    className={`transform transition-transform text-gray-400 ${
                      expandedSections.has(sectionTitle) ? "rotate-180" : ""
                    }`}
                  >
                    <Icons.chevronDown />
                  </span>
                </button>

                {/* Videos */}
                {expandedSections.has(sectionTitle) && (
                  <div className="bg-gray-900/50">
                    {[...videos]
                      .sort((a, b) => a.order - b.order)
                      .map((video) => (
                        <button
                          key={video._id}
                          onClick={() => handleVideoSelect(video)}
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                            video._id === videoId
                              ? "bg-purple-600/20 border-l-2 border-purple-500"
                              : video.locked
                                ? "opacity-50"
                                : "hover:bg-gray-700/50"
                          }`}
                        >
                          {/* Status Icon */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                              video.completed
                                ? "bg-emerald-500/20 text-emerald-400"
                                : video._id === videoId
                                  ? "bg-purple-500/20 text-purple-400"
                                  : video.locked
                                    ? "bg-gray-600 text-gray-400"
                                    : "bg-gray-600 text-gray-300"
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
                            <p
                              className={`text-sm truncate ${
                                video._id === videoId
                                  ? "text-purple-300"
                                  : "text-gray-300"
                              }`}
                            >
                              {video.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDuration(video.duration)}
                            </p>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed bottom-4 right-4 w-12 h-12 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center lg:hidden z-50 ${
          sidebarOpen ? "hidden" : ""
        }`}
      >
        <Icons.menu />
      </button>
    </div>
  );
}
