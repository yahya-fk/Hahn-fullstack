import api from './api';

export const userManagementService = {
  // Get all users (Admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  // Get user by username (Admin or own profile)
  getUserByUsername: async (username) => {
    try {
      const response = await api.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Create new user (Admin only)
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  // Update user (Admin or own profile)
  updateUser: async (username, userData) => {
    try {
      const response = await api.put(`/users/${username}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  // Delete user (Admin only)
  deleteUser: async (username) => {
    try {
      await api.delete(`/users/${username}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },
  // Add role to user (Admin only)
  addRoleToUser: async (userRoleData) => {
    try {
      console.log('Adding role with data:', userRoleData);
      const response = await api.post('/users/roles', userRoleData);
      return response.data;
    } catch (error) {
      console.error('Add role error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to add role');
    }
  },

  // Remove role from user (Admin only)
  removeRoleFromUser: async (userRoleData) => {
    try {
      console.log('Removing role with data:', userRoleData);
      const response = await api.delete('/users/roles', { data: userRoleData });
      return response.data;
    } catch (error) {
      console.error('Remove role error:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to remove role');
    }
  }
};

export default userManagementService;
