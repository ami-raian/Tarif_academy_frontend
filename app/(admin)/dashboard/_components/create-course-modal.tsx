// app/(admin)/dashboard/_components/create-course-modal.tsx
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
  createCourse,
  uploadCourseThumbnail,
  getAuthToken,
  getCourseCategories,
  type CourseCategory,
} from "@/lib/api";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: () => void;
}

// Icons
const Icons = {
  check: () => (
    <svg
      className="w-6 h-6"
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
  image: () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
};

export const CreateCourseModal = ({
  isOpen,
  onClose,
  onCourseCreated,
}: CreateCourseModalProps) => {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic categories
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          setCategoriesLoading(true);
          const res = await getCourseCategories({ isActive: true, limit: 50 });
          if (res.success && res.data.length > 0) {
            setCategories(res.data);
            setCategoryId(res.data[0]._id);
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
      setError("");
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      const data = await createCourse(courseData);

      if (data.success) {
        // Upload thumbnail if selected
        if (thumbnail && data.data?._id) {
          try {
            await uploadCourseThumbnail(data.data._id, thumbnail);
          } catch (uploadErr) {
            console.error("Thumbnail upload failed:", uploadErr);
            // Don't fail the whole process if thumbnail upload fails
          }
        }

        setSuccess(true);
        setTimeout(() => {
          onCourseCreated();
          handleClose();
        }, 1500);
      } else {
        setError(data.message || "Failed to create course");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create course";
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
      setCategoryId(categories.length > 0 ? categories[0]._id : "");
      setLevel("beginner");
      setLanguage("Bangla");
      setIsPublished(false);
      setError("");
      setSuccess(false);
      setThumbnail(null);
      setThumbnailPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Course</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
              <Icons.check />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Course Created Successfully!
            </h3>
            <p className="text-slate-500 dark:text-gray-400 mt-1">
              Your course has been created
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Title */}
            <FormField
              type="input"
              id="title"
              label="Course Title"
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
              label="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what students will learn..."
              rows={3}
              disabled={loading}
            />

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>থাম্বনেইল (ঐচ্ছিক)</Label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  disabled={loading}
                />
                {thumbnailPreview ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors text-slate-500 dark:text-slate-400"
                    disabled={loading}
                  >
                    <Icons.image />
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
                label="Price (BDT)"
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
                label="Discount Price (BDT)"
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
                label="Category"
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={loading || categoriesLoading}
                placeholder={
                  categoriesLoading ? "Loading..." : "Select category"
                }
                options={categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))}
              />
              <FormField
                type="select"
                id="level"
                label="Level"
                value={level}
                onValueChange={(value) =>
                  setLevel(value as "beginner" | "intermediate" | "advanced")
                }
                disabled={loading}
                placeholder="Select level"
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
            </div>

            {/* Language & Published */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="select"
                id="language"
                label="Language"
                value={language}
                onValueChange={setLanguage}
                disabled={loading}
                placeholder="Select language"
                options={languages.map((lang) => ({
                  value: lang,
                  label: lang,
                }))}
              />
              <div className="space-y-2">
                <Label>Publish Status</Label>
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
                      Publish immediately
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
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
