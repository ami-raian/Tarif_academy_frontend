"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/(home)/_components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { logStudy, getMyStudyLogs, getCookie, type StudyLog, type StudyEntry } from "@/lib/api";
import {
  ClipboardList,
  Plus,
  Trash2,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Get dates that are already logged
function getLoggedDates(logs: StudyLog[]): Set<string> {
  return new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0]));
}

interface LogFormProps {
  targetDate: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

function LogForm({ targetDate, onSuccess, onCancel }: LogFormProps) {
  const [entries, setEntries] = useState<StudyEntry[]>([{ subject: "", hours: 1 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addEntry = () => setEntries([...entries, { subject: "", hours: 1 }]);
  const removeEntry = (i: number) => {
    if (entries.length === 1) return;
    setEntries(entries.filter((_, idx) => idx !== i));
  };
  const updateEntry = (i: number, field: keyof StudyEntry, value: string | number) => {
    const updated = [...entries];
    updated[i] = { ...updated[i], [field]: value };
    setEntries(updated);
  };

  const handleSubmit = async () => {
    setError("");
    for (const entry of entries) {
      if (!entry.subject.trim()) { setError("সকল বিষয়ের নাম লিখুন"); return; }
      if (!entry.hours || entry.hours <= 0) { setError("সকল বিষয়ের জন্য সময় দিন"); return; }
    }
    try {
      setSubmitting(true);
      const res = await logStudy(entries, targetDate);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message || "কিছু একটা ভুল হয়েছে");
      }
    } catch {
      setError("সার্ভার এরর হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const totalHours = entries.reduce((sum, e) => sum + (Number(e.hours) || 0), 0);

  return (
    <div className="space-y-4">
      {entries.map((entry, i) => (
        <div key={i} className="flex gap-3 items-center">
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">বিষয়</label>
            <Input
              placeholder="যেমন: পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান..."
              value={entry.subject}
              onChange={(e) => updateEntry(i, "subject", e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="w-32">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">সময় (ঘণ্টা)</label>
            <Input
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={entry.hours}
              onChange={(e) => updateEntry(i, "hours", parseFloat(e.target.value))}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="pt-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEntry(i)}
              disabled={entries.length === 1}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addEntry}
        className="gap-2 text-violet-600 border-violet-200 hover:bg-violet-50 dark:border-violet-700 dark:hover:bg-violet-900/20"
      >
        <Plus className="w-4 h-4" />
        আরো বিষয় যোগ করুন
      </Button>

      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-1">
        <Clock className="w-4 h-4" />
        মোট পড়ার সময়:{" "}
        <span className="font-bold text-violet-600 dark:text-violet-400">{totalHours} ঘণ্টা</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} className="flex-1">
            বাতিল
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              সংরক্ষণ হচ্ছে...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              লগ জমা দিন
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

const HISTORY_LIMIT = 7;

export default function StudyLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [allLoggedDates, setAllLoggedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [todayLogged, setTodayLogged] = useState(false);
  const [todaySuccess, setTodaySuccess] = useState(false);

  // History pagination
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotal, setHistoryTotal] = useState(0);
  const historyTotalPages = Math.ceil(historyTotal / HISTORY_LIMIT);

  // Previous day form
  const [showPrevForm, setShowPrevForm] = useState(false);
  const [prevDate, setPrevDate] = useState("");
  const [prevDateError, setPrevDateError] = useState("");
  const [prevSuccess, setPrevSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");
    if (!token || userType !== "student") {
      router.push("/login");
      return;
    }
    // Fetch all dates once (for duplicate-check logic)
    fetchAllDates();
  }, [router]);

  useEffect(() => {
    fetchHistoryPage();
  }, [historyPage]);

  // Fetch just enough to know which dates are logged (lightweight)
  const fetchAllDates = async () => {
    try {
      setLoading(true);
      const res = await getMyStudyLogs({ limit: 365 });
      if (res.success) {
        const dated = getLoggedDates(res.data);
        setAllLoggedDates(dated);
        setTodayLogged(dated.has(todayStr()));
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
    fetchHistoryPage();
  };

  const fetchHistoryPage = async () => {
    try {
      const res = await getMyStudyLogs({ page: historyPage, limit: HISTORY_LIMIT });
      if (res.success) {
        setLogs(res.data);
        setHistoryTotal(res.pagination?.totalItems || 0);
      }
    } catch {
      // silently fail
    }
  };

  const refreshAll = () => {
    fetchAllDates();
    setHistoryPage(1);
  };

  const handleTodaySuccess = () => {
    setTodaySuccess(true);
    setTodayLogged(true);
    refreshAll();
  };

  const handlePrevSubmit = () => {
    setPrevDateError("");
    if (!prevDate) { setPrevDateError("একটি তারিখ বেছে নিন"); return; }
    if (prevDate >= todayStr()) { setPrevDateError("আজকের বা ভবিষ্যতের তারিখ দেওয়া যাবে না"); return; }
    if (allLoggedDates.has(prevDate)) { setPrevDateError("এই তারিখের লগ ইতোমধ্যে জমা আছে"); return; }
    // valid — show the form
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDateLabel = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("bn-BD", { month: "long", day: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
            <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const prevDateValid =
    prevDate &&
    prevDate < todayStr() &&
    !allLoggedDates.has(prevDate);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Log</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  প্রতিদিন একবার আপনার পড়াশোনার সময় লগ করুন
                </p>
              </div>
            </div>
          </div>

          {/* Today's Log */}
          <Card className="border-0 shadow-xl dark:bg-gray-800/50 mb-4">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-500" />
                আজকের লগ — {new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {todayLogged && !todaySuccess ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-medium">আপনি আজকের লগ ইতোমধ্যে জমা দিয়েছেন।</p>
                </div>
              ) : todaySuccess ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="font-medium">আজকের পড়াশোনার লগ সফলভাবে সংরক্ষিত হয়েছে!</p>
                </div>
              ) : (
                <LogForm targetDate={todayStr()} onSuccess={handleTodaySuccess} />
              )}
            </CardContent>
          </Card>

          {/* Previous Day Log */}
          <Card className="border-0 shadow-xl dark:bg-gray-800/50 mb-8">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-violet-500" />
                আগের দিনের লগ যোগ করুন
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {prevSuccess ? (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="font-medium">{prevSuccess}-এর লগ সফলভাবে সংরক্ষিত হয়েছে!</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setPrevSuccess(null); setPrevDate(""); setShowPrevForm(false); }}
                    className="ml-auto text-emerald-700 dark:text-emerald-400"
                  >
                    আরো যোগ করুন
                  </Button>
                </div>
              ) : !showPrevForm ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    কোনো দিনের লগ দিতে ভুলে গেলে এখান থেকে যোগ করুন।
                  </p>
                  <div className="flex gap-3 items-end flex-wrap">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                        তারিখ বেছে নিন
                      </label>
                      <Input
                        type="date"
                        value={prevDate}
                        max={new Date(Date.now() - 86400000).toISOString().split("T")[0]}
                        onChange={(e) => { setPrevDate(e.target.value); setPrevDateError(""); }}
                        className="w-48 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        handlePrevSubmit();
                        if (prevDate && prevDate < todayStr() && !allLoggedDates.has(prevDate)) {
                          setShowPrevForm(true);
                        }
                      }}
                      className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <Plus className="w-4 h-4" />
                      লগ যোগ করুন
                    </Button>
                  </div>
                  {prevDateError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      {prevDateError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 text-violet-500" />
                    {formatDate(prevDate)}-এর লগ
                  </div>
                  <LogForm
                    targetDate={prevDate}
                    onSuccess={() => {
                      setPrevSuccess(formatDateLabel(prevDate));
                      setShowPrevForm(false);
                      refreshAll();
                    }}
                    onCancel={() => setShowPrevForm(false)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-0 shadow-xl dark:bg-gray-800/50">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                  আগের লগ
                </div>
                {historyTotal > 0 && (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    মোট {historyTotal} টি
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {logs.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">এখনো কোনো লগ নেই</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-violet-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(log.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                          <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                            {log.totalHours} ঘণ্টা
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {log.entries.map((entry, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                            {entry.subject}
                            <span className="font-semibold text-violet-600 dark:text-violet-400">
                              {entry.hours}h
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {historyTotalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    পেজ {historyPage} / {historyTotalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
                      disabled={historyPage === historyTotalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
