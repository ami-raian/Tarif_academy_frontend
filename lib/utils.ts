import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setRoute(
  router: AppRouterInstance,
  params: {
    useBaseUrl?: boolean;
    pathname?: string;
    query?: { [key: string]: string | number | boolean | null };
  },
): void {
  const url = new URL(window.location.href);
  const baseUrl = url.origin + url.pathname;

  const newUrl = params?.useBaseUrl ? new URL(baseUrl) : url;

  // Clear query parameters if using base URL
  if (params?.useBaseUrl) {
    newUrl.search = ""; // Clear any query parameters
  }

  if (params.pathname) {
    newUrl.pathname = params.pathname;
  }

  const queryParams = params.query || {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === false || value === null) {
      newUrl.searchParams.delete(key);
    } else if (value !== undefined) {
      newUrl.searchParams.set(key, value.toString());
    }
  }

  router.push(newUrl.toString());
}
