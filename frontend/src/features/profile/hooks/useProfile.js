// frontend/src/features/profile/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { profileApi } from '../../../api';
import { useNotification } from '../../../hooks';

/**
 * Profile hook - Updated for new backend
 * Backend now uses snake_case and standardized responses
 */
export function useProfile(userId) {
  const [profile, setProfile] = useState({
    user_id: userId || '',
    name: '',
    school_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
  });
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Backend returns: { success: true, data: { user_id, name, ... } }
        const data = await profileApi.getProfile(userId);
        
        if (data) {
          // Map backend response to state
          setProfile({
            user_id: data.user_id,
            name: data.name || '',
            school_name: data.school_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            date_of_birth: data.date_of_birth || '',
          });
          setProfileExists(true);
        }
      } catch (error) {
        // Profile doesn't exist yet
        setProfileExists(false);
        setProfile({
          user_id: userId,
          name: '',
          school_name: '',
          email: '',
          phone: '',
          address: '',
          date_of_birth: '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Backend auto-creates or updates
      const data = await profileApi.saveProfile(profile);
      
      showSuccess('Profile saved successfully!');
      setProfileExists(true);
      return true;
    } catch (error) {
      showError(error.message || 'Failed to save profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkExists = async () => {
    try {
      const exists = await profileApi.checkExists(userId);
      setProfileExists(exists);
      return exists;
    } catch (error) {
      return false;
    }
  };

  return {
    profile,
    updateProfile,
    saveProfile,
    checkExists,
    loading,
    profileExists,
  };
}

// frontend/src/features/transcript/hooks/useTorUpload.js
/**
 * TOR Upload hook - Updated for new backend
 */
export function useTorUpload() {
  const [loading, setLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState(null);
  const { showError, showSuccess } = useNotification();

  const uploadOcr = async (images, accountId) => {
    if (!images || images.length === 0) {
      showError('No images to upload');
      return null;
    }

    setLoading(true);
    try {
      // Backend returns: { success: true, data: { student_name, school_name, ocr_results, school_tor } }
      const data = await torApi.uploadOcr(images, accountId);
      
      // Transform response to expected format
      const transformedData = {
        student_name: data.student_name,
        school_name: data.school_name,
        ocr_results: data.ocr_results || [],
        school_tor: data.school_tor || [],
      };
      
      setOcrResults(transformedData);
      showSuccess('OCR processing completed successfully!');
      return transformedData;
    } catch (error) {
      console.error('OCR Upload Error:', error);
      showError(error.message || 'Failed to process OCR');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteOcr = async (accountId) => {
    try {
      // Backend returns: { success: true, data: { tor_deleted, compare_deleted } }
      const data = await torApi.deleteOcr(accountId);
      showSuccess(`Deleted ${data.tor_deleted + data.compare_deleted} entries`);
      return true;
    } catch (error) {
      showError(error.message || 'Failed to delete OCR entries');
      return false;
    }
  };

  const reset = () => {
    setLoading(false);
    setOcrResults(null);
  };

  return { 
    uploadOcr, 
    deleteOcr,
    loading, 
    ocrResults, 
    reset 
  };
}

// frontend/src/features/tracking/hooks/useTracking.js
/**
 * Tracking hook - Updated for new backend
 */
export function useTracking(userName) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showError } = useNotification();

  useEffect(() => {
    if (!userName) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        // Check all three stages
        // Backend returns: { success: true, data: { exists: true/false } }
        const [requestRes, pendingRes, finalRes] = await Promise.all([
          trackingApi.getUserProgress(userName),
          trackingApi.getPendingProgress(userName),
          trackingApi.getFinalProgress(userName),
        ]);

        const inRequest = requestRes.exists;
        const inPending = pendingRes.exists;
        const inFinal = finalRes.exists;

        // Set progress value (1-3)
        if (inFinal) setProgress(3);
        else if (inPending) setProgress(2);
        else if (inRequest) setProgress(1);
        else setProgress(0);
      } catch (err) {
        console.error('Error fetching progress:', err);
        showError('Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userName]);

  return { progress, loading };
}

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

// Export all hooks
export { useProfile, useTorUpload, useTracking, useDepartment };