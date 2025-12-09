import { useState, useEffect } from 'react';
import { trackingApi } from '../../../api';

export function useTracking(userName) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userName) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        // Helper function to safely fetch and handle 404s
        const safeFetch = async (fetchFn) => {
          try {
            const result = await fetchFn();
            return result.exists || false;
          } catch (error) {
            // 404 means no submission exists - this is OK
            if (error.message?.includes('404')) {
              return false;
            }
            // Other errors should be logged but not break the flow
            console.warn('Error checking progress:', error);
            return false;
          }
        };

        // Check all three stages
        const [inRequest, inPending, inFinal] = await Promise.all([
          safeFetch(() => trackingApi.getUserProgress(userName)),
          safeFetch(() => trackingApi.getPendingProgress(userName)),
          safeFetch(() => trackingApi.getFinalProgress(userName)),
        ]);

        // Set progress value
        if (inFinal) setProgress(3);
        else if (inPending) setProgress(2);
        else if (inRequest) setProgress(1);
        else setProgress(0);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setProgress(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userName]);

  return { progress, loading };
}
