// app/(student)/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/(home)/_components/navbar";
import {
  getPublishedMcqExams,
  getMcqLeaderboard,
  getStudentProfile,
  getCookie,
  type McqExam,
} from "@/lib/api";
import { Trophy, Medal, Clock, ChevronDown, Users, Star } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  studentId: {
    _id: string;
    roll: string;
    fullName: string;
    email: string;
  };
  obtainedMarks: number;
  percentage: number;
  submittedAt: string;
}

const MEDAL_COLORS = [
  {
    bg: "bg-amber-100 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/40",
    label: "১ম",
  },
  {
    bg: "bg-slate-100 dark:bg-slate-500/20",
    text: "text-slate-500 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-500/40",
    label: "২য়",
  },
  {
    bg: "bg-orange-100 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-500/40",
    label: "৩য়",
  },
];

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const color = MEDAL_COLORS[rank - 1];
    return (
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${color.bg} ${color.text} ${color.border}`}
      >
        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
      {rank}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
    </div>
  );
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [exams, setExams] = useState<McqExam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myStudentId, setMyStudentId] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [lbLoading, setLbLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<McqExam | null>(null);

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "student") {
      router.push("/login");
      return;
    }

    const init = async () => {
      try {
        const [examsRes, profileRes] = await Promise.all([
          getPublishedMcqExams({ limit: 100 }),
          getStudentProfile(),
        ]);

        if (examsRes.success) {
          const published = (examsRes.data as McqExam[]).filter(
            (e) => e.isResultPublished,
          );
          setExams(published);
          if (published.length > 0) {
            setSelectedExamId(published[0]._id);
            setSelectedExam(published[0]);
          }
        }

        if (profileRes.success) {
          setMyStudentId(profileRes.data._id || profileRes.data.id || "");
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  useEffect(() => {
    if (!selectedExamId) return;
    const fetchLb = async () => {
      try {
        setLbLoading(true);
        const res = await getMcqLeaderboard(selectedExamId, limit);
        if (res.success) {
          setLeaderboard(res.data);
        } else {
          setLeaderboard([]);
        }
      } catch (err) {
        console.error("Leaderboard error:", err);
        setLeaderboard([]);
      } finally {
        setLbLoading(false);
      }
    };
    fetchLb();
  }, [selectedExamId, limit]);

  const handleExamChange = (examId: string) => {
    setSelectedExamId(examId);
    setSelectedExam(exams.find((e) => e._id === examId) ?? null);
  };

  const myEntry = leaderboard.find((e) => e.studentId?._id === myStudentId);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl">
                <SkeletonRow />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/20 mb-4">
              <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              লিডারবোর্ড
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              পরীক্ষার সেরা পারফর্মারদের র‍্যাংকিং
            </p>
          </div>

          {exams.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-16 text-center shadow-sm border border-gray-200 dark:border-gray-700/50">
              <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                এখনো কোনো ফলাফল প্রকাশিত হয়নি
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                পরীক্ষা সম্পন্ন হলে লিডারবোর্ড এখানে দেখা যাবে
              </p>
            </div>
          ) : (
            <>
              {/* Exam Selector + Limit */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <select
                    value={selectedExamId}
                    onChange={(e) => handleExamChange(e.target.value)}
                    className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                  >
                    {exams.map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex gap-2">
                  {[10, 25, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => setLimit(n)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                        limit === n
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      Top {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exam Info Bar */}
              {selectedExam && (
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    মোট নম্বর:{" "}
                    <strong className="text-gray-900 dark:text-white">
                      {selectedExam.totalMarks}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-500" />
                    সময়:{" "}
                    <strong className="text-gray-900 dark:text-white">
                      {selectedExam.duration} মিনিট
                    </strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-500" />
                    অংশগ্রহণকারী:{" "}
                    <strong className="text-gray-900 dark:text-white">
                      {leaderboard.length}+
                    </strong>
                  </span>
                </div>
              )}

              {/* My Rank Banner */}
              {myEntry && (
                <div className="mb-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 flex items-center gap-4">
                  <Medal className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                      আপনার র‍্যাংক: #{myEntry.rank}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {myEntry.obtainedMarks}/{selectedExam?.totalMarks} নম্বর ·{" "}
                      {myEntry.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Leaderboard Table */}
              <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                {lbLoading ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {[...Array(5)].map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="py-16 text-center">
                    <Trophy className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      এখনো কোনো submission নেই
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {leaderboard.map((entry, idx) => {
                      const isMe = entry.studentId?._id === myStudentId;
                      return (
                        <div
                          key={entry.studentId?._id ?? idx}
                          className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                            isMe
                              ? "bg-purple-50 dark:bg-purple-500/10"
                              : entry.rank <= 3
                                ? "bg-amber-50/40 dark:bg-amber-500/5"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                          }`}
                        >
                          <RankBadge rank={entry.rank} />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className={`font-semibold truncate ${isMe ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-white"}`}
                              >
                                {entry.studentId?.fullName ?? "—"}
                                {entry.studentId?.roll && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 font-normal">
                                    ({entry.studentId.roll})
                                  </span>
                                )}
                              </p>
                              {isMe && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-medium shrink-0">
                                  আপনি
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                              {entry.studentId?.email ?? ""}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <p
                              className={`font-bold text-base ${
                                entry.rank === 1
                                  ? "text-amber-600 dark:text-amber-400"
                                  : entry.rank === 2
                                    ? "text-slate-500 dark:text-slate-400"
                                    : entry.rank === 3
                                      ? "text-orange-600 dark:text-orange-400"
                                      : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {entry.obtainedMarks}
                              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                                /{selectedExam?.totalMarks}
                              </span>
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {entry.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
