"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/data-table";
import { getAllStudents, deleteStudent } from "@/lib/api";
import type { Student } from "@/types";
import { PAGE_SIZE } from "@/components/table/page-size";
import StatsCard from "@/components/common/stats-card";
import {
  Users,
  ShieldCheck,
  CheckCircle,
  User,
  UserCircle,
  RefreshCw,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/common/delete-confirmation-dialog";

interface StudentRow {
  _id: string;
  roll: string;
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  bloodGroup: string;
  sscBoard: string;
  isVerified: string;
  isActive: string;
  createdAt: string;
  action?: React.ReactNode;
}

const genderMap: Record<string, string> = {
  male: "পুরুষ",
  female: "মহিলা",
  other: "অন্যান্য",
};

function transformStudentToRow(student: Student): StudentRow {
  return {
    _id: student._id,
    roll: student.roll || "—",
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
  { key: "roll", name: "রোল", width: 80, align: "center" },
  { key: "fullName", name: "নাম", width: 180 },
  { key: "email", name: "ইমেইল", width: 200 },
  { key: "mobile", name: "মোবাইল", width: 130 },
  { key: "gender", name: "লিঙ্গ", width: 80, align: "center" },
  { key: "bloodGroup", name: "রক্তের গ্রুপ", width: 100, align: "center" },
  { key: "sscBoard", name: "SSC বোর্ড", width: 120 },
  { key: "isVerified", name: "ভেরিফাইড", width: 90, align: "center" },
  { key: "isActive", name: "স্ট্যাটাস", width: 90, align: "center" },
  { key: "createdAt", name: "যোগদান", width: 120 },
  { key: "action", name: "অ্যাকশন", width: 80, align: "right" },
];

export default function StudentsManagement() {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

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
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async () => {
    if (!selectedStudentId) return;
    try {
      setDeleting(true);
      const result = await deleteStudent(selectedStudentId);
      if (result.success) {
        setDeleteModalOpen(false);
        setSelectedStudentId(null);
        fetchStudents();
      }
    } catch (error) {
      console.error("Failed to delete student:", error);
    } finally {
      setDeleting(false);
    }
  };

  const tableData = students.map((student) => {
    const row = transformStudentToRow(student);
    return {
      ...row,
      action: (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/students/${student._id}`}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  দেখুন
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/students/edit/${student._id}`}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  সম্পাদনা
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  setDeleteModalOpen(true);
                  setSelectedStudentId(student._id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                মুছুন
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    };
  });

  const stats = {
    total: pagination.totalItems,
    verified: students.filter((s) => s.isVerified).length,
    active: students.filter((s) => s.isActive).length,
    male: students.filter((s) => s.gender === "male").length,
    female: students.filter((s) => s.gender === "female").length,
  };

  if (loading && students.length === 0) {
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                শিক্ষার্থী ম্যানেজমেন্ট
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                সকল শিক্ষার্থীদের তথ্য দেখুন
              </p>
            </div>
            <Button
              size="sm"
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
          <StatsCard
            label="মোট শিক্ষার্থী"
            value={stats.total}
            icon={Users}
            variant="violet"
          />
          <StatsCard
            label="ভেরিফাইড"
            value={stats.verified}
            icon={ShieldCheck}
            variant="emerald"
          />
          <StatsCard
            label="সক্রিয়"
            value={stats.active}
            icon={CheckCircle}
            variant="blue"
          />
          <StatsCard
            label="পুরুষ"
            value={stats.male}
            icon={User}
            variant="indigo"
          />
          <StatsCard
            label="মহিলা"
            value={stats.female}
            icon={UserCircle}
            variant="pink"
          />
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={tableData}
          totalItems={pagination.totalItems}
          isLoading={loading}
          showSerial={true}
          // title={
          //   <div className="p-4 text-lg font-bold text-slate-900 dark:text-white">
          //     শিক্ষার্থী তালিকা
          //   </div>
          // }
          pagination={true}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title="শিক্ষার্থী মুছুন"
        itemName="এই শিক্ষার্থীকে"
        isDeleting={deleting}
      />
    </div>
  );
}
