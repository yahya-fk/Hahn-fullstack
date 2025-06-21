import { useState, useEffect } from 'react';
import profileService from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { updateUser } = useAuth();

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      return profileData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    setUpdateLoading(true);
    setError(null);
    try {
      const updatedProfile = await profileService.updateProfile(profileData);
      setProfile(updatedProfile);
      // Update user in auth context
      updateUser(updatedProfile);
      return { success: true, data: updatedProfile };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setUpdateLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setPasswordLoading(true);
    setError(null);
    try {
      const result = await profileService.changePassword(currentPassword, newPassword);
      return { success: true, message: result.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setPasswordLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Auto-fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateLoading,
    passwordLoading,
    fetchProfile,
    updateProfile,
    changePassword,
    clearError
  };
};
