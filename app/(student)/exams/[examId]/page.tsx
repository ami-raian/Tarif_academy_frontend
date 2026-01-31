"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getMcqExamForStudent,
  getMcqQuestionsForStudent,
  startMcqExam,
  saveMcqAnswer,
  submitMcqExam,
  getMcqSubmission,
  getCookie,
  type McqExam,
  type McqQuestion,
} from "@/lib/api";

// Icons
const Icons = {
  clock: () => (
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
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
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
  next: () => (
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
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
};

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.examId as string;

  const [exam, setExam] = useState<McqExam | null>(null);
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number | null>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSubmitRef = useRef(false);

  // Check auth
  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "student") {
      router.push("/login");
    }
  }, [router]);

  const handleAutoSubmit = useCallback(async () => {
    if (examEnded) return;
    setExamEnded(true);

    try {
      setSubmitting(true);
      const response = await submitMcqExam(examId, true);
      if (response.success) {
        router.push(`/exams/${examId}/result`);
      }
    } catch (error) {
      console.error("Failed to auto-submit:", error);
    } finally {
      setSubmitting(false);
    }
  }, [examId, examEnded, router]);

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);

        // Try to get exam from localStorage first
        let examData = null;
        try {
          const cachedExam = localStorage.getItem(`exam_${examId}`);
          if (cachedExam) {
            examData = JSON.parse(cachedExam);
          }
        } catch (e) {
          console.error("Failed to load cached exam:", e);
        }

        const [examRes, questionsRes, submissionRes] = await Promise.all([
          examData
            ? Promise.resolve({ success: true, data: examData })
            : getMcqExamForStudent(examId),
          getMcqQuestionsForStudent(examId),
          getMcqSubmission(examId),
        ]);

        if (examRes.success) {
          setExam(examRes.data);
        } else {
          console.error("Exam fetch error:", examRes);
          alert(
            `পরীক্ষা খুঁজে পাওয়া যায়নি: ${examRes.message || "Unknown error"}`,
          );
          router.push("/exams");
          return;
        }

        if (questionsRes.success) {
          setQuestions(questionsRes.data);
        }

        if (submissionRes.success && submissionRes.data) {
          const sub = submissionRes.data;
          if (sub.status === "evaluated") {
            // Already submitted, redirect to results
            router.push(`/exams/${examId}/result`);
            return;
          }
          setExamStarted(true);

          // Restore answers from submission
          const savedAnswers = new Map<string, number | null>();
          sub.answers.forEach(
            (ans: {
              questionId: string;
              selectedOptionIndex: number | null;
            }) => {
              savedAnswers.set(ans.questionId, ans.selectedOptionIndex);
            },
          );
          setAnswers(savedAnswers);

          // Calculate remaining time
          const startedAt = new Date(sub.startedAt).getTime();
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - startedAt) / 1000);
          const totalSeconds = examRes.data.duration * 60;
          const remaining = totalSeconds - elapsedSeconds;

          if (remaining <= 0) {
            // Time already expired, auto-submit
            handleAutoSubmit();
          } else {
            setTimeLeft(remaining);
          }
        }
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId, router, handleAutoSubmit]);

  // Timer effect
  useEffect(() => {
    if (!examStarted || examEnded) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit
          if (!autoSubmitRef.current) {
            autoSubmitRef.current = true;
            handleAutoSubmit();
          }
          return 0;
        }
        // Show warning at 5 minutes
        if (prev === 300) {
          setShowTimeWarning(true);
        }
        // Show warning at 1 minute
        if (prev === 60) {
          setShowTimeWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examStarted, examEnded, handleAutoSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartExam = async () => {
    try {
      setLoading(true);
      const response = await startMcqExam(examId);
      if (response.success) {
        setExamStarted(true);
        setTimeLeft(exam!.duration * 60);

        // Initialize answers map
        const initialAnswers = new Map<string, number | null>();
        questions.forEach((q) => {
          initialAnswers.set(q._id, null);
        });
        setAnswers(initialAnswers);
      } else {
        alert(response.message || "পরীক্ষা শুরু করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to start exam:", error);
      alert("পরীক্ষা শুরু করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = async (optionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion._id, optionIndex);
    setAnswers(newAnswers);

    // Save to server
    try {
      await saveMcqAnswer(examId, {
        questionId: currentQuestion._id,
        selectedOptionIndex: optionIndex,
      });
    } catch (error) {
      console.error("Failed to save answer:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setExamEnded(true);
      const response = await submitMcqExam(examId, false);
      if (response.success) {
        router.push(`/exams/${examId}/result`);
      } else {
        alert(response.message || "পরীক্ষা জমা দিতে সমস্যা হয়েছে");
        setExamEnded(false);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      alert("পরীক্ষা জমা দিতে সমস্যা হয়েছে");
      setExamEnded(false);
    } finally {
      setSubmitting(false);
      setShowConfirmSubmit(false);
    }
  };

  const getAnsweredCount = () => {
    return Array.from(answers.values()).filter((v) => v !== null).length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Pre-exam start screen
  if (!examStarted && exam) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Icons.clock />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {exam.title}
            </h1>
            {exam.description && (
              <p className="text-gray-600">{exam.description}</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">সময়কাল</span>
              <span className="font-semibold text-gray-900">
                {exam.duration} মিনিট
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">মোট প্রশ্ন</span>
              <span className="font-semibold text-gray-900">
                {exam.totalQuestions} টি
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">মোট নম্বর</span>
              <span className="font-semibold text-gray-900">
                {exam.totalMarks}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">পাস নম্বর</span>
              <span className="font-semibold text-gray-900">
                {exam.passingMarks}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-amber-600">
                <Icons.warning />
              </div>
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">গুরুত্বপূর্ণ নির্দেশনা:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>সময় শেষ হলে পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে</li>
                  <li>যেকোনো সময় জমা দিতে পারবেন</li>
                  <li>পৃষ্ঠা রিফ্রেশ করলেও উত্তর সংরক্ষিত থাকবে</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/exams")}
            >
              বাতিল
            </Button>
            <Button
              className="flex-1 bg-linear-to-r from-purple-600 to-cyan-500"
              onClick={handleStartExam}
            >
              পরীক্ষা শুরু করুন
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Exam interface
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = currentQuestion
    ? answers.get(currentQuestion._id)
    : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header with timer */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-gray-900 text-lg">
                {exam?.title}
              </h1>
              <p className="text-sm text-gray-500">
                প্রশ্ন {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg ${
                timeLeft <= 60
                  ? "bg-rose-100 text-rose-700 animate-pulse"
                  : timeLeft <= 300
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <Icons.clock />
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>

            <Button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {submitting ? "জমা হচ্ছে..." : "জমা দিন"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                    প্রশ্ন {currentQuestionIndex + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    নম্বর: {currentQuestion?.marks || 1}
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {currentQuestion?.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      currentAnswer === index
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        currentAnswer === index
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span
                      className={`flex-1 ${
                        currentAnswer === index
                          ? "text-purple-900 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option.text}
                    </span>
                    {currentAnswer === index && (
                      <span className="text-purple-500">
                        <Icons.check />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="gap-2"
                >
                  <Icons.back />
                  আগের প্রশ্ন
                </Button>
                <Button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(questions.length - 1, prev + 1),
                    )
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="gap-2"
                >
                  পরের প্রশ্ন
                  <Icons.next />
                </Button>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-4 sticky top-24">
              <h3 className="font-medium text-gray-900 mb-4">প্রশ্ন তালিকা</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((q, index) => {
                  const answered = answers.get(q._id) !== null;
                  const isCurrent = index === currentQuestionIndex;
                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                        isCurrent
                          ? "bg-purple-600 text-white ring-2 ring-purple-300"
                          : answered
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500"></span>
                  <span className="text-gray-600">
                    উত্তর দেওয়া হয়েছে ({getAnsweredCount()})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-gray-200"></span>
                  <span className="text-gray-600">
                    উত্তর দেওয়া হয়নি ({questions.length - getAnsweredCount()})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-purple-600"></span>
                  <span className="text-gray-600">বর্তমান প্রশ্ন</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>পরীক্ষা জমা দিতে চান?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">মোট প্রশ্ন:</span>
                <span className="font-medium">{questions.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">উত্তর দেওয়া হয়েছে:</span>
                <span className="font-medium text-emerald-600">
                  {getAnsweredCount()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">বাকি আছে:</span>
                <span className="font-medium text-amber-600">
                  {questions.length - getAnsweredCount()}
                </span>
              </div>
            </div>

            {getAnsweredCount() < questions.length && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                আপনি সব প্রশ্নের উত্তর দেননি। জমা দিলে বাকি প্রশ্নগুলো খালি
                থাকবে।
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
              className="flex-1"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? "জমা হচ্ছে..." : "জমা দিন"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Warning Dialog */}
      <Dialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <Icons.warning />
              সময় শেষ হয়ে আসছে!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              {timeLeft <= 60
                ? "মাত্র ১ মিনিট বাকি আছে! দ্রুত জমা দিন।"
                : "মাত্র ৫ মিনিট বাকি আছে। দ্রুত উত্তর সম্পন্ন করুন।"}
            </p>
          </div>
          <Button onClick={() => setShowTimeWarning(false)}>বুঝেছি</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
