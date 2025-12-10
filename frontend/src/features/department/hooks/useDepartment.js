
// frontend/src/features/department/hooks/useDepartment.js
/**
 * Department hook for faculty/admin - Updated for new backend
 */
export function useDepartment() {
  const [requests, setRequests] = useState([]);
  const [applications, setApplications] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Backend returns: { success: true, data: [...] }
      const [requestsData, applicationsData, acceptedData] = await Promise.all([
        requestApi.getRequestTorList(),
        requestApi.getPendingRequests(),
        requestApi.getFinalDocuments(),
      ]);

      setRequests(requestsData);
      setApplications(applicationsData);
      setAccepted(acceptedData);
    } catch (error) {
      showError(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (accountId) => {
    try {
      // Backend uses WorkflowService for transition
      const response = await requestApi.acceptRequest(accountId);
      
      if (response.success) {
        showSuccess(response.message || 'Request accepted');
        await fetchAllData(); // Refresh data
        return true;
      }
      return false;
    } catch (error) {
      showError(error.message || 'Failed to accept request');
      return false;
    }
  };

  const denyRequest = async (accountId) => {
    try {
      // Backend deletes all related data via WorkflowService
      const data = await requestApi.denyRequest(accountId);
      
      showSuccess(`Request denied. Cleaned up ${Object.values(data).reduce((a, b) => a + b, 0)} records.`);
      await fetchAllData(); // Refresh data
      return true;
    } catch (error) {
      showError(error.message || 'Failed to deny request');
      return false;
    }
  };

  const finalizeRequest = async (accountId) => {
    try {
      const response = await requestApi.finalizeRequest(accountId);
      
      if (response.success) {
        showSuccess(response.message || 'Request finalized');
        await fetchAllData(); // Refresh data
        return true;
      }
      return false;
    } catch (error) {
      showError(error.message || 'Failed to finalize request');
      return false;
    }
  };

  const updateStatus = async (accountId, status) => {
    try {
      const data = await requestApi.updatePendingStatusForDocument(accountId, status);
      showSuccess(`Status updated to ${status}`);
      await fetchAllData(); // Refresh data
      return true;
    } catch (error) {
      showError(error.message || 'Failed to update status');
      return false;
    }
  };

  return {
    requests,
    applications,
    accepted,
    loading,
    fetchAllData,
    acceptRequest,
    denyRequest,
    finalizeRequest,
    updateStatus,
  };
}