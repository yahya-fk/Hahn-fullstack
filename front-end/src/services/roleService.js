import { roleAPI } from './api';

// UI configuration for different roles (for display purposes only)
const roleUIConfig = {
  'ADMIN': {
    name: 'Administrator',
    description: 'Full system access with all administrative privileges',
    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_roles'],
    color: 'bg-red-500'
  },
  'MANAGER': {
    name: 'Manager',
    description: 'Management level access with user oversight capabilities',
    permissions: ['create', 'read', 'update', 'manage_users'],
    color: 'bg-blue-500'
  },
  'USER': {
    name: 'User',
    description: 'Standard user access with basic functionality',
    permissions: ['read', 'update'],
    color: 'bg-green-500'
  },
  'GUEST': {
    name: 'Guest',
    description: 'Limited access for temporary users',
    permissions: ['read'],
    color: 'bg-gray-500'
  }
};

// Default configuration for unknown roles
const defaultRoleConfig = {
  name: 'Custom Role',
  description: 'Custom role with specific permissions',
  permissions: ['read'],
  color: 'bg-purple-500'
};

// Mock data for development (when API is not available)
const mockRoles = ['ADMIN', 'MANAGER', 'USER', 'GUEST'];

// Helper function to enrich role data with UI information
const enrichRoleData = (roleName, userCount = 0) => {
  const config = roleUIConfig[roleName] || defaultRoleConfig;
  return {
    id: roleName,
    role: roleName,
    name: config.name,
    description: config.description,
    permissions: config.permissions,
    color: config.color,
    userCount: userCount
  };
};

export const roleService = {
  // Get all roles
  getAllRoles: async () => {
    try {
      const response = await roleAPI.getAll();
      // Backend returns array of role objects like { role: "ADMIN" }
      const roles = response.data || [];
      return roles.map(roleObj => enrichRoleData(roleObj.role, 0));
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      return mockRoles.map(roleName => enrichRoleData(roleName, Math.floor(Math.random() * 20)));
    }
  },

  // Get role by name
  getRoleByName: async (roleName) => {
    try {
      const response = await roleAPI.getByName(roleName);
      return enrichRoleData(response.data.role, 0);
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      if (mockRoles.includes(roleName)) {
        return enrichRoleData(roleName, Math.floor(Math.random() * 20));
      }
      throw new Error(`Role ${roleName} not found`);
    }
  },

  // Create new role
  createRole: async (roleName) => {
    try {
      // Backend expects { role: "ROLE_NAME" }
      const response = await roleAPI.create({ role: roleName });
      return enrichRoleData(response.data.role, 0);
    } catch (error) {
      console.warn('API not available, simulating creation:', error.message);
      const newRole = enrichRoleData(roleName, 0);
      mockRoles.push(roleName);
      return newRole;
    }
  },

  // Delete role
  deleteRole: async (roleName) => {
    try {
      await roleAPI.delete(roleName);
      return { success: true };
    } catch (error) {
      console.warn('API not available, simulating deletion:', error.message);
      const index = mockRoles.findIndex(role => role === roleName);
      if (index > -1) {
        mockRoles.splice(index, 1);
      }
      return { success: true };
    }
  }
};

export default roleService;
