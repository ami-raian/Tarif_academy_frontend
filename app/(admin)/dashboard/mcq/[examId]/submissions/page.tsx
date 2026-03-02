"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/data-table";
import { PAGE_SIZE } from "@/components/table/page-size";
import {
  getMcqExam,
  getMcqExamSubmissions,
  type McqExam,
  type McqSubmission,
} from "@/lib/api";

interface SubmissionRow {
  id: string;
  roll: string;
  student: string;
  email: string;
  marks: string;
  percentage: string;
  status: ReactNode;
  submittedAt: string;
}

const columns: Column<SubmissionRow>[] = [
  { key: "roll", name: "রোল", width: 90, align: "center" },
  { key: "student", name: "শিক্ষার্থী", width: 220 },
  { key: "email", name: "ইমেইল", width: 230 },
  { key: "marks", name: "প্রাপ্ত নম্বর", width: 120, align: "center" },
  { key: "percentage", name: "শতাংশ", width: 100, align: "center" },
  { key: "status", name: "স্ট্যাটাস", width: 110, align: "center" },
  { key: "submittedAt", name: "সময়", width: 190 },
];

export default function McqSubmissionsPage() {
  const params = useParams<{ examId: string }>();
  const searchParams = useSearchParams();
  const examId =
    typeof params?.examId === "string"
      ? params.examId
      : Array.isArray(params?.examId)
        ? params.examId[0]
        : "";
  const [exam, setExam] = useState<McqExam | null>(null);
  const [submissions, setSubmissions] = useState<McqSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZE;

  const fetchData = useCallback(async () => {
    if (!examId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [examRes, submissionsRes] = await Promise.all([
        getMcqExam(examId),
        getMcqExamSubmissions(examId, { page, limit: pageSize }),
      ]);

      if (examRes.success) {
        setExam(examRes.data);
      }

      if (submissionsRes.success) {
        setSubmissions(submissionsRes.data || []);
        if (submissionsRes.pagination) {
          setPagination(submissionsRes.pagination);
        }
      }
    } catch (error) {
      console.error("Failed to fetch exam submissions:", error);
    } finally {
      setLoading(false);
    }
  }, [examId, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tableData = useMemo<SubmissionRow[]>(() => {
    return submissions.map((submission) => {
      const student =
        typeof submission.studentId === "string"
          ? null
          : (submission.studentId as {
              _id: string;
              roll?: string;
              fullName: string;
              email: string;
            });

      return {
        id: submission._id,
        roll: student?.roll || "-",
        student: student?.fullName || "অজানা",
        email: student?.email || "-",
        marks: `${submission.obtainedMarks} / ${submission.totalMarks}`,
        percentage: `${submission.percentage}%`,
        status: submission.isPassed ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
            পাস
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
            ফেল
          </span>
        ),
        submittedAt: submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString("bn-BD")
          : "-",
      };
    });
  }, [submissions]);

  return (
    <div>
      <div className="sticky top-14 lg:top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href="/dashboard/mcq">
                  <ArrowLeft className="h-4 w-4" />
                  ফিরে যান
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {exam?.title || "পরীক্ষার ফলাফল"}
                </h1>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {pagination.totalItems} জন পরীক্ষার্থী
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={fetchData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              রিফ্রেশ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {!examId && (
          <Card>
            <CardContent className="py-6 text-center text-sm text-rose-600 dark:text-rose-400">
              পরীক্ষার আইডি পাওয়া যায়নি। আবার চেষ্টা করুন।
            </CardContent>
          </Card>
        )}

        {exam && (
          <Card>
            <CardContent className="py-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-slate-500 dark:text-gray-400">সময়কাল</p>
                <p className="font-medium">{exam.duration} মিনিট</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-gray-400">মোট নম্বর</p>
                <p className="font-medium">{exam.totalMarks}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-gray-400">পাশ নম্বর</p>
                <p className="font-medium">{exam.passingMarks}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-gray-400">প্রশ্ন</p>
                <p className="font-medium">{exam.totalQuestions}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={tableData}
              totalItems={pagination.totalItems}
              isLoading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
