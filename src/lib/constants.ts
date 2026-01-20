/**
 * Centralized constants for Sam Deni Dimsum application
 */

// Menu categories used across the application
export const MENU_CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "paket", label: "Paket" },
  { value: "gyoza", label: "Gyoza" },
  { value: "wonton", label: "Wonton" },
  { value: "dimsum", label: "Dimsum (Varian)" },
] as const;

// Category badge color mapping
export const CATEGORY_BADGE_COLORS: Record<string, string> = {
  paket: "bg-red-100 text-red-700 border-red-200",
  gyoza: "bg-amber-100 text-amber-700 border-amber-200",
  wonton: "bg-blue-100 text-blue-700 border-blue-200",
  dimsum: "bg-green-100 text-green-700 border-green-200",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};

// Pagination options
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

// Transaction status with corresponding styles
export const TRANSACTION_STATUS = {
  Success: {
    label: "Success",
    className: "bg-green-100 text-green-800",
  },
  Pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  Processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800",
  },
} as const;

// Settings tabs configuration
export const SETTINGS_TABS = [
  { id: "profile", label: "Profil" },
  { id: "business", label: "Bisnis" },
  { id: "notifications", label: "Notifikasi" },
  { id: "appearance", label: "Tampilan" },
  { id: "integrations", label: "Integrasi" },
  { id: "security", label: "Keamanan" },
] as const;

// Theme options
export const THEME_OPTIONS = ["light", "dark", "system"] as const;

// Default business hours
export const DEFAULT_BUSINESS_HOURS = {
  open: "11:00",
  close: "21:00",
} as const;

// Attendance status with labels and colors
export const ATTENDANCE_STATUS = {
  hadir: {
    label: "Hadir",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  izin: {
    label: "Izin",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  sakit: {
    label: "Sakit",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  alpha: {
    label: "Alpha",
    color: "bg-red-100 text-red-700 border-red-200",
  },
} as const;

// Disbursement status with labels and colors
export const DISBURSEMENT_STATUS = {
  pending: {
    label: "Menunggu",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  processed: {
    label: "Diproses",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Selesai",
    color: "bg-green-100 text-green-700 border-green-200",
  },
} as const;

// Mobile taskbar visibility - which roles use mobile taskbar
export const MOBILE_TASKBAR_ROLES = ["crew", "staff", "mitra"] as const;
