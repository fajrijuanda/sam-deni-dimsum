/**
 * Google Sheets Sync Service
 *
 * This service handles synchronization between Supabase and Google Sheets.
 * It uses Google Sheets API to append/update data when entries are created.
 */

// Types for sheet data
export interface StockSheetRow {
  date: string;
  productName: string;
  quantity: number;
  type: "masuk" | "keluar" | "kembali";
  inputtedBy: string;
  timestamp: string;
}

export interface SalesSheetRow {
  date: string;
  productName: string;
  quantitySold: number;
  cashAmount: number;
  qrisAmount: number;
  totalAmount: number;
  pengeluaran: number;
  netIncome: number;
  inputtedBy: string;
  timestamp: string;
}

// Sheet names per outlet
export const SHEET_NAMES = {
  STOK_MASUK: "Stok Masuk",
  STOK_KELUAR: "Stok Keluar",
  STOK_KEMBALI: "Stok Kembali",
  PENJUALAN: "Penjualan Harian",
  REKAP_BULANAN: "Rekap Bulanan",
};

/**
 * Format date to Indonesian format
 */
export function formatDateID(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Prepare stock movement data for sheets
 */
export function prepareStockRow(data: {
  date: string;
  productName: string;
  quantity: number;
  type: "masuk" | "keluar" | "kembali";
  inputtedBy: string;
}): string[] {
  return [
    formatDateID(data.date),
    data.productName,
    data.quantity.toString(),
    data.type.toUpperCase(),
    data.inputtedBy,
    new Date().toISOString(),
  ];
}

/**
 * Prepare sales data for sheets
 */
export function prepareSalesRow(data: {
  date: string;
  items: { productName: string; quantity: number }[];
  cashAmount: number;
  qrisAmount: number;
  pengeluaran: number;
  inputtedBy: string;
}): string[] {
  const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
  const itemsList = data.items
    .filter((i) => i.quantity > 0)
    .map((i) => `${i.productName}: ${i.quantity}`)
    .join(", ");

  const totalAmount = data.cashAmount + data.qrisAmount;
  const netIncome = totalAmount - data.pengeluaran;

  return [
    formatDateID(data.date),
    itemsList,
    totalItems.toString(),
    data.cashAmount.toString(),
    data.qrisAmount.toString(),
    totalAmount.toString(),
    data.pengeluaran.toString(),
    netIncome.toString(),
    data.inputtedBy,
    new Date().toISOString(),
  ];
}

/**
 * Get sheet name based on movement type
 */
export function getSheetNameForMovement(
  type: "masuk" | "keluar" | "kembali"
): string {
  switch (type) {
    case "masuk":
      return SHEET_NAMES.STOK_MASUK;
    case "keluar":
      return SHEET_NAMES.STOK_KELUAR;
    case "kembali":
      return SHEET_NAMES.STOK_KEMBALI;
    default:
      return SHEET_NAMES.STOK_MASUK;
  }
}

/**
 * Google Sheets API client wrapper
 * This will be used to make API calls to Google Sheets
 *
 * For production, you need:
 * 1. Google Cloud Project with Sheets API enabled
 * 2. Service Account with credentials
 * 3. Share each spreadsheet with service account email
 */
export class GoogleSheetsClient {
  private spreadsheetId: string;
  private apiKey?: string;

  constructor(spreadsheetId: string, apiKey?: string) {
    this.spreadsheetId = spreadsheetId;
    this.apiKey = apiKey;
  }

  /**
   * Append a row to a specific sheet
   * In production, this would use the actual Google Sheets API
   */
  async appendRow(sheetName: string, values: string[]): Promise<boolean> {
    // TODO: Implement actual Google Sheets API call
    // For now, log the action
    console.log(`[GoogleSheets] Append to ${sheetName}:`, values);

    // Example API call structure:
    // POST https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{sheetName}!A:J:append
    // Body: { values: [values] }

    return true;
  }

  /**
   * Get all rows from a sheet
   */
  async getRows(sheetName: string): Promise<string[][]> {
    // TODO: Implement actual Google Sheets API call
    console.log(`[GoogleSheets] Get rows from ${sheetName}`);
    return [];
  }
}
