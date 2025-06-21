import { profileAPI } from './api';

class ProfileService {
  // Get current user profile
  async getProfile() {
    try {
      const response = await profileAPI.getProfile();
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await profileAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw this.handleError(error);
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await profileAPI.changePassword({
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.error || error.response.data?.message || 'Server error occurred',
        status: error.response.status
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      };
    }
  }
}

const profileService = new ProfileService();
export default profileService;
