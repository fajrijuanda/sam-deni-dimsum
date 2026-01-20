/**
 * Utility functions for formatting values
 */

import {
  CATEGORY_BADGE_COLORS,
  MENU_CATEGORIES,
  TRANSACTION_STATUS,
} from "./constants";

/**
 * Format a number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "Rp 25.000")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date to Indonesian locale string
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format a date with time
 * @param date - Date object or ISO string
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get the display label for a menu category
 * @param category - Category value
 * @returns Category label
 */
export function getCategoryLabel(category: string): string {
  const found = MENU_CATEGORIES.find((c) => c.value === category);
  return found?.label || category;
}

/**
 * Get the badge CSS classes for a menu category
 * @param category - Category value
 * @returns CSS class string for badge styling
 */
export function getCategoryBadgeStyle(category: string): string {
  return CATEGORY_BADGE_COLORS[category] || CATEGORY_BADGE_COLORS.default;
}

/**
 * Get the status badge CSS classes for a transaction status
 * @param status - Transaction status
 * @returns CSS class string for status badge
 */
export function getTransactionStatusStyle(
  status: keyof typeof TRANSACTION_STATUS,
): string {
  return TRANSACTION_STATUS[status]?.className || "bg-slate-100 text-slate-800";
}

/**
 * Format large numbers with abbreviations (K, M, B)
 * @param num - Number to format
 * @returns Abbreviated number string
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
}
