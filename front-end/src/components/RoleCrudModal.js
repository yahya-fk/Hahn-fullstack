import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiClose, mdiShieldAccount, mdiPlus } from '@mdi/js';

const RoleCrudModal = ({ 
  isOpen, 
  onClose, 
  role, 
  onSubmit,
  title = "Add New Role"
}) => {
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role) {
      setRoleName(role.role || '');
    } else {
      setRoleName('');
    }
    setError('');
  }, [role, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedName = roleName.trim();
    if (!trimmedName) {
      setError('Role name is required');
      return;
    }

    // Validate role name format
    if (!/^[A-Z_]+$/.test(trimmedName)) {
      setError('Role name must contain only uppercase letters and underscores');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit(trimmedName);
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRoleName('');
    setError('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-dark-card rounded-xl shadow-xl max-w-md w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <Icon path={mdiShieldAccount} size={1} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                {title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Icon path={mdiClose} size={1} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Role Name */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Role Name *
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value.toUpperCase());
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-light-text dark:text-dark-text
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter role name (e.g., CUSTOM_ROLE)"
                required
                disabled={loading || !!role} // Disable editing role name for existing roles
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use uppercase letters and underscores only (e.g., CUSTOM_ROLE)
              </p>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> The permissions and descriptions shown in the UI are for display purposes only. 
                The actual permissions are managed by the backend system based on the role name.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !roleName.trim()}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                         transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Icon path={role ? mdiShieldAccount : mdiPlus} size={0.8} />
                    <span>{role ? 'Update Role' : 'Create Role'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoleCrudModal;
