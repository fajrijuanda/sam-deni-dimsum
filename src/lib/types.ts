/**
 * Shared TypeScript interfaces for Sam Deni Dimsum application
 */

// Product/Menu item interface
export interface Product {
  id: string;
  name: string;
  category: string;
  variant: string;
  price: number;
  pcsPerPortion: number;
  isActive: boolean;
}

// User profile interface
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

// Business settings interface
export interface BusinessSettings {
  name: string;
  address: string;
  phone: string;
  openHours: string;
  closeHours: string;
}

// Notification preferences interface
export interface NotificationSettings {
  emailNotifications: boolean;
  lowStockAlert: boolean;
  dailySalesReport: boolean;
  newOrderAlert: boolean;
}

// Integration settings interface
export interface IntegrationSettings {
  googleSheetsConnected: boolean;
  spreadsheetId: string;
  lastSync: string | null;
}

// Transaction interface
export interface Transaction {
  id: string;
  outlet: string;
  amount: number;
  status: "Success" | "Pending" | "Processing";
  date: string;
}

// Stats card props interface
export interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: {
    direction: "up" | "down";
    text: string;
  };
  variant?: "default" | "gradient-red" | "gradient-green" | "gradient-dark";
}

// Form data for product management
export interface ProductFormData {
  name: string;
  category: string;
  variant: string;
  price: string;
  pcsPerPortion: string;
}

// Column definition for DataTable
export interface Column<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

// Attendance record interface
export interface AttendanceRecord {
  id: string;
  userId: string;
  userName?: string;
  userRole?: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  photoUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  status: "hadir" | "izin" | "sakit" | "alpha";
  outletId?: string;
  outletName?: string;
}

// Disbursement record for mitra
export interface Disbursement {
  id: string;
  mitraId: string;
  mitraName?: string;
  month: string; // "2026-01"
  amount: number;
  status: "pending" | "processed" | "completed";
  processedAt: string | null;
  notes: string | null;
}

// User role type
export type UserRole = "admin" | "staff" | "crew" | "mitra";

// Mobile taskbar menu item
export interface MobileMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
