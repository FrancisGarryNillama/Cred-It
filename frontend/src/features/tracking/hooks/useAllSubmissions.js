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
                console.log('Fetching submissions for:', userName);

                // Fetch all submissions from RequestTOR, PendingRequest, and FinalDocuments
                const [requestRes, pendingRes, finalRes] = await Promise.all([
                    trackingApi.getUserProgress(userName),
                    trackingApi.getPendingProgress(userName),
                    trackingApi.getFinalProgress(userName),
                ]);

                console.log('Request Response (full):', JSON.stringify(requestRes, null, 2));
                console.log('Pending Response (full):', JSON.stringify(pendingRes, null, 2));
                console.log('Final Response (full):', JSON.stringify(finalRes, null, 2));

                const allSubmissions = [];

                // If exists is true, create a submission (even if no data field)
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

                console.log('All submissions found:', allSubmissions);

                // Sort by progress (highest first) and limit to 1 (most recent only)
                const sortedSubmissions = allSubmissions
                    .sort((a, b) => b.progress - a.progress)
                    .slice(0, 1);

                console.log('Sorted submissions (max 1):', sortedSubmissions);
                setSubmissions(sortedSubmissions);
            } catch (err) {
                console.error('Error fetching submissions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllSubmissions();
    }, [userName]);

    return { submissions, loading };
}
