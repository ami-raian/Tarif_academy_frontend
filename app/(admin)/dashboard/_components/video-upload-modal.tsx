"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_TARIFACADEMY_API_URL ||
  "http://localhost:5000/api/v1";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  existingSections: string[];
  onUploadSuccess: () => void;
}

// Icons
const Icons = {
  upload: () => (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  ),
  file: () => (
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
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  close: () => (
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
        d="M6 18L18 6M6 6l12 12"
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
};

export const VideoUploadModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  existingSections,
  onUploadSuccess,
}: VideoUploadModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [isFree, setIsFree] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    const ls = localStorage.getItem("accessToken");
    if (ls) return ls;
    const match = document.cookie.match(new RegExp("(^| )accessToken=([^;]+)"));
    if (match) return decodeURIComponent(match[2]);
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
      ];
      if (!validTypes.includes(file.type)) {
        setError(
          "অনুগ্রহ করে একটি ভ্যালিড ভিডিও ফাইল সিলেক্ট করুন (MP4, WebM, MOV, AVI)",
        );
        return;
      }
      // Validate file size (500MB max)
      if (file.size > 500 * 1024 * 1024) {
        setError("ফাইল সাইজ 500MB এর বেশি হতে পারবে না");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
      ];
      if (!validTypes.includes(file.type)) {
        setError("অনুগ্রহ করে একটি ভ্যালিড ভিডিও ফাইল সিলেক্ট করুন");
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        setError("ফাইল সাইজ 500MB এর বেশি হতে পারবে না");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  const handleUpload = async () => {
    // Validation
    if (!title.trim()) {
      setError("ভিডিও টাইটেল দিন");
      return;
    }
    if (!sectionTitle.trim()) {
      setError("সেকশন টাইটেল দিন");
      return;
    }
    if (!selectedFile) {
      setError("ভিডিও ফাইল সিলেক্ট করুন");
      return;
    }

    setError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("courseId", courseId);
      formData.append("sectionTitle", sectionTitle);
      formData.append("order", order.toString());
      formData.append("isFree", isFree.toString());

      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setSuccess(true);
            setTimeout(() => {
              onUploadSuccess();
              handleClose();
            }, 1500);
          } else {
            setError(response.message || "আপলোড ব্যর্থ হয়েছে");
          }
        } else {
          const response = JSON.parse(xhr.responseText);
          setError(response.message || "আপলোড ব্যর্থ হয়েছে");
        }
        setUploading(false);
      });

      xhr.addEventListener("error", () => {
        setError("নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।");
        setUploading(false);
      });

      xhr.open("POST", `${API_BASE_URL}/videos/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "আপলোড ব্যর্থ হয়েছে";
      setError(errorMessage);
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setTitle("");
      setDescription("");
      setSectionTitle("");
      setOrder(1);
      setIsFree(false);
      setSelectedFile(null);
      setUploadProgress(0);
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">ভিডিও আপলোড করুন</DialogTitle>
          <p className="text-sm text-slate-500 mt-1">{courseTitle}</p>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Icons.check />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">আপলোড সফল!</h3>
            <p className="text-slate-500 mt-1">ভিডিও প্রসেসিং শুরু হয়েছে</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {/* File Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                selectedFile
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-300 hover:border-primary hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Icons.file />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900 truncate max-w-62.5">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="ml-2"
                  >
                    <Icons.close />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-slate-400 mb-2 flex justify-center">
                    <Icons.upload />
                  </div>
                  <p className="text-slate-600 font-medium">
                    ভিডিও ফাইল ড্র্যাগ করুন বা ক্লিক করুন
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    MP4, WebM, MOV, AVI (সর্বোচ্চ 500MB)
                  </p>
                </>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">ভিডিও টাইটেল *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: Introduction to JavaScript"
                disabled={uploading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">বিবরণ</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                rows={2}
                disabled={uploading}
              />
            </div>

            {/* Section Title */}
            <div className="space-y-2">
              <Label htmlFor="sectionTitle">সেকশন টাইটেল *</Label>
              <Input
                id="sectionTitle"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="যেমন: Getting Started"
                list="sections"
                disabled={uploading}
              />
              {existingSections.length > 0 && (
                <datalist id="sections">
                  {existingSections.map((section) => (
                    <option key={section} value={section} />
                  ))}
                </datalist>
              )}
              <p className="text-xs text-slate-400">
                বিদ্যমান সেকশনে যোগ করতে সেকশন নাম টাইপ করুন
              </p>
            </div>

            {/* Order & isFree */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">ক্রম *</Label>
                <Input
                  id="order"
                  type="number"
                  min={1}
                  value={order || ""}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  onBlur={() => {
                    if (order < 1) setOrder(1);
                  }}
                  disabled={uploading}
                />
              </div>
              <div className="space-y-2">
                <Label>ফ্রি ভিডিও?</Label>
                <div className="flex items-center h-10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      disabled={uploading}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-600">
                      হ্যাঁ, এটি ফ্রি
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

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">আপলোড হচ্ছে...</span>
                  <span className="text-primary font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={uploading}
                className="flex-1"
              >
                বাতিল
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex-1"
              >
                {uploading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
