import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const trackingApi = {
  getUserProgress: async (accountId) => {
    const { data } = await apiClient.get(API_ENDPOINTS.TRACK_USER_PROGRESS, {
      accountID: accountId,
    });
    return data;
  },

  getPendingProgress: async (accountId) => {
    const { data } = await apiClient.get(API_ENDPOINTS.PENDING_TRACK_PROGRESS, {
      applicant_id: accountId,
    });
    return data;
  },

  getFinalProgress: async (accountId) => {
    const { data } = await apiClient.get(API_ENDPOINTS.FINAL_TRACK_PROGRESS, {
      accountID: accountId,
    });
    return data;
  },

  getTrackerAccreditation: async (accountId) => {
    const { data } = await apiClient.get(API_ENDPOINTS.TRACKER_ACCREDITATION, {
      account_id: accountId,
    });
    return data;
  },
};