// app/(admin)/dashboard/mcq/_components/mcq-management.tsx
"use client";

import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/data-table";
import { CommonBadge } from "@/components/common/common-badge";
import {
  getMcqExams,
  createMcqExam,
  deleteMcqExam,
  toggleMcqExamPublish,
  publishMcqResults,
  unpublishMcqResults,
  getMcqQuestions,
  createMcqQuestion,
  deleteMcqQuestion,
  getMcqExamSubmissions,
  getMcqLeaderboard,
  type McqExam,
  type McqQuestion,
  type McqSubmission,
} from "@/lib/api";

interface LeaderboardEntry {
  rank: number;
  studentId: { _id: string; fullName: string; email: string };
  obtainedMarks: number;
  percentage: number;
  submittedAt: string;
}

// Column definitions for exams table
const examColumns: Column[] = [
  { key: "title", name: "পরীক্ষার নাম", width: 220 },
  { key: "description", name: "বিবরণ", width: 250 },
  { key: "duration", name: "সময়কাল", width: 100, align: "center" },
  { key: "questions", name: "প্রশ্ন", width: 90, align: "center" },
  { key: "marks", name: "নম্বর", width: 120, align: "center" },
  {
    key: "publishStatus",
    name: "পাবলিশ স্ট্যাটাস",
    width: 120,
    align: "center",
  },
  { key: "resultStatus", name: "ফলাফল স্ট্যাটাস", width: 130, align: "center" },
  { key: "actions", name: "অ্যাকশন", width: 80, align: "right" },
];

