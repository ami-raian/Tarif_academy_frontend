import { Suspense } from "react";
import StudentsManagement from "./_components/students-management";

export default function StudentsPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <StudentsManagement />
    </Suspense>
  );
}
