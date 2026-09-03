import apiClient, { clearTokens, setTokens } from './client';
import { ENDPOINTS } from './endpoints';

// One thin function per call. The store is the only caller; pages never talk
// to these directly, which is what lets the pages stay exactly as they were.

export const AuthService = {
  login: async (username, password) => {
    const data = await apiClient.post(ENDPOINTS.LOGIN, { username, password });
    setTokens(data.access, data.refresh);
    return data.user;
  },
  profile: () => apiClient.get(ENDPOINTS.PROFILE),
  logout: () => clearTokens(),
};

export const ProductService = {
  list: (params) => apiClient.get(ENDPOINTS.PRODUCTS, { params }),
  create: (payload) => apiClient.post(ENDPOINTS.PRODUCTS, payload),
  update: (code, payload) => apiClient.patch(ENDPOINTS.PRODUCT(code), payload),
  remove: (code) => apiClient.delete(ENDPOINTS.PRODUCT(code)),
  byBarcode: (barcode) => apiClient.get(ENDPOINTS.BARCODE_SEARCH, { params: { barcode } }),
  categories: () => apiClient.get(ENDPOINTS.CATEGORIES),
  units: () => apiClient.get(ENDPOINTS.UNITS),
};

export const CustomerService = {
  list: (params) => apiClient.get(ENDPOINTS.CUSTOMERS, { params }),
  create: (payload) => apiClient.post(ENDPOINTS.CUSTOMERS, payload),
  update: (code, payload) => apiClient.patch(ENDPOINTS.CUSTOMER(code), payload),
  remove: (code) => apiClient.delete(ENDPOINTS.CUSTOMER(code)),
};

export const SupplierService = {
  list: (params) => apiClient.get(ENDPOINTS.SUPPLIERS, { params }),
  create: (payload) => apiClient.post(ENDPOINTS.SUPPLIERS, payload),
  update: (code, payload) => apiClient.patch(ENDPOINTS.SUPPLIER(code), payload),
  remove: (code) => apiClient.delete(ENDPOINTS.SUPPLIER(code)),
};

export const SaleService = {
  list: (params) => apiClient.get(ENDPOINTS.INVOICES, { params }),
  create: (payload) => apiClient.post(ENDPOINTS.INVOICES, payload),
  remove: (id) => apiClient.delete(ENDPOINTS.INVOICE(id)),
};

export const PurchaseService = {
  list: (params) => apiClient.get(ENDPOINTS.PURCHASES, { params }),
  create: (payload) => apiClient.post(ENDPOINTS.PURCHASES, payload),
  remove: (id) => apiClient.delete(ENDPOINTS.PURCHASE(id)),
};

export const ReturnService = {
  list: (params) => apiClient.get(ENDPOINTS.RETURNS, { params }),
  create: (payload) => apiClient.post(ENDPOINTS.RETURNS, payload),
  remove: (id) => apiClient.delete(ENDPOINTS.RETURN(id)),
};

export const LedgerService = {
  settlements: (params) => apiClient.get(ENDPOINTS.SETTLEMENTS, { params }),
  settleDue: (payload) => apiClient.post(ENDPOINTS.SETTLE_DUE, payload),
  statement: (type, id) => apiClient.get(ENDPOINTS.STATEMENT(type, id)),
};

export const ExpenseService = {
  list: (params) => apiClient.get(ENDPOINTS.EXPENSES, { params }),
  create: (payload) => apiClient.post(ENDPOINTS.EXPENSES, payload),
  update: (id, payload) => apiClient.patch(ENDPOINTS.EXPENSE(id), payload),
  remove: (id) => apiClient.delete(ENDPOINTS.EXPENSE(id)),
  categories: () => apiClient.get(ENDPOINTS.EXPENSE_CATEGORIES),
};

export const HRService = {
  staff: () => apiClient.get(ENDPOINTS.STAFF),
  createStaff: (payload) => apiClient.post(ENDPOINTS.STAFF, payload),
  updateStaff: (code, payload) => apiClient.patch(ENDPOINTS.STAFF_MEMBER(code), payload),
  removeStaff: (code) => apiClient.delete(ENDPOINTS.STAFF_MEMBER(code)),

  attendance: (params) => apiClient.get(ENDPOINTS.ATTENDANCE, { params }),
  markAttendance: (payload) => apiClient.post(ENDPOINTS.ATTENDANCE_MARK, payload),

  leaves: () => apiClient.get(ENDPOINTS.LEAVES),
  createLeave: (payload) => apiClient.post(ENDPOINTS.LEAVES, payload),
  setLeaveStatus: (id, status) => apiClient.patch(ENDPOINTS.LEAVE_STATUS(id), { status }),

  payrolls: (params) => apiClient.get(ENDPOINTS.PAYROLLS, { params }),
  generatePayslip: (payload) => apiClient.post(ENDPOINTS.PAYROLL_GENERATE, payload),
};

export const TreasuryService = {
  summary: () => apiClient.get(ENDPOINTS.TREASURY_SUMMARY),
  transactions: (params) => apiClient.get(ENDPOINTS.TREASURY_TRANSACTIONS, { params }),
  transfer: (payload) => apiClient.post(ENDPOINTS.TREASURY_TRANSFER, payload),
  entry: (payload) => apiClient.post(ENDPOINTS.TREASURY_ENTRY, payload),
};

export const SMSService = {
  balance: () => apiClient.get(ENDPOINTS.SMS_BALANCE),
  buy: (credits, cost) => apiClient.post(ENDPOINTS.SMS_BUY, { amount: credits, cost }),
  send: (message, customerIds, numbers) =>
    apiClient.post(ENDPOINTS.SMS_SEND, { message, customerIds, numbers }),
  history: () => apiClient.get(ENDPOINTS.SMS_HISTORY),
};

export const ReportService = {
  summary: () => apiClient.get(ENDPOINTS.REPORTS_SUMMARY),
  details: (params) => apiClient.get(ENDPOINTS.REPORTS_DETAILS, { params }),
};

export const CoreService = {
  shopProfile: () => apiClient.get(ENDPOINTS.SHOP_PROFILE),
  saveShopProfile: (payload) => apiClient.put(ENDPOINTS.SHOP_PROFILE, payload),
  userSettings: () => apiClient.get(ENDPOINTS.USER_SETTINGS),
  saveUserSettings: (payload) => apiClient.post(ENDPOINTS.USER_SETTINGS, payload),
};
