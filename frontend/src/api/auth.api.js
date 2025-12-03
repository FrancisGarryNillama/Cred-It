import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const authApi = {
  login: async (accountID, accountPass) => {
    const { data } = await apiClient.post(API_ENDPOINTS.LOGIN, {
      AccountID: accountID,
      AccountPass: accountPass,
    });
    return data;
  },

  register: async (accountID, accountPass) => {
    const { data } = await apiClient.post(API_ENDPOINTS.REGISTER, {
      AccountID: accountID,
      AccountPass: accountPass,
    });
    return data;
  },
};
