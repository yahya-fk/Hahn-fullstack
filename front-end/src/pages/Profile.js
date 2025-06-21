import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiAccount, mdiEmail, mdiLock, mdiPencil, mdiCheck, mdiClose } from '@mdi/js';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import PasswordChangeModal from '../components/PasswordChangeModal';
import Toast from '../components/Toast';

const Profile = () => {
  const { user } = useAuth();
  const { 
    profile, 
    loading, 
    error, 
    updateLoading, 
    passwordLoading, 
    updateProfile, 
    changePassword, 
    clearError 
  } = useProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        email: profile.email || '',
        // These fields might not be in the API response, so we'll use fallback values
        phone: profile.phone || '+212707957177',
        department: profile.department || 'Software Engineer',
        position: profile.position || 'Full Stack Engineer Java/React'
      });
    }
  }, [profile]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSave = async () => {
    try {
      const profileUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };
      
      const result = await updateProfile(profileUpdateData);
      
      if (result.success) {
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        email: profile.email || '',
        phone: profile.phone || '+1 (555) 123-4567',
        department: profile.department || 'Software Development',
        position: profile.position || 'Developer'
      });
    }
    setIsEditing(false);
    clearError();
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      showToast('Password changed successfully!', 'success');
      return { success: true };
    } else {
      showToast(result.error || 'Failed to change password', 'error');
      return { success: false };
    }
  };

  // Show loading spinner while profile is being fetched
  if (loading && !profile) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-light-muted dark:text-dark-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl">
              <Icon path={mdiAccount} size={1.5} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Profile</h1>
              <p className="text-light-muted dark:text-dark-muted">Manage your account information</p>
            </div>
          </div>
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-colors"
            >
              <Icon path={mdiPencil} size={1} />
              <span>Edit Profile</span>
            </motion.button>
          ) : (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={updateLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-colors"
              >
                {updateLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Icon path={mdiCheck} size={1} />
                    <span>Save</span>
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-colors"
              >
                <Icon path={mdiClose} size={1} />
                <span>Cancel</span>
              </motion.button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border border-light-border dark:border-dark-border">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {formData.firstName[0]}{formData.lastName[0]}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-dark-card"></div>
                </div>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-1">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-light-muted dark:text-dark-muted mb-2">{formData.position}</p>
                <p className="text-sm text-light-muted dark:text-dark-muted">{formData.department}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Icon path={mdiAccount} size={0.8} className="text-gray-500" />
                  <span className="text-light-muted dark:text-dark-muted">@{formData.username}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Icon path={mdiEmail} size={0.8} className="text-gray-500" />
                  <span className="text-light-muted dark:text-dark-muted">{formData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-light-muted dark:text-dark-muted">{formData.phone}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border border-light-border dark:border-dark-border">
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border">
                <h4 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Security</h4>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <Icon path={mdiLock} size={1} />
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordChange}
        loading={passwordLoading}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </>
  );
};

export default Profile;
