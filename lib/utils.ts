import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyFormatter = (
  value: string | number,
  options?: {
    style?: keyof Intl.NumberFormatOptionsStyleRegistry;
    currency?: string;
    minimumFractionDigits?: number;
  }
) =>
  new Intl.NumberFormat("en-IN", {
    style: options?.style ?? "currency",
    currency: options?.currency ?? "INR",
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
  }).format(Number(value));
