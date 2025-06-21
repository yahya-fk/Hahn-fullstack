import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Badge, Modal } from '../components/UI';
import Toast from '../components/Toast';
import RoleManagementModal from '../components/RoleManagementModal';
import userManagementService from '../services/userManagementService';
import roleService from '../services/roleService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleManagementUser, setRoleManagementUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: []
  });

  // Load users on component mount
  useEffect(() => {
    const loadUsersOnMount = async () => {
      try {
        setLoading(true);
        const userData = await userManagementService.getAllUsers();
        setUsers(userData);
      } catch (error) {
        showToast('Failed to load users: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    const loadRoles = async () => {
      try {
        const rolesData = await roleService.getAllRoles();
        setAvailableRoles(rolesData);
      } catch (error) {
        console.error('Failed to load roles:', error);
        // Fallback to default roles if API fails
        setAvailableRoles([
          { role: 'USER' },
          { role: 'ADMIN' }
        ]);
      }
    };

    const loadInitialData = async () => {
      await Promise.all([loadUsersOnMount(), loadRoles()]);
    };

    loadInitialData();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await userManagementService.getAllUsers();
      console.log('Loaded users:', userData); // Debug log
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error); // Debug log
      showToast('Failed to load users: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        roles: formData.roles
      };
      
      await userManagementService.createUser(userData);
      showToast('User created successfully', 'success');
      setShowModal(false);
      resetFormData();
      loadUsers();
    } catch (error) {
      showToast('Failed to create user: ' + error.message, 'error');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      roles: user.roles || []
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roles: formData.roles
      };
      
      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await userManagementService.updateUser(editingUser.username, updateData);
      showToast('User updated successfully', 'success');
      setShowEditModal(false);
      setEditingUser(null);
      resetFormData();
      loadUsers();
    } catch (error) {
      showToast('Failed to update user: ' + error.message, 'error');
    }
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userManagementService.deleteUser(username);
        showToast('User deleted successfully', 'success');
        loadUsers();
      } catch (error) {
        showToast('Failed to delete user: ' + error.message, 'error');
      }
    }
  };

  const handleManageRoles = (user) => {
    setRoleManagementUser(user);
    setShowRoleModal(true);
  };

  const handleRoleUpdated = () => {
    loadUsers(); // Refresh the user list after role changes
  };

  const resetFormData = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roles: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterRole === 'all') {
      return matchesSearch;
    }
    
    const userRoles = user.roles || [];
    const userRoleNames = userRoles.map(role => (role.role || role).toLowerCase());
    const matchesRole = userRoleNames.includes(filterRole.toLowerCase());
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (roles) => {
    if (!roles || roles.length === 0) return 'secondary';
    
    // Check for the highest priority role
    const roleNames = roles.map(role => (role.role || role).toLowerCase());
    
    if (roleNames.includes('admin')) return 'error';
    if (roleNames.includes('moderator')) return 'warning';
    if (roleNames.includes('user')) return 'primary';
    return 'secondary';
  };

  const getDisplayRoles = (roles) => {
    if (!roles || roles.length === 0) return 'No roles';
    console.log('Role structure:', roles); // Debug log
    return roles.map(role => role.role || role).join(', ');
  };

  const getUserDisplayName = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="sm:max-w-xs"
          >
            <option value="all">All Roles</option>
            {availableRoles.map((role) => (
              <option key={role.role} value={role.role.toLowerCase()}>
                {role.role}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={() => setShowModal(true)} disabled={loading}>
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-light-muted dark:text-dark-muted">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light-muted dark:text-dark-muted uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light-muted dark:text-dark-muted uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-light-muted dark:text-dark-muted uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-light-muted dark:text-dark-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border dark:divide-dark-border">
                {filteredUsers.map((user) => (
                  <tr key={user.username} className="hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {getUserDisplayName(user).split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-light-text dark:text-dark-text">
                            {getUserDisplayName(user)}
                          </div>
                          <div className="text-sm text-light-muted dark:text-dark-muted">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-light-text dark:text-dark-text">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.roles)}>
                        {getDisplayRoles(user.roles)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleManageRoles(user)}
                          className="text-primary-500 hover:text-primary-600"
                        >
                          Roles
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-error-500 hover:text-error-600"
                          onClick={() => handleDeleteUser(user.username)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-light-muted dark:text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-light-text dark:text-dark-text">No users found</h3>
            <p className="mt-1 text-sm text-light-muted dark:text-dark-muted">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormData();
        }}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter username"
            required
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            required
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowModal(false);
                resetFormData();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
          resetFormData();
        }}
        title="Edit User"
        size="md"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <Input
            label="Username"
            value={formData.username}
            disabled
            className="bg-gray-100 dark:bg-gray-800"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter last name"
              required
            />
          </div>
          
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            required
          />
          
          <Input
            label="New Password (leave blank to keep current)"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter new password"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowEditModal(false);
                setEditingUser(null);
                resetFormData();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Role Management Modal */}
      <RoleManagementModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setRoleManagementUser(null);
        }}
        user={roleManagementUser}
        onRoleUpdated={handleRoleUpdated}
      />

      {/* Toast Notification */}
      <Toast
        message={toast?.message || ''}
        type={toast?.type || 'info'}
        isVisible={!!toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
};

export default Users;
