// app/(student)/exams/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/(home)/_components/navbar";
import { Button } from "@/components/ui/button";
import { CommonBadge } from "@/components/common/common-badge";
import {
  getPublishedMcqExams,
  getMyMcqExams,
  verifyMcqExamCode,
  getCookie,
  type McqExam,
  type McqSubmission,
} from "@/lib/api";
import {
  Clock,
  HelpCircle,
  CheckCircle2,
  X,
  Play,
  Trophy,
  Inbox,
  Lock,
} from "lucide-react";

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<McqExam[]>([]);
  const [mySubmissions, setMySubmissions] = useState<McqSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "completed">("all");

  // Access code modal state
  const [codeModalExam, setCodeModalExam] = useState<McqExam | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);

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
        const [examsRes, submissionsRes] = await Promise.all([
          getPublishedMcqExams(),
          getMyMcqExams(),
        ]);
        if (examsRes.success) setExams(examsRes.data);
        if (submissionsRes.success) setMySubmissions(submissionsRes.data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getSubmissionForExam = (examId: string) => {
    return mySubmissions.find(
      (s) => (typeof s.examId === "string" ? s.examId : s.examId._id) === examId,
    );
  };

  const checkIfPassed = (submission: McqSubmission, exam: McqExam) => {
    if (submission.isPassed !== undefined) return submission.isPassed;
    return submission.obtainedMarks >= exam.passingMarks;
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeModalExam) return;
    setCodeLoading(true);
    setCodeError("");
    try {
      const res = await verifyMcqExamCode(codeModalExam._id, codeInput.trim());
      if (res.success) {
        localStorage.setItem(`exam_${codeModalExam._id}`, JSON.stringify(codeModalExam));
        localStorage.setItem(`exam_${codeModalExam._id}_code`, codeInput.trim());
        setCodeModalExam(null);
        setCodeInput("");
        router.push(`/exams/${codeModalExam._id}`);
      } else {
        setCodeError(res.message || "কোড সঠিক নয়");
      }
    } catch {
      setCodeError("সার্ভার সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setCodeLoading(false);
    }
  };

  const filteredExams = exams.filter((exam) => {
    const submission = getSubmissionForExam(exam._id);
    if (filter === "new") return !submission || submission.status === "in_progress";
    if (filter === "completed") return submission?.status === "evaluated";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  </div>
                </div>
              ))}
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MCQ পরীক্ষা</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                প্রকাশিত পরীক্ষাগুলোতে অংশগ্রহণ করুন
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                সব ({exams.length})
              </button>
              <button
                onClick={() => setFilter("new")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "new"
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                নতুন
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "completed"
                    ? "bg-sky-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                সম্পন্ন
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{exams.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">মোট পরীক্ষা</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mySubmissions.filter((s) => s.status === "evaluated").length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">সম্পন্ন</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mySubmissions.filter((s) => {
                      const exam = exams.find(
                        (e) => e._id === (typeof s.examId === "string" ? s.examId : s.examId._id),
                      );
                      return exam && checkIfPassed(s, exam);
                    }).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">পাস</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exams.filter((e) => !getSubmissionForExam(e._id)).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">বাকি আছে</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exams Grid */}
          {filteredExams.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-16 text-center shadow-sm border border-gray-100 dark:border-gray-700/50">
              <div className="flex justify-center text-gray-300 dark:text-gray-600 mb-4">
                <Inbox className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                কোনো পরীক্ষা পাওয়া যায়নি
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter !== "all" ? "অন্য ফিল্টার ব্যবহার করে দেখুন" : "শীঘ্রই নতুন পরীক্ষা যোগ হবে"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => {
                const submission = getSubmissionForExam(exam._id);
                const isCompleted = submission?.status === "evaluated";
                const isInProgress = submission?.status === "in_progress";

                return (
                  <div
                    key={exam._id}
                    className="bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="relative h-32 bg-linear-to-br from-purple-500 to-cyan-500 p-4">
                      <div className="absolute top-3 right-3 flex gap-2">
                        {isCompleted && submission && (
                          <CommonBadge
                            status={checkIfPassed(submission, exam) ? "পাস" : "ফেল"}
                            size="sm"
                          />
                        )}
                        {isInProgress && <CommonBadge status="চলমান" size="sm" />}
                        {exam.hasAccessCode && !isCompleted && !isInProgress && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                            <Lock className="w-3 h-3" />
                            কোড
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-semibold text-white text-lg line-clamp-2">
                          {exam.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {exam.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                          {exam.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {exam.duration} মিনিট
                        </span>
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" />
                          {exam.totalQuestions} প্রশ্ন
                        </span>
                        <span>মোট: {exam.totalMarks} নম্বর</span>
                      </div>

                      {/* Result Section */}
                      {isCompleted && exam.isResultPublished && submission && (
                        <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">প্রাপ্ত নম্বর:</span>
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {submission.obtainedMarks} / {submission.totalMarks}
                            </span>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                checkIfPassed(submission, exam) ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${submission.percentage}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                            {submission.percentage}%
                          </p>
                        </div>
                      )}

                      {isCompleted && !exam.isResultPublished && (
                        <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm">
                          পরীক্ষা জমা দেওয়া হয়েছে। ফলাফল প্রকাশের অপেক্ষায়...
                        </div>
                      )}

                      {/* Action Button */}
                      {isCompleted ? (
                        exam.isResultPublished ? (
                          <Link href={`/exams/${exam._id}/result`}>
                            <Button className="w-full bg-sky-500 hover:bg-sky-600">
                              <span className="flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                বিস্তারিত ফলাফল দেখুন
                              </span>
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            disabled
                            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          >
                            ফলাফল প্রকাশের অপেক্ষায়
                          </Button>
                        )
                      ) : isInProgress ? (
                        <Link href={`/exams/${exam._id}`}>
                          <Button className="w-full bg-amber-500 hover:bg-amber-600">
                            <span className="flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              পরীক্ষা চালিয়ে যান
                            </span>
                          </Button>
                        </Link>
                      ) : exam.hasAccessCode ? (
                        <Button
                          className="w-full bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                          onClick={() => {
                            setCodeInput("");
                            setCodeError("");
                            setCodeModalExam(exam);
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            কোড দিয়ে যোগ দিন
                          </span>
                        </Button>
                      ) : (
                        <Link
                          href={`/exams/${exam._id}`}
                          onClick={() => {
                            localStorage.setItem(`exam_${exam._id}`, JSON.stringify(exam));
                          }}
                        >
                          <Button className="w-full bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600">
                            <span className="flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              পরীক্ষা শুরু করুন
                            </span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Access Code Modal */}
      {codeModalExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/60 w-full max-w-md p-6 border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    অ্যাক্সেস কোড দিন
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {codeModalExam.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCodeModalExam(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              এই পরীক্ষায় অংশ নিতে অ্যাডমিন প্রদত্ত কোড প্রয়োজন।
            </p>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => { setCodeInput(e.target.value); setCodeError(""); }}
                placeholder="অ্যাক্সেস কোড লিখুন..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
                required
              />
              {codeError && (
                <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{codeError}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCodeModalExam(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={codeLoading || !codeInput.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {codeLoading ? "যাচাই হচ্ছে..." : "প্রবেশ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
