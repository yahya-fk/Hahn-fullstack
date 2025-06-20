import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:8080';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout on 401 if it's not from the verify endpoint
    // This prevents automatic logout when backend is down during page refresh
    if (error.response?.status === 401 && !error.config?.url?.includes('/verify')) {
      // Token expired or invalid for actual API calls
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.post('/api/auth/login', credentials);
      const { token, username, expiresAt } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
        // Create user object with the returned data
        const user = { username, expiresAt };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return { success: true, data: { token, user: { username, expiresAt } } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  }
  // Register user
  async register(userData) {
    try {
      const response = await authAPI.post('/api/auth/register', userData);
      const user = response.data; // Backend returns User object directly
      
      // After registration, we need to login to get a token
      // Or modify backend to return token on registration
      return { success: true, data: { user } };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Registration failed'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await authAPI.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await authAPI.post('/api/auth/refresh');
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      return { success: true, token };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed'
      };
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }  // Verify token with backend
  async verifyToken() {
    try {
      // Check if we have a token to verify
      const token = this.getToken();
      if (!token) {
        return {
          success: false,
          error: 'No token available to verify'
        };
      }
      
      const response = await authAPI.post('/api/auth/verify'); // Changed to POST to match backend
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Token verification failed'
      };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await authAPI.put('/api/auth/change-password', passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password change failed'
      };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const response = await authAPI.post('/api/auth/reset-password', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset failed'
      };
    }
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await authAPI.put('/api/auth/profile', profileData);
      const { user } = response.data;
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      };
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;

// Export axios instance for other API calls
export { authAPI };
