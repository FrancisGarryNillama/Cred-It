import { useState } from 'react';
import { torApi } from '../../../api';
import { useNotification } from '../../../hooks';

export function useTorUpload() {
  const [loading, setLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const { showError } = useNotification();

  const uploadOcr = async (images, accountId) => {
    if (!images || images.length === 0) {
      showError('No images to upload');
      return null;
    }

    setLoading(true);
    try {
      const response = await torApi.uploadOcr(images, accountId);
      console.log('API Response:', response);
      // Extract the nested data property
      const torData = response?.data || null;
      console.log('Extracted TOR data:', torData);
      setOcrResults(torData);
      return response;
    } catch (error) {
      console.error('OCR Upload Error:', error);
      showError(error.message || 'Failed to process OCR');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setOcrResults(null);
  };

  return { uploadOcr, loading, ocrResults, reset };
}