import { useState, useEffect } from 'react';
import { trackingApi } from '../../../api';

export function useAllSubmissions(userName) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userName) return;

        const fetchAllSubmissions = async () => {
            setLoading(true);
            try {
                // Helper function to safely fetch and handle 404s
                const safeFetch = async (fetchFn) => {
                    try {
                        const result = await fetchFn();
                        return result;
                    } catch (error) {
                        // 404 means no submission exists - return null
                        if (error.message?.includes('404')) {
                            return { exists: false };
                        }
                        // Other errors should be logged but not break the flow
                        console.warn('Error checking submission:', error);
                        return { exists: false };
                    }
                };

                // Fetch all submissions from RequestTOR, PendingRequest, and FinalDocuments
                const [requestRes, pendingRes, finalRes] = await Promise.all([
                    safeFetch(() => trackingApi.getUserProgress(userName)),
                    safeFetch(() => trackingApi.getPendingProgress(userName)),
                    safeFetch(() => trackingApi.getFinalProgress(userName)),
                ]);

                const allSubmissions = [];

                // Add finalized submissions
                if (finalRes.exists) {
                    allSubmissions.push({
                        id: `final-${userName}`,
                        accountId: userName,
                        status: 'Finalized',
                        progress: 3,
                        createdAt: finalRes.created_at || finalRes.date_created || new Date().toISOString(),
                        updatedAt: finalRes.updated_at || finalRes.date_updated || new Date().toISOString(),
                    });
                }

                // Add pending submissions
                if (pendingRes.exists) {
                    allSubmissions.push({
                        id: `pending-${userName}`,
                        accountId: userName,
                        status: 'Pending',
                        progress: 2,
                        createdAt: pendingRes.created_at || pendingRes.date_created || new Date().toISOString(),
                        updatedAt: pendingRes.updated_at || pendingRes.date_updated || new Date().toISOString(),
                    });
                }

                // Add request submissions
                if (requestRes.exists) {
                    allSubmissions.push({
                        id: `request-${userName}`,
                        accountId: userName,
                        status: 'Request',
                        progress: 1,
                        createdAt: requestRes.created_at || requestRes.date_created || new Date().toISOString(),
                        updatedAt: requestRes.updated_at || requestRes.date_updated || new Date().toISOString(),
                    });
                }

                // Sort by progress (highest first) and limit to 1 (most recent only)
                const sortedSubmissions = allSubmissions
                    .sort((a, b) => b.progress - a.progress)
                    .slice(0, 1);

                setSubmissions(sortedSubmissions);
            } catch (err) {
                console.error('Error fetching submissions:', err);
                setSubmissions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllSubmissions();
    }, [userName]);

    return { submissions, loading };
}
