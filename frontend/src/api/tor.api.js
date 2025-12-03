import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const torApi = {
  uploadOcr: async (images, accountId) => {
    const formData = new FormData();
    images.forEach((img) => {
      formData.append('images', img.file);
    });
    formData.append('account_id', accountId);

    const { data } = await apiClient.postFormData(API_ENDPOINTS.OCR, formData);
    return data;
  },

  uploadDemoOcr: async (images) => {
    const formData = new FormData();
    images.forEach((img) => {
      if (img.file instanceof File) {
        formData.append('images', img.file, img.file.name);
      }
    });

    const { data } = await apiClient.postFormData(API_ENDPOINTS.DEMO_OCR, formData);
    return data;
  },

  deleteOcr: async (accountId) => {
    const { data } = await apiClient.delete(API_ENDPOINTS.OCR_DELETE, {
      account_id: accountId,
    });
    return data;
  },

  copyTor: async (accountId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.COPY_TOR, {
      account_id: accountId,
    });
    return data;
  },

  updateTorResults: async (accountId, failedSubjects, passedSubjects) => {
    const { data } = await apiClient.post(API_ENDPOINTS.UPDATE_TOR_RESULTS, {
      account_id: accountId,
      failed_subjects: failedSubjects,
      passed_subjects: passedSubjects,
    });
    return data;
  },

  syncCompleted: async (accountId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.SYNC_COMPLETED, {
      account_id: accountId,
    });
    return data;
  },

  getCompareResultTor: async (accountId) => {
    const { data } = await apiClient.get(API_ENDPOINTS.COMPARE_RESULT_TOR, {
      account_id: accountId,
    });
    return data;
  },

  getCitTorContent: async () => {
    const { data } = await apiClient.get(API_ENDPOINTS.CIT_TOR_CONTENT);
    return data;
  },

  updateCitTorEntry: async (entryData) => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.UPDATE_CIT_TOR_ENTRY,
      entryData
    );
    return data;
  },

  updateCreditEvaluation: async (id, creditEvaluation) => {
    const { data } = await apiClient.post(API_ENDPOINTS.UPDATE_CREDIT_EVALUATION, {
      id,
      credit_evaluation: creditEvaluation,
    });
    return data;
  },

  updateNote: async (id, notes) => {
    const { data } = await apiClient.post(API_ENDPOINTS.UPDATE_NOTE, {
      id,
      notes,
    });
    return data;
  },
};