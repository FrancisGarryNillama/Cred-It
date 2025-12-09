import { useState, useEffect } from 'react';
import { profileApi } from '../../../api';
import { useNotification } from '../../../hooks';

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
        const data = await profileApi.getProfileById(userId);
        if (data) {
          setProfile(data);
          setProfileExists(true);
        }
      } catch (error) {
        // 404 is expected when profile doesn't exist yet - not an error
        if (!error.message?.includes('404')) {
          console.warn('Profile fetch error:', error);
        }
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
      await profileApi.saveProfile(profile);
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

  return {
    profile,
    updateProfile,
    saveProfile,
    loading,
    profileExists,
  };
}