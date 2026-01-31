"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/(home)/_components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getMcqExamResult,
  getCookie,
  type McqExam,
  type McqQuestion,
  type McqSubmission,
} from "@/lib/api";

// Icons
const Icons = {
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
  x: () => (
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
  trophy: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  sad: () => (
    <svg
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
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
};

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [result, setResult] = useState<McqSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "student") {
      router.push("/login");
      return;
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await getMcqExamResult(examId);

        if (response.success) {
          setResult(response.data);
        } else {
          alert(response.message || "ফলাফল পাওয়া যায়নি");
          router.push("/exams");
        }
      } catch (error) {
        console.error("Failed to fetch result:", error);
        router.push("/exams");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-600 font-medium">লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const exam = result.examId as McqExam;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/exams">
              <Button variant="ghost" className="gap-2">
                <Icons.back />
                পরীক্ষা তালিকায় ফিরে যান
              </Button>
            </Link>
          </div>

          {/* Result Card */}
          <Card className="overflow-hidden border-0 shadow-xl mb-6">
            <div
              className={`p-8 text-center ${
                result.isPassed
                  ? "bg-gradient-to-br from-emerald-500 to-cyan-500"
                  : "bg-gradient-to-br from-rose-500 to-orange-500"
              }`}
            >
              <div className="text-white/80 mb-4">
                {result.isPassed ? <Icons.trophy /> : <Icons.sad />}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {result.isPassed
                  ? "অভিনন্দন! আপনি পাস করেছেন!"
                  : "দুঃখিত! আপনি পাস করতে পারেননি"}
              </h1>
              <p className="text-white/90">{exam.title}</p>
            </div>

            <CardContent className="p-8">
              {/* Score Display */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-50 border-4 border-gray-100 mb-4">
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      {result.percentage}
                    </span>
                    <span className="text-xl text-gray-500">%</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.obtainedMarks} / {result.totalMarks}
                </div>
                <p className="text-gray-500 mt-1">প্রাপ্ত নম্বর</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {result.answers.filter((a) => a.isCorrect).length}
                  </p>
                  <p className="text-sm text-gray-500">সঠিক</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      result.answers.filter(
                        (a) => a.selectedOptionIndex !== null && !a.isCorrect,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-500">ভুল</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      result.answers.filter(
                        (a) => a.selectedOptionIndex === null,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-500">উত্তরহীন</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {exam.passingMarks}
                  </p>
                  <p className="text-sm text-gray-500">পাস মার্ক</p>
                </div>
              </div>

              {/* Submission Info */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Icons.clock />
                  জমা দেওয়া হয়েছে:{" "}
                  {result.submittedAt ? formatDate(result.submittedAt) : "-"}
                </span>
                {result.isAutoSubmitted && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                    সময় শেষে অটো সাবমিট
                  </span>
                )}
              </div>

              {/* Toggle Answers Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowAnswers(!showAnswers)}
                  variant="outline"
                  className="gap-2"
                >
                  {showAnswers ? "উত্তর লুকান" : "বিস্তারিত উত্তর দেখুন"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Answers */}
          {showAnswers && result.answers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                বিস্তারিত উত্তর
              </h2>
              {result.answers.map((answer, index) => {
                // questionId is populated with full question data
                const question = answer.questionId as unknown as McqQuestion;
                if (!question || typeof question === "string") return null;

                const selectedIndex = answer.selectedOptionIndex;
                const isCorrect = answer.isCorrect;
                const correctOptionIndex =
                  question.options?.findIndex((opt) => opt.isCorrect) ?? -1;

                return (
                  <Card
                    key={question._id || index}
                    className={`border-l-4 ${
                      isCorrect
                        ? "border-l-emerald-500"
                        : selectedIndex === null
                          ? "border-l-gray-300"
                          : "border-l-rose-500"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <span
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCorrect
                              ? "bg-emerald-100 text-emerald-700"
                              : selectedIndex === null
                                ? "bg-gray-100 text-gray-600"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {question.questionText}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            নম্বর: {question.marks || 1}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 ${
                            isCorrect
                              ? "text-emerald-500"
                              : selectedIndex === null
                                ? "text-gray-400"
                                : "text-rose-500"
                          }`}
                        >
                          {isCorrect ? <Icons.check /> : <Icons.x />}
                        </span>
                      </div>

                      <div className="space-y-2 ml-11">
                        {question.options?.map((option, optIndex) => {
                          const isSelected = selectedIndex === optIndex;
                          const isCorrectOption =
                            optIndex === correctOptionIndex;

                          let bgClass = "bg-gray-50";
                          let textClass = "text-gray-700";
                          let borderClass = "";

                          if (isCorrectOption) {
                            bgClass = "bg-emerald-50";
                            textClass = "text-emerald-700";
                            borderClass = "border border-emerald-200";
                          } else if (isSelected && !isCorrect) {
                            bgClass = "bg-rose-50";
                            textClass = "text-rose-700";
                            borderClass = "border border-rose-200";
                          }

                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-3 p-3 rounded-lg ${bgClass} ${borderClass}`}
                            >
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                                  isCorrectOption
                                    ? "bg-emerald-500 text-white"
                                    : isSelected && !isCorrect
                                      ? "bg-rose-500 text-white"
                                      : "bg-white text-gray-600 border"
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className={`flex-1 ${textClass}`}>
                                {option.text}
                              </span>
                              {isCorrectOption && (
                                <span className="text-emerald-500 text-sm">
                                  সঠিক উত্তর
                                </span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="text-rose-500 text-sm">
                                  আপনার উত্তর
                                </span>
                              )}
                              {isSelected && isCorrect && (
                                <span className="text-emerald-500 text-sm">
                                  আপনার উত্তর ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/exams">
              <Button variant="outline" size="lg">
                অন্যান্য পরীক্ষা দেখুন
              </Button>
            </Link>
            <Link href="/my-courses">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-500"
              >
                আমার কোর্সে যান
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
