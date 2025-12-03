import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const requestApi = {
  requestTor: async (accountId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.REQUEST_TOR, {
      account_id: accountId,
    });
    return data;
  },

  getRequestTorList: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.REQUEST_TOR_LIST);
    return data;
  },

  getPendingRequests: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.PENDING_REQUEST);
    return data;
  },

  acceptRequest: async (applicantId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PENDING_REQUEST_ACCEPT, {
      applicant_id: applicantId,
    });
    return data;
  },

  denyRequest: async (applicantId) => {
    const { data } = await apiClient.delete(
      `${API_ENDPOINTS.PENDING_REQUEST_DENY}${applicantId}/`
    );
    return data;
  },

  updateRequestStatus: async (applicantId, status) => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.PENDING_REQUEST_UPDATE_STATUS,
      {
        applicant_id: applicantId,
        status,
      }
    );
    return data;
  },

  getFinalDocuments: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.FINAL_DOCUMENTS_LIST);
    return data;
  },

  finalizeRequest: async (accountId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.FINALIZE_REQUEST, {
      account_id: accountId,
    });
    return data;
  },
};