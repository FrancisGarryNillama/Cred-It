import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const authApi = {
  /**
   * Login API
   * Sends snake_case keys to backend
   * @param {string} accountId 
   * @param {string} accountPass 
   */
  login: async (accountId, accountPass) => {
    const { data, ...rest } = await apiClient.post(API_ENDPOINTS.LOGIN, {
      account_id: accountId,
      account_pass: accountPass,
    });
    return { data, ...rest };
  },

  /**
   * Register API
   * Sends snake_case keys to backend
   * @param {string} accountId 
   * @param {string} accountPass 
   */
  register: async (accountId, accountPass) => {
    const { data, ...rest } = await apiClient.post(API_ENDPOINTS.REGISTER, {
      account_id: accountId,
      account_pass: accountPass,
    });
    return { data, ...rest };
  },

  /**
   * Change password API
   * @param {string} accountId 
   * @param {string} oldPassword 
   * @param {string} newPassword 
   */
  changePassword: async (accountId, oldPassword, newPassword) => {
    const { data, ...rest } = await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
      account_id: accountId,
      old_password: oldPassword,
      new_password: newPassword,
    });
    return { data, ...rest };
  },

  /**
   * Fetch account info
   * @param {string} accountId 
   */
  getAccountInfo: async (accountId) => {
    const { data, ...rest } = await apiClient.get(API_ENDPOINTS.ACCOUNT_INFO, {
      account_id: accountId,
    });
    return { data, ...rest };
  },
};
