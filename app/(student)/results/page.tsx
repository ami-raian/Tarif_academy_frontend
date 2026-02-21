"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/(home)/_components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMyMcqExams,
  getCookie,
  type McqSubmission,
  type McqExam,
} from "@/lib/api";
import {
  Trophy,
  Calendar,
  ChevronRight,
  Clock,
  Target,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  Award,
  BarChart3,
} from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<McqSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "student") {
      router.push("/login");
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await getMyMcqExams();
        if (response.success) {
          setSubmissions(response.data);
        } else {
          console.error("Failed to fetch results:", response.message);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateStats = () => {
    const totalExams = submissions.length;
    const passedExams = submissions.filter((s) => s.isPassed).length;
    const averagePercentage =
      totalExams > 0
        ? Math.round(
            submissions.reduce((sum, s) => sum + s.percentage, 0) / totalExams,
          )
        : 0;
    const totalMarksObtained = submissions.reduce(
      (sum, s) => sum + s.obtainedMarks,
      0,
    );

    return {
      totalExams,
      passedExams,
      averagePercentage,
      totalMarksObtained,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
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
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  পরীক্ষার ফলাফল
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  আপনার সকল পরীক্ষার বিস্তারিত ফলাফল দেখুন
                </p>
              </div>
            </div>
          </div>

          {submissions.length === 0 ? (
            <Card className="border-0 shadow-xl dark:bg-gray-800/50">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  কোনো পরীক্ষার ফলাফল নেই
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  আপনি এখনো কোনো পরীক্ষায় অংশগ্রহণ করেননি
                </p>
                <Link href="/exams">
                  <Button className="gap-2">
                    <Target className="w-4 h-4" />
                    পরীক্ষায় অংশগ্রহণ করুন
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-0 shadow-lg bg-linear-to-br from-blue-500 to-cyan-500 text-white dark:from-blue-600 dark:to-cyan-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <BarChart3 className="w-8 h-8 opacity-80" />
                      <div className="text-right">
                        <p className="text-3xl font-bold">{stats.totalExams}</p>
                        <p className="text-sm opacity-90">মোট পরীক্ষা</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-linear-to-br from-emerald-500 to-green-500 text-white dark:from-emerald-600 dark:to-green-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle2 className="w-8 h-8 opacity-80" />
                      <div className="text-right">
                        <p className="text-3xl font-bold">
                          {stats.passedExams}
                        </p>
                        <p className="text-sm opacity-90">পাস করেছেন</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-linear-to-br from-purple-500 to-pink-500 text-white dark:from-purple-600 dark:to-pink-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-8 h-8 opacity-80" />
                      <div className="text-right">
                        <p className="text-3xl font-bold">
                          {stats.averagePercentage}%
                        </p>
                        <p className="text-sm opacity-90">গড় শতাংশ</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-linear-to-br from-amber-500 to-orange-500 text-white dark:from-amber-600 dark:to-orange-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-8 h-8 opacity-80" />
                      <div className="text-right">
                        <p className="text-3xl font-bold">
                          {stats.totalMarksObtained}
                        </p>
                        <p className="text-sm opacity-90">মোট নম্বর</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results List */}
              <Card className="border-0 shadow-xl dark:bg-gray-800/50">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-gray-900 dark:text-white">
                    সকল পরীক্ষার ফলাফল
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {submissions.map((submission) => {
                      const exam = submission.examId as McqExam;
                      return (
                        <div
                          key={submission._id}
                          className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {/* Exam Title and Status */}
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {exam.title}
                                </h3>
                                {submission.isPassed ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    পাস
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full text-xs font-semibold">
                                    <XCircle className="w-3.5 h-3.5" />
                                    ফেইল
                                  </span>
                                )}
                              </div>

                              {/* Exam Details */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                      স্কোর
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      {submission.obtainedMarks}/
                                      {submission.totalMarks}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                      শতাংশ
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      {submission.percentage}%
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                      সঠিক উত্তর
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      {
                                        submission.answers.filter(
                                          (a) => a.isCorrect,
                                        ).length
                                      }
                                      /{submission.answers.length}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                                      তারিখ
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                                      {new Date(
                                        submission.submittedAt ||
                                          submission.startedAt,
                                      ).toLocaleDateString("bn-BD", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Time Info */}
                              {submission.submittedAt && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>
                                    জমা দেওয়া হয়েছে:{" "}
                                    {formatDate(submission.submittedAt)}
                                  </span>
                                  {submission.isAutoSubmitted && (
                                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded">
                                      স্বয়ংক্রিয়
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* View Details Button */}
                            <div className="shrink-0">
                              {exam.isResultPublished && (
                                <Link href={`/exams/${exam._id}/result`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 group"
                                  >
                                    বিস্তারিত দেখুন
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Result Not Published Notice */}
                          {!exam.isResultPublished && (
                            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                              ⏳ এই পরীক্ষার বিস্তারিত ফলাফল এখনো প্রকাশ করা
                              হয়নি। দয়া করে পরে আবার চেক করুন।
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
