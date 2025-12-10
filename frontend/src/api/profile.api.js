import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const profileApi = {
  getProfile: async (userId) => {
  const response = await apiClient.get(`${API_ENDPOINTS.PROFILE}${userId}/`);
  return response.data; // Extract data from standardized response
  }, 

  getProfileById: async (userId) => {
    const { data } = await apiClient.get(`${API_ENDPOINTS.PROFILE}${userId}/`);
    return data;
  },

  saveProfile: async (profileData) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PROFILE_SAVE, profileData);
    return data;
  },
};