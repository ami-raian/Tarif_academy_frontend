// app/(admin)/dashboard/_components/edit-course-modal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateCourse,
  uploadCourseThumbnail,
  getAuthToken,
  getCourseCategories,
  getThumbnailUrl,
  type CourseCategory,
} from "@/lib/api";
import type { Course } from "@/types";
import { Check, ImageIcon, X } from "lucide-react";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseUpdated: () => void;
  course: Course | null;
}

export const EditCourseModal = ({
  isOpen,
  onClose,
  onCourseUpdated,
  course,
}: EditCourseModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  );
  const [language, setLanguage] = useState("Bangla");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic categories
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Populate form when course changes
  useEffect(() => {
    if (course && isOpen) {
      setTitle(course.title || "");
      setDescription(course.description || "");
      setPrice(course.price?.toString() || "");
      setDiscountPrice(course.discountPrice?.toString() || "");
      setCategoryId(course.categoryId || "");
      setLevel(course.level || "beginner");
      setLanguage(course.language || "Bangla");
      setIsPublished(course.isPublished || false);
      setExistingThumbnail(course.thumbnail || null);
      setThumbnail(null);
      setThumbnailPreview(null);
    }
  }, [course, isOpen]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          setCategoriesLoading(true);
          const res = await getCourseCategories({ isActive: true, limit: 50 });
          if (res.success && res.data.length > 0) {
            setCategories(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch categories:", err);
        } finally {
          setCategoriesLoading(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen, categories.length]);

  const languages = ["Bangla", "English", "Hindi"];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("ছবি সাইজ ৫MB এর বেশি হতে পারবে না");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("শুধুমাত্র ছবি ফাইল আপলোড করা যাবে");
        return;
      }
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setExistingThumbnail(null);
      setError("");
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    setExistingThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course) return;

    // Validation
    if (!title.trim()) {
      setError("Course title is required");
      return;
    }
    if (!description.trim()) {
      setError("Course description is required");
      return;
    }
    if (!price || parseFloat(price) < 0) {
      setError("Valid price is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      // Find category name for backward compatibility
      const selectedCategory = categories.find((c) => c._id === categoryId);

      const courseData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        discountPrice: discountPrice
          ? parseFloat(discountPrice)
          : parseFloat(price),
        categoryId,
        category: selectedCategory?.name || "",
        level,
        language,
        isPublished,
      };

      const data = await updateCourse(course._id, courseData);

      if (data.success) {
        // Upload new thumbnail if selected
        if (thumbnail) {
          try {
            await uploadCourseThumbnail(course._id, thumbnail);
          } catch (uploadErr) {
            console.error("Thumbnail upload failed:", uploadErr);
            // Don't fail the whole process if thumbnail upload fails
          }
        }

        setSuccess(true);
        setTimeout(() => {
          onCourseUpdated();
          handleClose();
        }, 1500);
      } else {
        setError(data.message || "Failed to update course");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update course";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setCategoryId("");
      setLevel("beginner");
      setLanguage("Bangla");
      setIsPublished(false);
      setError("");
      setSuccess(false);
      setThumbnail(null);
      setThumbnailPreview(null);
      setExistingThumbnail(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  const currentThumbnail =
    thumbnailPreview ||
    (existingThumbnail ? getThumbnailUrl(existingThumbnail) : null);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl">কোর্স সম্পাদনা</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              কোর্স সফলভাবে আপডেট হয়েছে!
            </h3>
            <p className="text-slate-500 dark:text-gray-400 mt-1">
              পরিবর্তনগুলো সংরক্ষিত হয়েছে
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Title */}
            <FormField
              type="input"
              id="title"
              label="কোর্সের নাম"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete JavaScript Course 2026"
              disabled={loading}
            />

            {/* Description */}
            <FormField
              type="textarea"
              id="description"
              label="বিবরণ"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="কোর্সে কী শেখানো হবে বর্ণনা করুন..."
              rows={3}
              disabled={loading}
            />

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>থাম্বনেইল</Label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  disabled={loading}
                />
                {currentThumbnail ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                    <Image
                      src={currentThumbnail}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-sm font-medium hover:bg-gray-100 transition-colors"
                        disabled={loading}
                      >
                        পরিবর্তন করুন
                      </button>
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors text-slate-500 dark:text-slate-400"
                    disabled={loading}
                  >
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">ছবি আপলোড করতে ক্লিক করুন</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      সর্বোচ্চ ৫MB (JPG, PNG, GIF, WebP)
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Price & Discount Price */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="input"
                inputType="number"
                id="price"
                label="মূল্য (BDT)"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500"
                disabled={loading}
              />
              <FormField
                type="input"
                inputType="number"
                id="discountPrice"
                label="ছাড়ের মূল্য (BDT)"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="999"
                disabled={loading}
              />
            </div>

            {/* Category & Level */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="select"
                id="category"
                label="ক্যাটাগরি"
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={loading || categoriesLoading}
                placeholder={
                  categoriesLoading ? "Loading..." : "ক্যাটাগরি নির্বাচন করুন"
                }
                options={categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
              />
              <FormField
                type="select"
                id="level"
                label="লেভেল"
                value={level}
                onValueChange={(value) =>
                  setLevel(value as "beginner" | "intermediate" | "advanced")
                }
                disabled={loading}
                placeholder="লেভেল নির্বাচন করুন"
                options={[
                  { value: "beginner", label: "শুরু" },
                  { value: "intermediate", label: "মধ্যম" },
                  { value: "advanced", label: "উন্নত" },
                ]}
              />
            </div>

            {/* Language & Published */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="select"
                id="language"
                label="ভাষা"
                value={language}
                onValueChange={setLanguage}
                disabled={loading}
                placeholder="ভাষা নির্বাচন করুন"
                options={languages.map((lang) => ({
                  value: lang,
                  label: lang,
                }))}
              />
              <div className="space-y-2">
                <Label>প্রকাশ স্থিতি</Label>
                <div className="flex items-center h-10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={isPublished}
                      onCheckedChange={(checked) =>
                        setIsPublished(checked as boolean)
                      }
                      disabled={loading}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      এখনই প্রকাশ করুন
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                বাতিল
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;
