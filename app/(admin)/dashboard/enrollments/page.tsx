"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  user: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};

export default function EnrollmentsPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | EnrollmentStatus>("pending");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "admin") {
      router.push("/login");
      return;
    }

    fetchEnrollments();
  }, [filter, pagination.page, router]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await getAllEnrollments({
        status: filter === "all" ? undefined : filter,
        page: pagination.page,
        limit: pagination.limit,
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
  };

  const handleApprove = async (enrollmentId: string) => {
    try {
      setProcessingId(enrollmentId);
      const res = await approveEnrollment(enrollmentId);
      if (res.success) {
        // Update local state
        setEnrollments((prev) =>
          prev.map((e) =>
            e._id === enrollmentId ? { ...e, status: "approved" as EnrollmentStatus } : e
          )
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
            e._id === enrollmentId ? { ...e, status: "rejected" as EnrollmentStatus } : e
          )
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
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            অপেক্ষমাণ
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            অনুমোদিত
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            প্রত্যাখ্যাত
          </span>
        );
    }
  };

  if (loading && enrollments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <Icons.back />
                ড্যাশবোর্ড
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">এনরোলমেন্ট ম্যানেজমেন্ট</h1>
                <p className="text-slate-500 mt-1">শিক্ষার্থীদের এনরোলমেন্ট অনুমোদন করুন</p>
              </div>
            </div>
            <Button variant="outline" onClick={fetchEnrollments} disabled={loading}>
              <span className={loading ? "animate-spin" : ""}>
                <Icons.refresh />
              </span>
              রিফ্রেশ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">মোট</p>
                  <p className="text-2xl font-bold text-slate-900">{pagination.total}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                  <Icons.user />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">অপেক্ষমাণ</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {enrollments.filter((e) => e.status === "pending").length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Icons.clock />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">অনুমোদিত</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {enrollments.filter((e) => e.status === "approved").length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Icons.check />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">প্রত্যাখ্যাত</p>
                  <p className="text-2xl font-bold text-red-600">
                    {enrollments.filter((e) => e.status === "rejected").length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <Icons.x />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">এনরোলমেন্ট তালিকা</CardTitle>
              <Tabs
                value={filter}
                onValueChange={(value) => setFilter(value as typeof filter)}
              >
                <TabsList>
                  <TabsTrigger value="pending">অপেক্ষমাণ</TabsTrigger>
                  <TabsTrigger value="approved">অনুমোদিত</TabsTrigger>
                  <TabsTrigger value="rejected">প্রত্যাখ্যাত</TabsTrigger>
                  <TabsTrigger value="all">সব</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {enrollments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Icons.user />
                </div>
                <p className="text-slate-500 font-medium">কোনো এনরোলমেন্ট পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="divide-y">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment._id}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                            {enrollment.studentId?.fullName?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {enrollment.studentId?.fullName || "Unknown Student"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {enrollment.studentId?.email}
                            </p>
                          </div>
                        </div>
                        <div className="ml-13 space-y-1">
                          <p className="text-sm text-slate-700">
                            <span className="font-medium">কোর্স:</span>{" "}
                            {enrollment.courseId?.title || "Unknown Course"}
                          </p>
                          <p className="text-sm text-slate-500">
                            <span className="font-medium">পেমেন্ট:</span> ৳
                            {enrollment.paymentAmount}{" "}
                            {enrollment.transactionId && (
                              <span className="text-slate-400">
                                (TxID: {enrollment.transactionId})
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            <span className="font-medium">তারিখ:</span>{" "}
                            {formatDate(enrollment.enrolledAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(enrollment.status)}
                        {enrollment.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(enrollment._id)}
                              disabled={processingId === enrollment._id}
                              className="bg-emerald-500 hover:bg-emerald-600"
                            >
                              <Icons.check />
                              অনুমোদন
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowRejectModal(enrollment._id)}
                              disabled={processingId === enrollment._id}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Icons.x />
                              প্রত্যাখ্যান
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-slate-500">
                  পেজ {pagination.page} / {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page <= 1}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                  >
                    আগের
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                  >
                    পরের
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              এনরোলমেন্ট প্রত্যাখ্যান
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                প্রত্যাখ্যানের কারণ (ঐচ্ছিক)
              </label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
