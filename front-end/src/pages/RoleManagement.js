import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiShieldAccount, mdiPlus, mdiDelete, mdiAccountGroup } from '@mdi/js';
import { useRoleManagement } from '../hooks/useRoleManagement';
import RoleCrudModal from '../components/RoleCrudModal';
import Toast from '../components/Toast';

const RoleManagement = () => {  const { roles, loading, error, createRole, deleteRole } = useRoleManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({ message: '', type: 'success', isVisible: false });

  const showToast = (message, type = 'success') => {
    setToastConfig({ message, type, isVisible: true });
  };
  const handleCreateRole = async (roleName) => {
    try {
      await createRole(roleName);
      showToast('Role created successfully!', 'success');
      setIsModalOpen(false);
    } catch (error) {
      showToast('Failed to create role: ' + error.message, 'error');
    }
  };

  const handleDeleteRole = async (roleName) => {
    if (window.confirm(`Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`)) {
      try {
        await deleteRole(roleName);
        showToast('Role deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete role: ' + error.message, 'error');
      }
    }
  };  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading && roles.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-light-muted dark:text-dark-muted">Loading roles...</p>
        </div>
      </div>
    );
  }

  if (error && roles.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading roles: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-xl">
            <Icon path={mdiShieldAccount} size={1.5} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Role Management</h1>
            <p className="text-light-muted dark:text-dark-muted">Configure roles and permissions</p>
          </div>
        </div>        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon path={mdiPlus} size={1} />
          )}
          <span>{loading ? 'Loading...' : 'Add Role'}</span>
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-muted dark:text-dark-muted">Total Roles</p>
              <p className="text-3xl font-bold text-light-text dark:text-dark-text">{roles.length}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Icon path={mdiShieldAccount} size={1.2} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-muted dark:text-dark-muted">Active Users</p>
              <p className="text-3xl font-bold text-light-text dark:text-dark-text">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Icon path={mdiAccountGroup} size={1.2} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-light-muted dark:text-dark-muted">Permission Types</p>
              <p className="text-3xl font-bold text-light-text dark:text-dark-text">6</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <Icon path={mdiShieldAccount} size={1.2} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Roles Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-lg border border-light-border dark:border-dark-border hover:shadow-xl transition-all duration-300"
          >
            {/* Role Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text">{role.name}</h3>
              </div>              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDeleteRole(role.role)}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete role"
                >
                  <Icon path={mdiDelete} size={0.8} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-light-muted dark:text-dark-muted mb-4 text-sm leading-relaxed">
              {role.description}
            </p>

            {/* User Count */}
            <div className="flex items-center space-x-2 mb-4">
              <Icon path={mdiAccountGroup} size={0.8} className="text-gray-500" />
              <span className="text-sm text-light-muted dark:text-dark-muted">
                {role.userCount} users assigned
              </span>
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-light-text dark:text-dark-text">Permissions:</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, permIndex) => (
                  <span
                    key={permIndex}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>          </motion.div>
        ))}
      </motion.div>      {/* Role CRUD Modal */}
      <RoleCrudModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        role={null}
        onSubmit={handleCreateRole}
        title="Add New Role"
      />

      {/* Toast Notification */}
      <Toast
        message={toastConfig.message}
        type={toastConfig.type}
        isVisible={toastConfig.isVisible}
        onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default RoleManagement;
