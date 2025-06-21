import { useState, useEffect, useCallback } from 'react';
import roleService from '../services/roleService';
import { userAPI } from '../services/api';

export const useRoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load roles from API
  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rolesData = await roleService.getAllRoles();
      
      // Enhanced roles with additional metadata
      const enhancedRoles = await Promise.all(
        rolesData.map(async (role) => {
          try {
            // Get user count for this role
            const usersResponse = await userAPI.getAll();
            const users = usersResponse.data;
            const userCount = users.filter(user => 
              user.roles && user.roles.some(userRole => 
                (userRole.role || userRole) === role.role
              )
            ).length;

            return {
              id: role.role, // Use role name as ID
              name: role.role,
              role: role.role, // Keep original role field
              description: getRoleDescription(role.role),
              userCount,
              permissions: getRolePermissions(role.role),
              color: getRoleColor(role.role)
            };
          } catch (error) {
            console.error(`Error getting user count for role ${role.role}:`, error);
            return {
              id: role.role,
              name: role.role,
              role: role.role,
              description: getRoleDescription(role.role),
              userCount: 0,
              permissions: getRolePermissions(role.role),
              color: getRoleColor(role.role)
            };
          }
        })
      );

      setRoles(enhancedRoles);
    } catch (err) {
      console.error('Failed to load roles:', err);
      setError(err.message);
      // Fallback to default roles
      setRoles([
        {
          id: 'USER',
          name: 'USER',
          role: 'USER',
          description: 'Standard user with basic permissions',
          userCount: 0,
          permissions: ['Read'],
          color: 'bg-green-500'
        },
        {
          id: 'ADMIN',
          name: 'ADMIN',
          role: 'ADMIN',
          description: 'Full system access with all permissions',
          userCount: 0,
          permissions: ['Create', 'Read', 'Update', 'Delete', 'Manage Users', 'Manage Roles'],
          color: 'bg-red-500'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);
  // Create a new role
  const createRole = async (roleName) => {
    try {
      setLoading(true);
      const newRole = await roleService.createRole(roleName);
      await loadRoles(); // Reload to get updated data
      return newRole;
    } catch (err) {
      console.error('Failed to create role:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a role
  const deleteRole = async (roleName) => {
    try {
      setLoading(true);
      await roleService.deleteRole(roleName);
      await loadRoles(); // Reload to get updated data
    } catch (err) {
      console.error('Failed to delete role:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load roles on mount
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return {
    roles,
    loading,
    error,
    loadRoles,
    createRole,
    deleteRole
  };
};

// Helper functions for role metadata
const getRoleDescription = (roleName) => {
  const descriptions = {
    'ADMIN': 'Full system access with all permissions',
    'MODERATOR': 'Management level access to user operations',
    'MANAGER': 'Management level access to user operations',
    'USER': 'Standard user with basic permissions'
  };
  return descriptions[roleName] || `${roleName} role with custom permissions`;
};

const getRolePermissions = (roleName) => {
  const permissions = {
    'ADMIN': ['Create', 'Read', 'Update', 'Delete', 'Manage Users', 'Manage Roles'],
    'MODERATOR': ['Create', 'Read', 'Update', 'Manage Users'],
    'MANAGER': ['Create', 'Read', 'Update', 'Manage Users'],
    'USER': ['Read']
  };
  return permissions[roleName] || ['Read'];
};

const getRoleColor = (roleName) => {
  const colors = {
    'ADMIN': 'bg-red-500',
    'MODERATOR': 'bg-blue-500',
    'MANAGER': 'bg-blue-500',
    'USER': 'bg-green-500'
  };
  return colors[roleName] || 'bg-gray-500';
};

export default useRoleManagement;
