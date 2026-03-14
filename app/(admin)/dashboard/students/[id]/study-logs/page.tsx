"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudent, getAllStudyLogs } from "@/lib/api";
import type { StudyLog } from "@/lib/api";
import type { Student } from "@/types";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ClipboardList,
  BookOpen,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Filter,
  X,
} from "lucide-react";

export default function StudentStudyLogsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  // Date range filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStart, setAppliedStart] = useState("");
  const [appliedEnd, setAppliedEnd] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await getStudent(studentId);
      if (res.success) setStudent(res.data);
    };
    fetchStudent();
  }, [studentId]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await getAllStudyLogs({
          studentId,
          page,
          limit,
          startDate: appliedStart || undefined,
          endDate: appliedEnd || undefined,
        });
        if (res.success) {
          setLogs(res.data);
          setTotalPages(res.pagination?.totalPages || 1);
          setTotalItems(res.pagination?.totalItems || 0);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [studentId, page, appliedStart, appliedEnd]);

  const applyFilter = () => {
    setPage(1);
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setAppliedStart("");
    setAppliedEnd("");
    setPage(1);
  };

  const hasFilter = appliedStart || appliedEnd;
  const totalHoursOnPage = logs.reduce((s, l) => s + l.totalHours, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <ClipboardList className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Study Log
            </h1>
            {student && (
              <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                <User className="w-3.5 h-3.5" />
                {student.fullName}
                {student.roll && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    রোল: {student.roll}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="border-0 shadow-md dark:bg-gray-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
              <ClipboardList className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">মোট এন্ট্রি</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:bg-gray-800/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalHoursOnPage}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">মোট ঘণ্টা (এই পেজে)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date range filter */}
      <Card className="border-0 shadow-md dark:bg-gray-800/50 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                শুরুর তারিখ
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9 w-44 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                শেষের তারিখ
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9 w-44 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <Button
              onClick={applyFilter}
              className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Filter className="w-4 h-4" />
              ফিল্টার করুন
            </Button>
            {hasFilter && (
              <Button variant="outline" onClick={clearFilter} className="gap-2">
                <X className="w-4 h-4" />
                মুছুন
              </Button>
            )}
          </div>
          {hasFilter && (
            <p className="mt-2 text-xs text-violet-600 dark:text-violet-400 font-medium">
              {appliedStart && `${new Date(appliedStart).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}`}
              {appliedStart && appliedEnd && " — "}
              {appliedEnd && `${new Date(appliedEnd).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}`}
              {" "} · {totalItems} টি ফলাফল
            </p>
          )}
        </CardContent>
      </Card>

      {/* Logs */}
      <Card className="border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white text-base">
            সকল লগ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardList className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">কোনো লগ পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {logs.map((log) => (
                <div key={log._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      <Calendar className="w-4 h-4 text-violet-500" />
                      {new Date(log.date).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full text-xs font-semibold text-violet-700 dark:text-violet-300">
                      <Clock className="w-3 h-3" />
                      {log.totalHours} ঘণ্টা
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {log.entries.map((e, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        {e.subject}
                        <span className="font-semibold text-violet-600 dark:text-violet-400">{e.hours}h</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                পেজ {page} / {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
