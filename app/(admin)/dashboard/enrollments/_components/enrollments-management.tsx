// app/(admin)/dashboard/enrollments/_components/enrollments-management.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommonBadge } from "@/components/common/common-badge";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/data-table";
import { PAGE_SIZE } from "@/components/table/page-size";
import {
  getAllEnrollments,
  approveEnrollment,
  rejectEnrollment,
  getCookie,
} from "@/lib/api";
import type { Enrollment, EnrollmentStatus } from "@/types";

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
  x: () => (
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
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
  user: () => (
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  refresh: () => (
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
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
};

// Column definitions
const columns: Column[] = [
  { key: "student", name: "শিক্ষার্থী", width: 220 },
  { key: "course", name: "কোর্স", width: 200 },
  { key: "payment", name: "পেমেন্ট", width: 150 },
  { key: "transactionId", name: "TxID", width: 130 },
  { key: "enrolledAt", name: "তারিখ", width: 150 },
  { key: "status", name: "স্ট্যাটাস", width: 110, align: "center" },
  { key: "actions", name: "অ্যাকশন", width: 200, align: "right" },
];

export default function EnrollmentsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | EnrollmentStatus>("pending");
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: PAGE_SIZE,
  });
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZE;

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllEnrollments({
        status: filter === "all" ? undefined : filter,
        page,
        limit: pageSize,
      });
      if (res.success) {
        setEnrollments(res.data.enrollments);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, page, pageSize]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleApprove = async (enrollmentId: string) => {
    try {
      setProcessingId(enrollmentId);
      const res = await approveEnrollment(enrollmentId);
      if (res.success) {
        // Update local state
        setEnrollments((prev) =>
          prev.map((e) =>
            e._id === enrollmentId
              ? { ...e, status: "approved" as EnrollmentStatus }
              : e,
          ),
        );
        // Optionally refetch
        fetchEnrollments();
      } else {
        alert(res.message || "অনুমোদন করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      alert("অনুমোদন করতে সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (enrollmentId: string) => {
    try {
      setProcessingId(enrollmentId);
      const res = await rejectEnrollment(enrollmentId, rejectReason);
      if (res.success) {
        setEnrollments((prev) =>
          prev.map((e) =>
            e._id === enrollmentId
              ? { ...e, status: "rejected" as EnrollmentStatus }
              : e,
          ),
        );
        setShowRejectModal(null);
        setRejectReason("");
        fetchEnrollments();
      } else {
        alert(res.message || "প্রত্যাখ্যান করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("প্রত্যাখ্যান করতে সমস্যা হয়েছে");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    const statusMap: Record<EnrollmentStatus, string> = {
      pending: "অপেক্ষমাণ",
      approved: "অনুমোদিত",
      rejected: "প্রত্যাখ্যাত",
    };
    return <CommonBadge status={statusMap[status]} size="sm" />;
  };

  // Transform enrollments data for DataTable
  const tableData = enrollments.map((enrollment) => ({
    student: (
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
          {enrollment.studentId?.fullName?.charAt(0) || "S"}
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white text-sm">
            {enrollment.studentId?.fullName || "Unknown"}
          </p>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            {enrollment.studentId?.email}
          </p>
        </div>
      </div>
    ),
    course: (
      <span className="text-sm text-slate-700 dark:text-gray-300">
        {enrollment.courseId?.title || "Unknown Course"}
      </span>
    ),
    payment: (
      <span className="text-sm font-medium text-slate-900 dark:text-white">
        ৳{enrollment.paymentAmount}
      </span>
    ),
    transactionId: (
      <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
        {enrollment.transactionId || "-"}
      </span>
    ),
    enrolledAt: (
      <span className="text-sm text-slate-600 dark:text-gray-400">
        {formatDate(enrollment.enrolledAt)}
      </span>
    ),
    status: getStatusBadge(enrollment.status),
    actions:
      enrollment.status === "pending" ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            onClick={() => handleApprove(enrollment._id)}
            disabled={processingId === enrollment._id}
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 px-3 text-xs"
          >
            <Icons.check />
            <span className="ml-1">অনুমোদন</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRejectModal(enrollment._id)}
            disabled={processingId === enrollment._id}
            className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-500 dark:hover:bg-red-950 h-8 px-3 text-xs"
          >
            <Icons.x />
            <span className="ml-1">প্রত্যাখ্যান</span>
          </Button>
        </div>
      ) : (
        <div className="flex justify-end">
          <span className="text-xs text-slate-400 dark:text-gray-500">-</span>
        </div>
      ),
  }));

  if (loading && enrollments.length === 0) {
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

  return (
    <div>
      {/* Header */}
      <div className="sticky top-14 lg:top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                এনরোলমেন্ট ম্যানেজমেন্ট
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                শিক্ষার্থীদের এনরোলমেন্ট অনুমোদন করুন
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Tabs
                value={filter}
                defaultValue="pending"
                onValueChange={(value) => setFilter(value as typeof filter)}
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-4 w-full sm:w-auto bg-slate-100 dark:bg-gray-700 p-1 rounded-lg">
                  <TabsTrigger
                    value="pending"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    ⏳ অপেক্ষমাণ
                  </TabsTrigger>
                  <TabsTrigger
                    value="approved"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    ✅ অনুমোদিত
                  </TabsTrigger>
                  <TabsTrigger
                    value="rejected"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    ❌ প্রত্যাখ্যাত
                  </TabsTrigger>
                  <TabsTrigger
                    value="all"
                    className="text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    📚 সব
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                size="sm"
                variant="outline"
                onClick={fetchEnrollments}
                disabled={loading}
              >
                <span className={loading ? "animate-spin" : ""}>
                  <Icons.refresh />
                </span>
                রিফ্রেশ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    মোট
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {pagination.total}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Icons.user />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    অপেক্ষমাণ
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {enrollments.filter((e) => e.status === "pending").length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Icons.clock />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    অনুমোদিত
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {enrollments.filter((e) => e.status === "approved").length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Icons.check />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    প্রত্যাখ্যাত
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {enrollments.filter((e) => e.status === "rejected").length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <Icons.x />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrollments DataTable */}
        <DataTable
          columns={columns}
          data={tableData}
          totalItems={pagination.total}
          isLoading={loading}
          showSerial={true}
          pagination={true}
        />
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              এনরোলমেন্ট প্রত্যাখ্যান
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                প্রত্যাখ্যানের কারণ (ঐচ্ছিক)
              </label>
              <textarea
                className="w-full p-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="কারণ লিখুন..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                }}
              >
                বাতিল
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => handleReject(showRejectModal)}
                disabled={processingId === showRejectModal}
              >
                প্রত্যাখ্যান করুন
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
