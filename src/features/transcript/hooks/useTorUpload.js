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
      const data = await torApi.uploadOcr(images, accountId);
      setOcrResults(data);
      return data;
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