import axios from 'axios';

const BASE_URL = '/api';

export const uploadPreview = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post(`${BASE_URL}/upload/preview/`, formData);
};

export const uploadFull = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.post(`${BASE_URL}/upload/full/`, formData);
};
