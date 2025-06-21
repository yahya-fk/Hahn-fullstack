import api from './api';

export const roleService = {
  // Get all available roles
  getAllRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      // Fallback to default roles if endpoint doesn't exist
      return [
        { role: 'USER' },
        { role: 'MODERATOR' },
        { role: 'ADMIN' }
      ];
    }
  }
};

export default roleService;