// Icons
const Icons = {
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
  plus: () => (
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  trash: () => (
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
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
  users: () => (
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
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
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
  x: () => (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  eye: () => (
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
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  questions: () => (
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
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  results: () => (
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
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  trophy: () => (
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
        d="M8 21h8m-4-4v4M5 3H3a2 2 0 000 4c0 1.5.5 3 2 4m14-8h2a2 2 0 010 4c0 1.5-.5 3-2 4M5 7h14v4a7 7 0 01-14 0V7z"
      />
    </svg>
  ),
  moreVertical: () => (
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
        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
      />
    </svg>
  ),
};

const McqManagement = () => {
  const [exams, setExams] = useState<McqExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<McqExam | null>(null);
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [submissions, setSubmissions] = useState<McqSubmission[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [view, setView] = useState<
    "list" | "questions" | "results" | "leaderboard"
  >("list");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<
    "all" | "published" | "draft" | "result-published"
  >("all");

  // Modal states
  const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);

  // Form states
  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    duration: "30",
    passingMarks: "40",
    accessCode: "",
  });

  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    marks: "1",
  });

  // Fetch exams
  useEffect(() => {
    fetchExams();
  }, [filter]);

  const fetchExams = async () => {
    try {
      setLoading(true);

      // Prepare filter params for API
      const params: {
        isPublished?: boolean;
        isResultPublished?: boolean;
      } = {};

      if (filter === "published") {
        params.isPublished = true;
      } else if (filter === "draft") {
        params.isPublished = false;
      } else if (filter === "result-published") {
        params.isResultPublished = true;
      }

      const response = await getMcqExams(params);
      if (response.success) {
        setExams(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (examId: string) => {
    try {
      setQuestionsLoading(true);
      const response = await getMcqQuestions(examId);
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const fetchSubmissions = async (examId: string) => {
    try {
      setQuestionsLoading(true);
      const response = await getMcqExamSubmissions(examId);
      if (response.success) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();

    const duration = parseInt(examForm.duration) || 30;
    const passingMarks = parseInt(examForm.passingMarks) || 40;

    if (duration < 1) {
      alert("সময়কাল কমপক্ষে ১ মিনিট হতে হবে");
      return;
    }

    try {
      const response = await createMcqExam({
        ...examForm,
        duration,
        passingMarks,
        accessCode: examForm.accessCode.trim() || undefined,
      });
      if (response.success) {
        setIsCreateExamModalOpen(false);
        setExamForm({
          title: "",
          description: "",
          duration: "30",
          passingMarks: "40",
          accessCode: "",
        });
        fetchExams();
      } else {
        alert(response.message || "পরীক্ষা তৈরি করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to create exam:", error);
      alert("পরীক্ষা তৈরি করতে সমস্যা হয়েছে");
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই পরীক্ষা মুছে ফেলতে চান?")) return;

    try {
      const response = await deleteMcqExam(examId);
      if (response.success) {
        fetchExams();
      } else {
        alert(response.message || "পরীক্ষা মুছতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to delete exam:", error);
    }
  };

  const handleTogglePublish = async (examId: string) => {
    try {
      const response = await toggleMcqExamPublish(examId);
      if (response.success) {
        fetchExams();
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  };

  const handlePublishResults = async (examId: string) => {
    try {
      const response = await publishMcqResults(examId);
      if (response.success) {
        fetchExams();
        alert("ফলাফল প্রকাশ করা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to publish results:", error);
    }
  };

  const handleUnpublishResults = async (examId: string) => {
    try {
      const response = await unpublishMcqResults(examId);
      if (response.success) {
        fetchExams();
        alert("ফলাফল লুকানো হয়েছে");
      }
    } catch (error) {
      console.error("Failed to unpublish results:", error);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;

    const marks = parseInt(questionForm.marks, 10) || 1;

    if (marks < 1) {
      alert("মার্কস কমপক্ষে ১ হতে হবে");
      return;
    }

    // Validate at least one correct option
    const hasCorrect = questionForm.options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      alert("অন্তত একটি সঠিক উত্তর নির্বাচন করুন");
      return;
    }

    try {
      const response = await createMcqQuestion({
        examId: selectedExam._id,
        ...questionForm,
        marks,
      });
      if (response.success) {
        setIsAddQuestionModalOpen(false);
        setQuestionForm({
          questionText: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          marks: "1",
        });
        fetchQuestions(selectedExam._id);
      } else {
        alert(response.message || "প্রশ্ন যোগ করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই প্রশ্ন মুছে ফেলতে চান?")) return;

    try {
      const response = await deleteMcqQuestion(questionId);
      if (response.success && selectedExam) {
        fetchQuestions(selectedExam._id);
      }
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  const addOption = () => {
    if (questionForm.options.length < 4) {
      setQuestionForm({
        ...questionForm,
        options: [...questionForm.options, { text: "", isCorrect: false }],
      });
    }
  };

  const removeOption = (index: number) => {
    if (questionForm.options.length > 2) {
      const newOptions = questionForm.options.filter((_, i) => i !== index);
      setQuestionForm({ ...questionForm, options: newOptions });
    }
  };

  const updateOption = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean,
  ) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleViewQuestions = (exam: McqExam) => {
    setSelectedExam(exam);
    setView("questions");
    fetchQuestions(exam._id);
  };

  const handleViewResults = (exam: McqExam) => {
    setSelectedExam(exam);
    setView("results");
    fetchSubmissions(exam._id);
  };

  const handleViewLeaderboard = async (exam: McqExam) => {
    setSelectedExam(exam);
    setView("leaderboard");
    try {
      setQuestionsLoading(true);
      const res = await getMcqLeaderboard(exam._id, 50);
      if (res.success) setLeaderboard(res.data);
      else setLeaderboard([]);
    } catch (e) {
      console.error("Failed to fetch leaderboard:", e);
      setLeaderboard([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleBack = () => {
    setView("list");
    setSelectedExam(null);
    setQuestions([]);
    setSubmissions([]);
    setLeaderboard([]);
  };

  // Transform exams data for DataTable
  const tableData = exams.map((exam) => ({
    title: (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white text-sm">
          {exam.title}
        </p>
      </div>
    ),
    description: (
      <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2">
        {exam.description || "-"}
      </p>
    ),
    duration: (
      <div className="flex items-center justify-center gap-1 text-sm text-slate-700 dark:text-gray-300">
        <Icons.clock />
        <span>{exam.duration} মিনিট</span>
      </div>
    ),
    questions: (
      <div className="flex items-center justify-center gap-1 text-sm text-slate-700 dark:text-gray-300">
        <Icons.questions />
        <span>{exam.totalQuestions} টি</span>
      </div>
    ),
    marks: (
      <div className="text-sm text-slate-700 dark:text-gray-300 text-center">
        <div>
          মোট: <span className="font-medium">{exam.totalMarks}</span>
        </div>
        <div className="text-xs text-slate-500 dark:text-gray-400">
          পাস: {exam.passingMarks}
        </div>
      </div>
    ),
    publishStatus: (
      <div className="flex justify-center">
        <CommonBadge
          status={exam.isPublished ? "প্রকাশিত" : "ড্রাফট"}
          size="sm"
        />
      </div>
    ),
    resultStatus: (
      <div className="flex justify-center">
        {exam.isResultPublished ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300">
            ফলাফল প্রকাশিত
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-gray-500">-</span>
        )}
      </div>
    ),
    actions: (
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Icons.moreVertical />
              <span className="sr-only">অ্যাকশন মেনু</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => handleViewQuestions(exam)}
              className="gap-2"
            >
              <Icons.questions />
              <span>প্রশ্ন দেখুন</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleViewResults(exam)}
              className="gap-2"
            >
              <Icons.results />
              <span>ফলাফল দেখুন</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleViewLeaderboard(exam)}
              className="gap-2 text-amber-600 dark:text-amber-400"
            >
              <Icons.trophy />
              <span>লিডারবোর্ড দেখুন</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleTogglePublish(exam._id)}
              className={`gap-2 ${
                exam.isPublished
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              <Icons.check />
              <span>{exam.isPublished ? "আনপাবলিশ করুন" : "পাবলিশ করুন"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDeleteExam(exam._id)}
              className="gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400"
            >
              <Icons.trash />
              <span>ডিলিট করুন</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }));

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 dark:text-gray-300 font-medium">
            লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // Questions View
  if (view === "questions" && selectedExam) {
    return (
      <div>
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <Icons.back />
                ফিরে যান
              </Button>
              <div className="h-6 w-px bg-slate-200 dark:bg-gray-600"></div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {selectedExam.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  {questions.length} টি প্রশ্ন
                </p>
              </div>
              <Button
                onClick={() => setIsAddQuestionModalOpen(true)}
                className="gap-2"
              >
                <Icons.plus />
                প্রশ্ন যোগ করুন
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {questionsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : questions.length === 0 ? (
            <Card className="border-0 shadow-md dark:bg-gray-800">
              <CardContent className="py-12 text-center">
                <Icons.questions />
                <p className="text-slate-500 dark:text-gray-400 mt-2">
                  কোনো প্রশ্ন পাওয়া যায়নি
                </p>
                <Button
                  onClick={() => setIsAddQuestionModalOpen(true)}
                  className="mt-4 gap-2"
                >
                  <Icons.plus />
                  প্রথম প্রশ্ন যোগ করুন
                </Button>
              </CardContent>
            </Card>
          ) : (
            questions.map((question, index) => (
              <Card
                key={question._id}
                className="border-0 shadow-md dark:bg-gray-800"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-primary text-white text-xs font-medium px-2 py-0.5 rounded">
                          প্রশ্ন {index + 1}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-gray-400">
                          মার্কস: {question.marks}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {question.questionText}
                      </p>
                      <div className="mt-3 space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2 p-2 rounded ${
                              option.isCorrect
                                ? "bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700"
                                : "bg-slate-50 dark:bg-gray-700"
                            }`}
                          >
                            <span className="w-6 h-6 rounded-full bg-white dark:bg-gray-600 border dark:border-gray-500 flex items-center justify-center text-xs font-medium dark:text-white">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span
                              className={
                                option.isCorrect
                                  ? "text-emerald-700 dark:text-emerald-300 font-medium"
                                  : "text-slate-700 dark:text-gray-300"
                              }
                            >
                              {option.text}
                            </span>
                            {option.isCorrect && (
                              <span className="ml-auto text-emerald-600 dark:text-emerald-400">
                                <Icons.check />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Icons.trash />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Question Modal */}
        <Dialog
          open={isAddQuestionModalOpen}
          onOpenChange={setIsAddQuestionModalOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>নতুন প্রশ্ন যোগ করুন</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <Label>প্রশ্ন</Label>
                <Textarea
                  value={questionForm.questionText}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      questionText: e.target.value,
                    })
                  }
                  placeholder="প্রশ্ন লিখুন..."
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>অপশনসমূহ (সঠিক উত্তর টিক দিন)</Label>
                  {questionForm.options.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Icons.plus />
                      অপশন যোগ করুন
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={(checked) =>
                          updateOption(index, "isCorrect", checked as boolean)
                        }
                      />
                      <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium dark:text-white">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          updateOption(index, "text", e.target.value)
                        }
                        placeholder={`অপশন ${String.fromCharCode(65 + index)}`}
                        required
                        className="flex-1"
                      />
                      {questionForm.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-rose-500"
                        >
                          <Icons.x />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>মার্কস</Label>
                <Input
                  type="number"
                  min="1"
                  value={questionForm.marks}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      marks: e.target.value,
                    })
                  }
                  className="mt-1 w-24"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddQuestionModalOpen(false)}
                  className="flex-1"
                >
                  বাতিল
                </Button>
                <Button type="submit" className="flex-1">
                  প্রশ্ন যোগ করুন
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Results View
  if (view === "results" && selectedExam) {
    return (
      <div>
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <Icons.back />
                ফিরে যান
              </Button>
              <div className="h-6 w-px bg-slate-200 dark:bg-gray-600"></div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {selectedExam.title} - ফলাফল
                </h1>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  {submissions.length} জন পরীক্ষার্থী
                </p>
              </div>
              {selectedExam.isResultPublished ? (
                <Button
                  variant="outline"
                  onClick={() => handleUnpublishResults(selectedExam._id)}
                >
                  ফলাফল লুকান
                </Button>
              ) : (
                <Button onClick={() => handlePublishResults(selectedExam._id)}>
                  ফলাফল প্রকাশ করুন
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {questionsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : submissions.length === 0 ? (
            <Card className="border-0 shadow-md dark:bg-gray-800">
              <CardContent className="py-12 text-center">
                <Icons.results />
                <p className="text-slate-500 dark:text-gray-400 mt-2">
                  কেউ এখনও পরীক্ষা দেয়নি
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md overflow-hidden dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        শিক্ষার্থী
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        প্রাপ্ত নম্বর
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        শতাংশ
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        স্ট্যাটাস
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        সময়
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {submissions.map((submission, index) => {
                      const student = submission.studentId as {
                        _id: string;
                        fullName: string;
                        email: string;
                      };
                      return (
                        <tr
                          key={submission._id}
                          className="hover:bg-slate-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-3 text-sm dark:text-gray-300">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {student?.fullName || "অজানা"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-gray-400">
                              {student?.email || ""}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium dark:text-white">
                              {submission.obtainedMarks} /{" "}
                              {submission.totalMarks}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-medium ${submission.isPassed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                            >
                              {submission.percentage}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {submission.isPassed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                <Icons.check /> পাস
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                                <Icons.x /> ফেল
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500 dark:text-gray-400">
                            {submission.submittedAt
                              ? new Date(submission.submittedAt).toLocaleString(
                                  "bn-BD",
                                )
                              : "-"}
                            {submission.isAutoSubmitted && (
                              <span className="block text-xs text-amber-600 dark:text-amber-400">
                                অটো সাবমিট
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Leaderboard View
  if (view === "leaderboard" && selectedExam) {
    return (
      <div>
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="gap-2"
              >
                <Icons.back />
                ফিরে যান
              </Button>
              <div className="h-6 w-px bg-slate-200 dark:bg-gray-600" />
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {selectedExam.title} — লিডারবোর্ড
                </h1>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  {leaderboard.length} জন শীর্ষ পারফর্মার (সর্বোচ্চ ৫০)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {questionsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <Card className="border-0 shadow-md dark:bg-gray-800">
              <CardContent className="py-12 text-center">
                <Icons.trophy />
                <p className="text-slate-500 dark:text-gray-400 mt-2">
                  এখনো কোনো submission নেই
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-md overflow-hidden dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-gray-600">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        র‍্যাংক
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        শিক্ষার্থী
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        প্রাপ্ত নম্বর
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        শতাংশ
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300">
                        জমার সময়
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {leaderboard.map((entry, idx) => (
                      <tr
                        key={entry.studentId?._id ?? idx}
                        className={`hover:bg-slate-50 dark:hover:bg-gray-700 ${entry.rank <= 3 ? "bg-amber-50/40 dark:bg-amber-500/5" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              entry.rank === 1
                                ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                : entry.rank === 2
                                  ? "bg-slate-100 dark:bg-slate-600/30 text-slate-600 dark:text-slate-300"
                                  : entry.rank === 3
                                    ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {entry.rank === 1
                              ? "🥇"
                              : entry.rank === 2
                                ? "🥈"
                                : entry.rank === 3
                                  ? "🥉"
                                  : entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {entry.studentId?.fullName ?? "—"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">
                            {entry.studentId?.email ?? ""}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-medium dark:text-white">
                          {entry.obtainedMarks} / {selectedExam.totalMarks}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-medium ${entry.percentage >= (selectedExam.passingMarks / selectedExam.totalMarks) * 100 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                          >
                            {entry.percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-gray-400">
                          {entry.submittedAt
                            ? new Date(entry.submittedAt).toLocaleString(
                                "bn-BD",
                              )
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Main List View
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                MCQ পরীক্ষা
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                পরীক্ষা তৈরি এবং ম্যানেজ করুন
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tabs
                defaultValue="all"
                value={filter}
                onValueChange={(val) => setFilter(val as typeof filter)}
                className="hidden sm:block"
              >
                <TabsList className="bg-slate-100/80 dark:bg-gray-700/80 p-1 rounded-lg">
                  <TabsTrigger
                    value="all"
                    className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
                  >
                    📚 সব
                  </TabsTrigger>
                  <TabsTrigger
                    value="published"
                    className="text-xs data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    ✅ প্রকাশিত
                  </TabsTrigger>
                  <TabsTrigger
                    value="draft"
                    className="text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                  >
                    📝 ড্রাফট
                  </TabsTrigger>
                  <TabsTrigger
                    value="result-published"
                    className="text-xs data-[state=active]:bg-sky-500 data-[state=active]:text-white"
                  >
                    📊 ফলাফল প্রকাশিত
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                size="sm"
                onClick={() => setIsCreateExamModalOpen(true)}
                className="gap-1.5 shadow-md shadow-primary/20"
              >
                <Icons.plus />
                নতুন পরীক্ষা তৈরি করুন
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500 dark:text-gray-400">
                মোট পরীক্ষা
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {exams.length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500 dark:text-gray-400">
                প্রকাশিত
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {exams.filter((e) => e.isPublished).length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500 dark:text-gray-400">
                ড্রাফট
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {exams.filter((e) => !e.isPublished).length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500 dark:text-gray-400">
                ফলাফল প্রকাশিত
              </p>
              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {exams.filter((e) => e.isResultPublished).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Exams DataTable */}
        <DataTable
          columns={examColumns}
          data={tableData}
          totalItems={exams.length}
          isLoading={loading}
          showSerial={true}
          pagination={false}
        />
      </div>

      {/* Create Exam Modal */}
      <Dialog
        open={isCreateExamModalOpen}
        onOpenChange={setIsCreateExamModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন পরীক্ষা তৈরি করুন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateExam} className="space-y-4">
            <div>
              <Label>পরীক্ষার নাম</Label>
              <Input
                value={examForm.title}
                onChange={(e) =>
                  setExamForm({ ...examForm, title: e.target.value })
                }
                placeholder="যেমন: অধ্যায় ১ - MCQ টেস্ট"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label>বিবরণ (ঐচ্ছিক)</Label>
              <Textarea
                value={examForm.description}
                onChange={(e) =>
                  setExamForm({ ...examForm, description: e.target.value })
                }
                placeholder="পরীক্ষা সম্পর্কে কিছু লিখুন..."
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>সময়কাল (মিনিট)</Label>
                <Input
                  type="number"
                  min="1"
                  value={examForm.duration}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      duration: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>পাস মার্কস</Label>
                <Input
                  type="number"
                  min="0"
                  value={examForm.passingMarks}
                  onChange={(e) =>
                    setExamForm({
                      ...examForm,
                      passingMarks: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>অ্যাক্সেস কোড (ঐচ্ছিক)</Label>
              <Input
                value={examForm.accessCode}
                onChange={(e) =>
                  setExamForm({ ...examForm, accessCode: e.target.value })
                }
                placeholder="যেমন: EXAM2024 — খালি রাখলে সবাই দিতে পারবে"
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                কোড দিলে শুধু যারা কোড জানে তারাই পরীক্ষায় অংশ নিতে পারবে
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateExamModalOpen(false)}
                className="flex-1"
              >
                বাতিল
              </Button>
              <Button type="submit" className="flex-1">
                পরীক্ষা তৈরি করুন
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default McqManagement;
