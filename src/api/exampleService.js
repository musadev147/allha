import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Example Service to handle Customer related API calls
 */
export const CustomerService = {
  // Fetch all customers
  getAllCustomers: async () => {
    return await apiClient.get(ENDPOINTS.CUSTOMERS);
  },

  // Fetch a single customer by ID
  getCustomerById: async (id) => {
    return await apiClient.get(ENDPOINTS.CUSTOMER_DETAILS(id));
  },

  // Create a new customer
  createCustomer: async (customerData) => {
    return await apiClient.post(ENDPOINTS.CUSTOMERS, customerData);
  },

  // Update a customer
  updateCustomer: async (id, customerData) => {
    return await apiClient.put(ENDPOINTS.CUSTOMER_DETAILS(id), customerData);
  },

  // Delete a customer
  deleteCustomer: async (id) => {
    return await apiClient.delete(ENDPOINTS.CUSTOMER_DETAILS(id));
  }
};
