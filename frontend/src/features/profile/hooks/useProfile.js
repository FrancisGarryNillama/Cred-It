// frontend/src/features/profile/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { profileApi } from '../../../api';
import { useNotification } from '../../../hooks';
import { torApi, trackingApi, requestApi } from "../../../api"; 

/**
 * Profile hook - Updated for new backend
 * Backend now uses snake_case and standardized responses
 */
const formatDate = (date) => (date ? new Date(date).toISOString().split('T')[0] : '');

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
            user_id: data.user_id || userId,
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
