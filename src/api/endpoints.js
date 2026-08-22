// Define all API endpoints here to avoid hardcoding strings across the app

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_DETAILS: (id) => `/customers/${id}`,

  // Products / Inventory
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,

  // Sales / POS
  SALES: '/sales',
  
  // Reports
  REPORTS_SUMMARY: '/reports/summary',
};
