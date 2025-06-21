import { useState, useEffect } from 'react';
import userManagementService from '../services/userManagementService';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userManagementService.getAllUsers();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await userManagementService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateUser = async (username, userData) => {
    try {
      const updatedUser = await userManagementService.updateUser(username, userData);
      setUsers(prev => prev.map(user => 
        user.username === username ? updatedUser : user
      ));
      return updatedUser;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteUser = async (username) => {
    try {
      await userManagementService.deleteUser(username);
      setUsers(prev => prev.filter(user => user.username !== username));
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const addRoleToUser = async (userRoleData) => {
    try {
      const updatedUser = await userManagementService.addRoleToUser(userRoleData);
      setUsers(prev => prev.map(user => 
        user.username === userRoleData.username ? updatedUser : user
      ));
      return updatedUser;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const removeRoleFromUser = async (userRoleData) => {
    try {
      const updatedUser = await userManagementService.removeRoleFromUser(userRoleData);
      setUsers(prev => prev.map(user => 
        user.username === userRoleData.username ? updatedUser : user
      ));
      return updatedUser;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    addRoleToUser,
    removeRoleFromUser
  };
};
