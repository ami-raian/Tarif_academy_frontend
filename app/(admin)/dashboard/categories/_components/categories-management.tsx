"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/data-table";
import {
  getCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
  type CourseCategory,
} from "@/lib/api";
import { PAGE_SIZE } from "@/components/table/page-size";
import StatsCard from "@/components/common/stats-card";
import {
  FolderKanban,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DeleteConfirmationDialog from "@/components/common/delete-confirmation-dialog";

interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: string;
  createdAt: string;
  action?: React.ReactNode;
}

function transformCategoryToRow(category: CourseCategory): CategoryRow {
  return {
    _id: category._id,
    name: category.name,
    slug: category.slug,
    description: category.description || "-",
    isActive: category.isActive ? "সক্রিয়" : "নিষ্ক্রিয়",
    createdAt: new Date(category.createdAt).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

const columns: Column<CategoryRow>[] = [
  { key: "name", name: "নাম", width: 180 },
  { key: "slug", name: "স্লাগ", width: 160 },
  { key: "description", name: "বিবরণ", width: 250, showFullContent: true },
  { key: "isActive", name: "স্ট্যাটাস", width: 90, align: "center" },
  { key: "createdAt", name: "তৈরির তারিখ", width: 120 },
  { key: "action", name: "অ্যাকশন", width: 80, align: "right" },
];

export default function CategoriesManagement() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [formError, setFormError] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || PAGE_SIZE;

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCourseCategories({ page, limit: pageSize });
      if (res.success) {
        setCategories(res.data);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData({ name: "", description: "", isActive: true });
    setFormError("");
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (category: CourseCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    });
    setFormError("");
    setIsEditModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("ক্যাটাগরি নাম আবশ্যক");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      const result = await createCourseCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      });

      if (result.success) {
        setIsCreateModalOpen(false);
        resetForm();
        fetchCategories();
      } else {
        setFormError(result.message || "ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      setFormError("ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    if (!formData.name.trim()) {
      setFormError("ক্যাটাগরি নাম আবশ্যক");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      const result = await updateCourseCategory(selectedCategory._id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      });

      if (result.success) {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        resetForm();
        fetchCategories();
      } else {
        setFormError(result.message || "ক্যাটাগরি আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      setFormError("ক্যাটাগরি আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      setDeleting(true);
      const result = await deleteCourseCategory(selectedCategory._id);
      if (result.success) {
        setDeleteModalOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      } else {
        alert(result.message || "ক্যাটাগরি মুছতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("ক্যাটাগরি মুছতে সমস্যা হয়েছে");
    } finally {
      setDeleting(false);
    }
  };

  const tableData = categories.map((category) => {
    const row = transformCategoryToRow(category);
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
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleOpenEditModal(category)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                সম্পাদনা
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  setDeleteModalOpen(true);
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
    active: categories.filter((c) => c.isActive).length,
    inactive: categories.filter((c) => !c.isActive).length,
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
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
    <div>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                কোর্স ক্যাটাগরি ম্যানেজমেন্ট
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                কোর্স ক্যাটাগরি যোগ, সম্পাদনা ও মুছুন
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={fetchCategories}
                disabled={loading}
              >
                <span className={loading ? "animate-spin" : ""}>
                  <RefreshCw className="w-4 h-4" />
                </span>
                রিফ্রেশ
              </Button>
              <Button size="sm" onClick={handleOpenCreateModal}>
                <Plus className="w-4 h-4 mr-1" />
                নতুন ক্যাটাগরি
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            label="মোট ক্যাটাগরি"
            value={stats.total}
            icon={FolderKanban}
            variant="violet"
          />
          <StatsCard
            label="সক্রিয়"
            value={stats.active}
            icon={CheckCircle}
            variant="emerald"
          />
          <StatsCard
            label="নিষ্ক্রিয়"
            value={stats.inactive}
            icon={XCircle}
            variant="red"
          />
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={tableData}
          totalItems={pagination.totalItems}
          isLoading={loading}
          showSerial={true}
          pagination={true}
        />
      </div>

      {/* Create Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>নতুন ক্যাটাগরি তৈরি করুন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                ক্যাটাগরি নাম <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="যেমন: HSC, SSC, Programming"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">বিবরণ</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ"
                rows={3}
                disabled={saving}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: checked as boolean,
                  }))
                }
                disabled={saving}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                সক্রিয় রাখুন
              </Label>
            </div>

            {formError && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {formError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={saving}
                className="flex-1"
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "তৈরি হচ্ছে..." : "তৈরি করুন"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ক্যাটাগরি সম্পাদনা করুন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                ক্যাটাগরি নাম <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="যেমন: HSC, SSC, Programming"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">বিবরণ</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ"
                rows={3}
                disabled={saving}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: checked as boolean,
                  }))
                }
                disabled={saving}
              />
              <Label htmlFor="edit-isActive" className="cursor-pointer">
                সক্রিয় রাখুন
              </Label>
            </div>

            {formError && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                {formError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={saving}
                className="flex-1"
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title="ক্যাটাগরি মুছুন"
        itemName={selectedCategory?.name || "এই ক্যাটাগরি"}
        isDeleting={deleting}
      />
    </div>
  );
}
