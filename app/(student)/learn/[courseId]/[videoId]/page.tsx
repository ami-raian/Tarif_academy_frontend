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
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/my-courses"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                <Icons.back />
              </div>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="text-white font-medium truncate max-w-xs sm:max-w-lg text-sm">
              {course?.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <span className="text-xs font-medium text-white/70">
                {getProgress()}%
              </span>
            </div>

            {/* Close Button */}
            <Link
              href="/my-courses"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <Icons.close />
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-14 flex min-h-screen">
        {/* Main Video Area */}
        <main
          className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:mr-85" : ""}`}
        >
          {/* Video Player Container */}
          <div className="bg-black w-full">
            <div className="max-w-7xl mx-auto">
              {videoLoading ? (
                <div className="aspect-video flex items-center justify-center bg-black">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-purple-500/20"></div>
                      <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-white/40 text-sm">ভিডিও লোড হচ্ছে...</p>
                  </div>
                </div>
              ) : embedUrl ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={embedUrl}
                    title={currentVideo?.title || "Video"}
                    className="w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-black">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <Icons.play />
                    </div>
                    <p className="text-white/40">ভিডিও লোড করা যায়নি</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video Info Section */}
          <div className="flex-1 bg-[#0f0f0f]">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
              {/* Title */}
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 leading-tight">
                {currentVideo?.title}
              </h2>

              {/* Description */}
              {currentVideo?.description && (
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {currentVideo.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {prevVideo && !prevVideo.locked && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/learn/${courseId}/${prevVideo._id}`)
                    }
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-full px-5 transition-all"
                  >
                    <Icons.prev />
                    <span className="ml-2">আগের ভিডিও</span>
                  </Button>
                )}
                {nextVideo && !nextVideo.locked && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/learn/${courseId}/${nextVideo._id}`)
                    }
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-full px-5 transition-all"
                  >
                    <span className="mr-2">পরের ভিডিও</span>
                    <Icons.next />
                  </Button>
                )}

                <div className="flex-1" />

                {/* Complete Button */}
                {currentVideo && !currentVideo.completed && (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={completingVideo}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-6 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
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
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Icons.check />
                    </div>
                    <span className="text-emerald-400 text-sm font-medium">
                      সম্পন্ন!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar - Course Content */}
        <aside
          className={`fixed right-0 top-14 bottom-0 w-85 bg-[#0f0f0f] border-l border-white/5 overflow-hidden flex flex-col transform transition-transform duration-300 z-40 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">কোর্স কনটেন্ট</h3>
              <span className="text-xs text-white/40">
                {allVideos.filter((v) => v.completed).length}/{allVideos.length}
              </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-700"
                style={{
                  width: `${(allVideos.filter((v) => v.completed).length / allVideos.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Sections - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {Object.entries(sections).map(([sectionTitle, videos]) => (
              <div key={sectionTitle} className="border-b border-white/5">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(sectionTitle)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`transform transition-transform duration-200 text-white/40 ${
                        expandedSections.has(sectionTitle) ? "rotate-180" : ""
                      }`}
                    >
                      <Icons.chevronDown />
                    </span>
                    <span className="font-medium text-white/90 text-sm">
                      {sectionTitle}
                    </span>
                  </div>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded">
                    {videos.length} ভিডিও
                  </span>
                </button>

                {/* Videos */}
                {expandedSections.has(sectionTitle) && (
                  <div className="pb-2">
                    {[...videos]
                      .sort((a, b) => a.order - b.order)
                      .map((video, index) => (
                        <button
                          key={video._id}
                          onClick={() => handleVideoSelect(video)}
                          disabled={video.locked}
                          className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all ${
                            video._id === videoId
                              ? "bg-white/10"
                              : video.locked
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-white/5"
                          }`}
                        >
                          {/* Status Circle */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium transition-all ${
                              video.completed
                                ? "bg-emerald-500 text-white"
                                : video._id === videoId
                                  ? "bg-purple-500 text-white"
                                  : video.locked
                                    ? "bg-white/10 text-white/30"
                                    : "bg-white/10 text-white/60"
                            }`}
                          >
                            {video.completed ? (
                              <Icons.check />
                            ) : video.locked ? (
                              <Icons.lock />
                            ) : (
                              index + 1
                            )}
                          </div>

                          {/* Video Info */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm truncate ${
                                video._id === videoId
                                  ? "text-white font-medium"
                                  : video.completed
                                    ? "text-white/50"
                                    : "text-white/70"
                              }`}
                            >
                              {video.title}
                            </p>
                            <p className="text-xs text-white/30 mt-0.5">
                              {formatDuration(video.duration)}
                            </p>
                          </div>

                          {/* Now Playing Indicator */}
                          {video._id === videoId && (
                            <div className="flex items-end gap-0.5 h-4">
                              <span className="w-0.75 h-2 bg-purple-500 rounded-sm animate-[bounce_0.6s_ease-in-out_infinite]"></span>
                              <span className="w-0.75 h-3 bg-purple-500 rounded-sm animate-[bounce_0.6s_ease-in-out_0.1s_infinite]"></span>
                              <span className="w-0.75 h-4 bg-purple-500 rounded-sm animate-[bounce_0.6s_ease-in-out_0.2s_infinite]"></span>
                              <span className="w-0.75 h-2 bg-purple-500 rounded-sm animate-[bounce_0.6s_ease-in-out_0.3s_infinite]"></span>
                            </div>
                          )}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Sidebar Toggle Button - Desktop */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white shadow-xl flex items-center justify-center z-50 transition-all hover:scale-105 backdrop-blur-sm border border-white/10"
      >
        {sidebarOpen ? <Icons.close /> : <Icons.menu />}
      </button>
    </div>
  );
}
