import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiClose, mdiEye, mdiEyeOff, mdiLock } from '@mdi/js';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await onSubmit(formData.currentPassword, formData.newPassword);
      if (result.success) {
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-dark-card rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Icon path={mdiLock} size={1} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                  Change Password
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Icon path={mdiClose} size={1} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                      errors.currentPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-light-border dark:border-dark-border focus:ring-blue-500'
                    } bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Icon path={showPasswords.current ? mdiEyeOff : mdiEye} size={0.8} />
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                      errors.newPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-light-border dark:border-dark-border focus:ring-blue-500'
                    } bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Icon path={showPasswords.new ? mdiEyeOff : mdiEye} size={0.8} />
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-light-border dark:border-dark-border focus:ring-blue-500'
                    } bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Icon path={showPasswords.confirm ? mdiEyeOff : mdiEye} size={0.8} />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Changing...</span>
                    </>
                  ) : (
                    <span>Change Password</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordChangeModal;
