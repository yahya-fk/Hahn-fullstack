import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge } from './UI';
import userManagementService from '../services/userManagementService';
import roleService from '../services/roleService';

const RoleManagementModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onRoleUpdated 
}) => {
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState(['USER', 'MODERATOR', 'ADMIN']);

  // Load available roles when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadRoles = async () => {
        try {
          const roles = await roleService.getAllRoles();
          setAvailableRoles(roles.map(role => role.role || role));
        } catch (error) {
          console.error('Failed to load roles:', error);
          // Keep default roles if loading fails
        }
      };
      loadRoles();
    }
  }, [isOpen]);
    const userRoles = user?.roles || [];
  const userRoleNames = userRoles.map(role => role.role || role);
  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole || userRoleNames.includes(newRole)) return;

    try {
      setLoading(true);
      const userRoleData = {
        username: user.username,
        role: newRole  // Changed from roleName to role to match backend
      };
      
      await userManagementService.addRoleToUser(userRoleData);
      setNewRole('');
      if (onRoleUpdated) onRoleUpdated();
    } catch (error) {
      console.error('Failed to add role:', error);
      alert('Failed to add role: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleName) => {
    if (userRoleNames.length <= 1) {
      alert('User must have at least one role');
      return;
    }

    if (window.confirm(`Remove ${roleName} role from ${user.username}?`)) {
      try {
        setLoading(true);
        const userRoleData = {
          username: user.username,
          role: roleName  // Changed from roleName to role to match backend
        };
        
        await userManagementService.removeRoleFromUser(userRoleData);
        if (onRoleUpdated) onRoleUpdated();
      } catch (error) {
        console.error('Failed to remove role:', error);
        alert('Failed to remove role: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Roles - ${user.username}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Current Roles */}
        <div>
          <h3 className="text-sm font-medium text-light-text dark:text-dark-text mb-3">
            Current Roles
          </h3>          <div className="flex flex-wrap gap-2">
            {userRoles.map((role, index) => {
              const roleName = role.role || role;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="primary">{roleName}</Badge>
                  <button
                    onClick={() => handleRemoveRole(roleName)}
                    disabled={loading || userRoles.length <= 1}
                    className="text-error-500 hover:text-error-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={userRoles.length <= 1 ? 'User must have at least one role' : 'Remove role'}
                  >
                    ×
                  </button>
                </div>
              );
            })}
            {userRoles.length === 0 && (
              <span className="text-light-muted dark:text-dark-muted">No roles assigned</span>
            )}
          </div>
        </div>

        {/* Add New Role */}
        <div>
          <h3 className="text-sm font-medium text-light-text dark:text-dark-text mb-3">
            Add Role
          </h3>
          <form onSubmit={handleAddRole} className="flex gap-2">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="flex-1 px-3 py-2 border border-light-border dark:border-dark-border rounded-md bg-white dark:bg-dark-card text-light-text dark:text-dark-text"
              disabled={loading}
            >
              <option value="">Select a role...</option>
              {availableRoles.map(role => (
                <option 
                  key={role} 
                  value={role}
                  disabled={userRoleNames.includes(role)}
                >
                  {role} {userRoleNames.includes(role) ? '(already assigned)' : ''}
                </option>
              ))}
            </select>
            <Button 
              type="submit" 
              size="sm"
              disabled={!newRole || userRoleNames.includes(newRole) || loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-light-border dark:border-dark-border">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RoleManagementModal;
