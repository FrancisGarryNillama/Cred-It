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
        // Check RequestTOR
        const requestRes = await trackingApi.getUserProgress(userName);
        const inRequest = requestRes.exists;

        // Check PendingRequest
        const pendingRes = await trackingApi.getPendingProgress(userName);
        const inPending = pendingRes.exists;

        // Check FinalDocuments
        const finalRes = await trackingApi.getFinalProgress(userName);
        const inFinal = finalRes.exists;

        // Set progress value
        if (inFinal) setProgress(3);
        else if (inPending) setProgress(2);
        else if (inRequest) setProgress(1);
        else setProgress(0);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userName]);

  return { progress, loading };
}
