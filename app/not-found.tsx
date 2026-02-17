import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white absolute inset-0 z-50">
      <p className="text-4xl font-bold mb-4">404 - Page Not Found</p>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
