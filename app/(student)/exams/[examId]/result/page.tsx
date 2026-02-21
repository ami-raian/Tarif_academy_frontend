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
import {
  CheckCircle2,
  XCircle,
  PartyPopper,
  Frown,
  ChevronLeft,
  Clock,
  Check,
  X,
} from "lucide-react";

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
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
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
    );
  }

  if (!result) return null;

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/exams">
              <Button
                variant="ghost"
                className="gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                পরীক্ষা তালিকায় ফিরে যান
              </Button>
            </Link>
          </div>

          {/* Result Card */}
          <Card className="overflow-hidden border-0 shadow-xl dark:shadow-gray-900/60 mb-6 dark:bg-gray-800/50">
            {/* Pass / Fail Header */}
            <div
              className={`p-8 text-center ${
                result.isPassed
                  ? "bg-linear-to-br from-emerald-500 to-cyan-500"
                  : "bg-linear-to-br from-rose-500 to-orange-500"
              }`}
            >
              <div className="text-white/80 mb-4 flex justify-center">
                {result.isPassed ? (
                  <PartyPopper className="w-12 h-12" />
                ) : (
                  <Frown className="w-12 h-12" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {result.isPassed
                  ? "অভিনন্দন! আপনি পাস করেছেন!"
                  : "দুঃখিত! আপনি পাস করতে পারেননি"}
              </h1>
              <p className="text-white/90">{exam.title}</p>
            </div>

            <CardContent className="p-8 bg-white dark:bg-gray-800/50">
              {/* Score Circle */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-50 dark:bg-gray-700/50 border-4 border-gray-50 dark:border-gray-700 mb-4">
                  <div>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {result.percentage}
                    </span>
                    <span className="text-xl text-gray-500 dark:text-gray-400">
                      %
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {result.obtainedMarks} / {result.totalMarks}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  প্রাপ্ত নম্বর
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {result.answers.filter((a) => a.isCorrect).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    সঠিক
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {
                      result.answers.filter(
                        (a) => a.selectedOptionIndex !== null && !a.isCorrect,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ভুল
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {
                      result.answers.filter(
                        (a) => a.selectedOptionIndex === null,
                      ).length
                    }
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    উত্তরহীন
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exam.passingMarks}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    পাস মার্ক
                  </p>
                </div>
              </div>

              {/* Submission Info */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  জমা দেওয়া হয়েছে:{" "}
                  {result.submittedAt ? formatDate(result.submittedAt) : "-"}
                </span>
                {result.isAutoSubmitted && (
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded-full text-xs">
                    সময় শেষে অটো সাবমিট
                  </span>
                )}
              </div>

              {/* Toggle Answers Button */}
              <div className="text-center">
                <Button
                  onClick={() => setShowAnswers(!showAnswers)}
                  variant="outline"
                  className="gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {showAnswers ? "উত্তর লুকান" : "বিস্তারিত উত্তর দেখুন"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Answers */}
          {showAnswers && result.answers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                বিস্তারিত উত্তর
              </h2>
              {result.answers.map((answer, index) => {
                const question = answer.questionId as unknown as McqQuestion;
                if (!question || typeof question === "string") return null;

                const selectedIndex = answer.selectedOptionIndex;
                const isCorrect = answer.isCorrect;
                const correctOptionIndex =
                  question.options?.findIndex((opt) => opt.isCorrect) ?? -1;

                return (
                  <Card
                    key={question._id || index}
                    className={`border-l-4 dark:bg-gray-800/50 dark:border-gray-700/50 ${
                      isCorrect
                        ? "border-l-emerald-500"
                        : selectedIndex === null
                          ? "border-l-gray-300 dark:border-l-gray-600"
                          : "border-l-rose-500"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        {/* Question number badge */}
                        <span
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : selectedIndex === null
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                : "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {question.questionText}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            নম্বর: {question.marks || 1}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 ${
                            isCorrect
                              ? "text-emerald-500"
                              : selectedIndex === null
                                ? "text-gray-400 dark:text-gray-500"
                                : "text-rose-500"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : selectedIndex === null ? (
                            <X className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </span>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 ml-11">
                        {question.options?.map((option, optIndex) => {
                          const isSelected = selectedIndex === optIndex;
                          const isCorrectOption =
                            optIndex === correctOptionIndex;

                          let bgClass = "bg-gray-50 dark:bg-gray-700/40";
                          let textClass = "text-gray-700 dark:text-gray-300";
                          let borderClass = "";

                          if (isCorrectOption) {
                            bgClass = "bg-emerald-50 dark:bg-emerald-500/10";
                            textClass =
                              "text-emerald-700 dark:text-emerald-400";
                            borderClass =
                              "border border-emerald-200 dark:border-emerald-500/30";
                          } else if (isSelected && !isCorrect) {
                            bgClass = "bg-rose-50 dark:bg-rose-500/10";
                            textClass = "text-rose-700 dark:text-rose-400";
                            borderClass =
                              "border border-rose-200 dark:border-rose-500/30";
                          }

                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-3 p-3 rounded-lg ${bgClass} ${borderClass}`}
                            >
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCorrectOption
                                    ? "bg-emerald-500 text-white"
                                    : isSelected && !isCorrect
                                      ? "bg-rose-500 text-white"
                                      : "bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 border dark:border-gray-500"
                                }`}
                              >
                                {isCorrectOption ? (
                                  <Check className="w-4 h-4" />
                                ) : isSelected && !isCorrect ? (
                                  <X className="w-4 h-4" />
                                ) : (
                                  String.fromCharCode(65 + optIndex)
                                )}
                              </span>
                              <span className={`flex-1 ${textClass}`}>
                                {option.text}
                              </span>
                              {isCorrectOption && (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  সঠিক উত্তর
                                </span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                                  <XCircle className="w-3.5 h-3.5" />
                                  আপনার উত্তর
                                </span>
                              )}
                              {isSelected && isCorrect && (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  আপনার উত্তর
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
              <Button
                variant="outline"
                size="lg"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                অন্যান্য পরীক্ষা দেখুন
              </Button>
            </Link>
            <Link href="/my-courses">
              <Button
                size="lg"
                className="bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
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
