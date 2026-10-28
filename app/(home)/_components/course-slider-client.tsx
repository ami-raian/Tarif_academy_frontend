"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Users, Star, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Course } from "@/types/course";
import { getThumbnailUrl } from "@/lib/api";
import Image from "next/image";

interface CourseSliderClientProps {
  courses: Course[];
}

export function CourseSliderClient({ courses }: CourseSliderClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const secondSetRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  // Only loop (and render the duplicate set) when the cards don't fit on screen
  const [shouldLoop, setShouldLoop] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    if (!scrollContainer || !track || !firstSet) return;

    const measure = () => {
      const style = getComputedStyle(track);
      const available =
        scrollContainer.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      setShouldLoop(firstSet.offsetWidth > available);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scrollContainer);
    return () => observer.disconnect();
  }, [courses]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!shouldLoop || isPaused || !scrollContainer) return;

    let animationId: number;
    let position = scrollContainer.scrollLeft;
    const scrollSpeed = 0.5; // Smooth slow scrolling

    const scroll = () => {
      const firstSet = firstSetRef.current;
      const secondSet = secondSetRef.current;
      if (firstSet && secondSet) {
        // Distance after which the duplicate set lines up with the original
        const loopWidth = secondSet.offsetLeft - firstSet.offsetLeft;
        position += scrollSpeed;
        if (position >= loopWidth) position -= loopWidth;
        scrollContainer.scrollLeft = position;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused, shouldLoop]);

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  return (
    <section className="relative py-16 overflow-hidden bg-white dark:bg-gray-900">
      {/* Header — inside container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            কোর্সে{" "}
            <span className="bg-linear-to-r from-purple-600 to-cyan-500 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              যোগ দিন
            </span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            আমাদের সেরা কোর্সগুলোতে এনরোল করুন এবং আপনার লক্ষ্য অর্জন করুন
          </p>
        </div>
      </div>

      {/* Full-bleed slider — outside container, spans full viewport width */}
      <div className="relative">
        {/* Gradient overlays from true viewport edges */}
        <div className="absolute left-0 top-0 bottom-4 w-24 sm:w-40 bg-linear-to-r from-white to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-4 w-24 sm:w-40 bg-linear-to-l from-white to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none" />

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-hidden scrollbar-hide"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ cursor: isPaused ? "grab" : "default" }}
        >
          <div
            ref={trackRef}
            className={`flex gap-5 pb-4 px-8 sm:px-16 ${shouldLoop ? "" : "justify-center"}`}
          >
            {/* Second copy exists only for the seamless infinite loop */}
            {(shouldLoop ? [0, 1] : [0]).map((copy) => (
              <div
                key={copy}
                ref={copy === 0 ? firstSetRef : secondSetRef}
                className="flex gap-5 shrink-0"
                aria-hidden={copy === 1 || undefined}
              >
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="min-w-72 md:min-w-80 shrink-0 group flex flex-col rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-linear-to-br from-purple-500 via-violet-500 to-cyan-500 shrink-0">
                      {course.thumbnail && (
                        <Image
                          src={getThumbnailUrl(course.thumbnail)}
                          alt={course.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="320px"
                        />
                      )}
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                      {/* Discount badge */}
                      {course.price > 0 &&
                        course.discountPrice > 0 &&
                        course.discountPrice < course.price && (
                          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                            {Math.round(
                              ((course.price - course.discountPrice) /
                                course.price) *
                                100,
                            )}
                            % ছাড়
                          </span>
                        )}
                      {/* Category badge on image */}
                      <span className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/30">
                        {course.category}
                      </span>
                    </div>
    
                    {/* Body — flex-col, flex-1 so button stays at bottom */}
                    <div className="flex flex-col flex-1 p-4 gap-3">
                      {/* Title */}
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
    
                      {/* Instructor */}
                      {course.instructor && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span className="line-clamp-1">{course.instructor}</span>
                        </div>
                      )}
    
                      {/* Description */}
                      {course.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      )}
    
                      {/* Stats row */}
                      {(course.totalLessons > 0 ||
                        course.enrolledStudents > 0 ||
                        course.duration > 0 ||
                        course.rating > 0) && (
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          {course.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {(course.rating ?? 0).toFixed(1)}
                              </span>
                            </div>
                          )}
                          {course.totalLessons > 0 && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{course.totalLessons} লেসন</span>
                            </div>
                          )}
                          {course.enrolledStudents > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              <span>{course.enrolledStudents} জন</span>
                            </div>
                          )}
                          {course.duration > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatDuration(course.duration)}</span>
                            </div>
                          )}
                        </div>
                      )}
    
                      {/* Level & Language badges */}
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50">
                          {course.level === "beginner"
                            ? "শুরুর স্তর"
                            : course.level === "intermediate"
                              ? "মধ্যম স্তর"
                              : "উন্নত স্তর"}
                        </span>
                        {course.language && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                            {course.language}
                          </span>
                        )}
                      </div>
    
                      {/* Spacer pushes price+button to bottom */}
                      <div className="flex-1" />
    
                      {/* Price */}
                      <div className="flex items-baseline gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                        {course.discountPrice === 0 ? (
                          <span className="text-xl font-extrabold text-emerald-500">
                            ফ্রি
                          </span>
                        ) : (
                          <>
                            <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400">
                              ৳{course.discountPrice}
                            </span>
                            {course.discountPrice < course.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ৳{course.price}
                              </span>
                            )}
                          </>
                        )}
                      </div>
    
                      {/* Enroll Button — always at bottom */}
                      <Link href={`/courses/${course.slug}`} className="block">
                        <Button className="w-full bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl py-5 text-sm shadow-sm hover:shadow-purple-200 dark:hover:shadow-purple-900/30 transition-all duration-300">
                          এনরোল করুন →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View All Button — back inside container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-10">
          <Link href="/courses">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-white transition-all duration-300"
            >
              সকল কোর্স দেখুন
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
