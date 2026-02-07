"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/data-table";
import { getAllStudents, getCookie } from "@/lib/api";
import type { Student } from "@/types";
import { PAGE_SIZE } from "@/components/table/page-size";
import {
  ChevronLeft,
  Users,
  ShieldCheck,
  CheckCircle,
  User,
  UserCircle,
  RefreshCw,
} from "lucide-react";

interface StudentRow {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  bloodGroup: string;
  sscBoard: string;
  isVerified: string;
  isActive: string;
  createdAt: string;
}

const genderMap: Record<string, string> = {
  male: "পুরুষ",
  female: "মহিলা",
  other: "অন্যান্য",
};

function transformStudentToRow(student: Student): StudentRow {
  return {
    _id: student._id,
    fullName: student.fullName,
    email: student.email,
    mobile: student.mobile,
    gender: genderMap[student.gender] || student.gender,
    bloodGroup: student.bloodGroup || "-",
    sscBoard: student.educationalInfo?.ssc?.board
      ? student.educationalInfo.ssc.board.charAt(0).toUpperCase() +
        student.educationalInfo.ssc.board.slice(1)
      : "-",
    isVerified: student.isVerified ? "হ্যাঁ" : "না",
    isActive: student.isActive ? "সক্রিয়" : "নিষ্ক্রিয়",
    createdAt: new Date(student.createdAt).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

const columns: Column<StudentRow>[] = [
  { key: "fullName", name: "নাম", width: 180 },
  { key: "email", name: "ইমেইল", width: 200 },
  { key: "mobile", name: "মোবাইল", width: 130 },
  { key: "gender", name: "লিঙ্গ", width: 80, align: "center" },
  { key: "bloodGroup", name: "রক্তের গ্রুপ", width: 100, align: "center" },
  { key: "sscBoard", name: "SSC বোর্ড", width: 120 },
  { key: "isVerified", name: "ভেরিফাইড", width: 90, align: "center" },
  { key: "isActive", name: "স্ট্যাটাস", width: 90, align: "center" },
  { key: "createdAt", name: "যোগদান", width: 120 },
];

export default function StudentsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZE;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllStudents({ page, limit: pageSize });
      if (res.success) {
        setStudents(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    const token = getCookie("accessToken");
    const userType = getCookie("userType");

    if (!token || userType !== "admin") {
      router.push("/login");
      return;
    }

    fetchStudents();
  }, [router, fetchStudents]);

  const tableData = students.map(transformStudentToRow);

  const stats = {
    total: pagination.totalItems,
    verified: students.filter((s) => s.isVerified).length,
    active: students.filter((s) => s.isActive).length,
    male: students.filter((s) => s.gender === "male").length,
    female: students.filter((s) => s.gender === "female").length,
  };

  if (loading && students.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-gray-700"></div>
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                ড্যাশবোর্ড
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  শিক্ষার্থী ম্যানেজমেন্ট
                </h1>
                <p className="text-slate-500 dark:text-gray-400 mt-1">
                  সকল শিক্ষার্থীদের তথ্য দেখুন
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={fetchStudents}
              disabled={loading}
            >
              <span className={loading ? "animate-spin" : ""}>
                <RefreshCw className="w-4 h-4" />
              </span>
              রিফ্রেশ
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    মোট শিক্ষার্থী
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    ভেরিফাইড
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.verified}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    সক্রিয়
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.active}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    পুরুষ
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.male}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    মহিলা
                  </p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {stats.female}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                  <UserCircle className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DataTable */}
        <Card className="border-0 shadow-lg dark:bg-gray-800">
          <DataTable
            columns={columns}
            data={tableData}
            totalItems={pagination.totalItems}
            isLoading={loading}
            showSerial={true}
            title={
              <div className="p-4 text-lg font-bold text-slate-900 dark:text-white">
                শিক্ষার্থী তালিকা
              </div>
            }
            pagination={true}
          />
        </Card>
      </div>
    </div>
  );
}
