"use client";

import { useState } from "react";
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
import { createCourse, getAuthToken } from "@/lib/api";

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
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  );
  const [language, setLanguage] = useState("Bangla");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    "Programming",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Cyber Security",
    "Design",
    "Business",
    "Marketing",
    "Other",
  ];

  const languages = ["Bangla", "English", "Hindi"];

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

    setError("");
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const courseData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        discountPrice: discountPrice
          ? parseFloat(discountPrice)
          : parseFloat(price),
        category,
        level,
        language,
        isPublished,
      };

      const data = await createCourse(courseData);

      if (data.success) {
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
      setCategory("Programming");
      setLevel("beginner");
      setLanguage("Bangla");
      setIsPublished(false);
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Course</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Icons.check />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Course Created Successfully!
            </h3>
            <p className="text-slate-500 mt-1">Your course has been created</p>
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
                value={category}
                onValueChange={setCategory}
                disabled={loading}
                placeholder="Select category"
                options={categories.map((cat) => ({ value: cat, label: cat }))}
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
                    <span className="text-sm text-slate-600">
                      Publish immediately
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-sm">
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
