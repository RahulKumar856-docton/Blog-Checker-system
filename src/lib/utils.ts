import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "text-green-700 bg-green-100 border-green-200";
    case "rejected":
      return "text-red-700 bg-red-100 border-red-200";
    case "pending":
    default:
      return "text-yellow-700 bg-yellow-100 border-yellow-200";
  }
}

export function getSimilarityColor(score: number) {
  if (score < 30) return "text-green-600";
  if (score < 70) return "text-yellow-600";
  return "text-red-600";
}
