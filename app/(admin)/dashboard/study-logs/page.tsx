"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllStudyLogs, getAllStudents, type StudyLog } from "@/lib/api";
import {
  ClipboardList,
  Search,
  Calendar,
  Clock,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface StudentOption {
  _id: string;
  fullName: string;
  email: string;
  roll?: string;
}

export default function AdminStudyLogsPage() {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentOption[]>([]);

  // Filters
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [page, selectedStudentId, selectedDate]);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents({ limit: 500 });
      if (res.success) setStudents(res.data);
    } catch {
      // silently fail
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAllStudyLogs({
        page,
        limit,
        studentId: selectedStudentId || undefined,
        date: selectedDate || undefined,
      });
      if (res.success) {
        setLogs(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalItems(res.pagination?.totalItems || 0);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedStudentId("");
    setSelectedDate("");
    setStudentSearch("");
    setPage(1);
  };

  const filteredStudents = students.filter((s) =>
    studentSearch
      ? s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        (s.roll && s.roll.includes(studentSearch))
      : true,
  );

  const selectedStudent = students.find((s) => s._id === selectedStudentId);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getStudentInfo = (log: StudyLog) => {
    if (typeof log.studentId === "object") return log.studentId;
    return null;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            স্টাডি লগ
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
            শিক্ষার্থীরা কতক্ষণ কোন বিষয় পড়েছে দেখুন
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-md dark:bg-gray-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
              <ClipboardList className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">মোট লগ এন্ট্রি</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:bg-gray-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">মোট শিক্ষার্থী</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md dark:bg-gray-800/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {logs.reduce((sum, l) => sum + l.totalHours, 0).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">মোট ঘণ্টা (এই পেজে)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md dark:bg-gray-800/50 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Student filter */}
            <div className="flex-1 min-w-[220px] relative">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                শিক্ষার্থী খুঁজুন
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="নাম, ইমেইল বা রোল নম্বর..."
                  value={selectedStudent ? selectedStudent.fullName : studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setSelectedStudentId("");
                    setShowStudentDropdown(true);
                  }}
                  onFocus={() => setShowStudentDropdown(true)}
                  className="pl-9 dark:bg-gray-700 dark:border-gray-600"
                />
                {selectedStudentId && (
                  <button
                    onClick={() => { setSelectedStudentId(""); setStudentSearch(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {showStudentDropdown && !selectedStudentId && studentSearch && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredStudents.slice(0, 20).map((s) => (
                    <button
                      key={s._id}
                      onClick={() => {
                        setSelectedStudentId(s._id);
                        setStudentSearch("");
                        setShowStudentDropdown(false);
                        setPage(1);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white">{s.fullName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.email}{s.roll ? ` · ${s.roll}` : ""}</div>
                    </button>
                  ))}
                  {filteredStudents.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">কোনো শিক্ষার্থী পাওয়া যায়নি</div>
                  )}
                </div>
              )}
            </div>

            {/* Date filter */}
            <div className="w-48">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                তারিখ ফিল্টার
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
                  className="pl-9 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            {(selectedStudentId || selectedDate) && (
              <Button variant="outline" onClick={clearFilters} className="gap-2 shrink-0">
                <X className="w-4 h-4" />
                ফিল্টার মুছুন
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-0 shadow-xl dark:bg-gray-800/50">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
            <span>সকল স্টাডি লগ</span>
            <span className="text-sm font-normal text-gray-500">{totalItems} টি রেকর্ড</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">কোনো লগ পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {logs.map((log) => {
                const student = getStudentInfo(log);
                return (
                  <div key={log._id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      {/* Student info */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {student ? student.fullName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {student?.fullName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student?.email}
                            {student?.roll ? ` · রোল: ${student.roll}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* Date & hours */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDate(log.date)}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                          <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                            {log.totalHours} ঘণ্টা
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subject entries */}
                    <div className="flex flex-wrap gap-2 ml-12">
                      {log.entries.map((entry, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                          {entry.subject}
                          <span className="font-semibold text-violet-600 dark:text-violet-400">
                            {entry.hours}h
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                পেজ {page} / {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  আগের
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="gap-1"
                >
                  পরের
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
