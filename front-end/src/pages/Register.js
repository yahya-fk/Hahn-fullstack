import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiAccount, mdiLock, mdiEyeOutline, mdiEyeOffOutline, mdiAlertCircleOutline, mdiEmail } from '@mdi/js';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear all errors when user starts typing
    if (error && clearError) {
      clearError();
    }
    if (localError) {
      setLocalError(null);
    }
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
      if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    // Email validation (optional but must be valid if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clear any previous errors
    setLocalError(null);
    if (clearError) clearError();
    setIsConnecting(true);

    try {      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email, // Include the optional email
        password: formData.password,
      });
        if (result.success) {
        console.log('Registration successful:', result);
        
        // Success - navigate to login since backend doesn't auto-login after registration
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please log in with your credentials.',
              username: formData.username 
            }
          });
          setIsConnecting(false);
        }, 1000);
      } else {
        throw new Error(result.error || 'Registration failed');
      }
      
    } catch (err) {
      // Error handling - reset connecting state and show error
      setIsConnecting(false);
      console.error('Registration failed:', err);
      
      // Set local error to ensure it's displayed
      setLocalError(err.message || 'Registration error');
    }
  };

  // Add floating particle effect
  useEffect(() => {
    const createParticle = () => {
      const container = document.getElementById('particle-container');
      if (!container) return;
      
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-gray-400/10 rounded-full';
      const startPos = Math.random() * 100;
      particle.style.left = `${startPos}%`;
      particle.style.top = '100%';
      particle.style.animation = `float ${5 + Math.random() * 5}s linear infinite`;
      container.appendChild(particle);
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 10000);
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  // Determine which error to display
  const displayError = error || localError;  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-6 relative overflow-hidden">
      <div id="particle-container" className="absolute inset-0 overflow-hidden pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img 
              src="/logo.gif" 
              alt="Hahn Software Logo" 
              className="mx-auto h-40 drop-shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 mb-5">
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                      <Icon path={mdiAccount} size={1} className="text-gray-600/70" />
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 bg-white ${
                        validationErrors.firstName 
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-2 focus:ring-gray-400/20 focus:border-gray-600'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {validationErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                      <Icon path={mdiAccount} size={1} className="text-gray-600/70" />
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 bg-white ${
                        validationErrors.lastName 
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                          : 'border-gray-200 focus:ring-2 focus:ring-gray-400/20 focus:border-gray-600'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {validationErrors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                    <Icon path={mdiAccount} size={1} className="text-gray-600/70" />
                  </span>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 bg-white ${
                      validationErrors.username 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-2 focus:ring-gray-400/20 focus:border-gray-600'
                    }`}
                    placeholder="Choose a username"
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.username}</p>
                )}               
              </div>

              {/* Email Field (Optional) */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Email <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                    <Icon path={mdiEmail} size={1} className="text-gray-600/70" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 bg-white ${
                      validationErrors.email 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-2 focus:ring-gray-400/20 focus:border-gray-600'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-1 italic">
                  Optional - for account recovery and notifications
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                    <Icon path={mdiLock} size={1} className="text-gray-600/70" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border text-black transition-all duration-300 bg-white ${
                      validationErrors.password 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-2 focus:ring-gray-400/20 focus:border-gray-600'
                    }`}
                    placeholder={showPassword ? 'Password' : '••••••••'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors z-10"
                  >
                    <Icon 
                      path={showPassword ? mdiEyeOutline : mdiEyeOffOutline} 
                      size={1} 
                      className="text-gray-600/70 hover:text-gray-700 transition-colors" 
                    />
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                    <Icon path={mdiLock} size={1} className="text-gray-600/70" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border transition-all text-black duration-300 bg-white ${
                      validationErrors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-2 focus:ring-gray-400/20 focus:border-gray-600'
                    }`}
                    placeholder={showConfirmPassword ? 'Confirm Password' : '••••••••'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors z-10"
                  >
                    <Icon 
                      path={showConfirmPassword ? mdiEyeOutline : mdiEyeOffOutline} 
                      size={1} 
                      className="text-gray-600/70 hover:text-gray-700 transition-colors" 
                    />
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <AnimatePresence>
              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-200 flex items-start shadow-sm"
                >
                  <Icon 
                    path={mdiAlertCircleOutline} 
                    size={1} 
                    className="mr-3 flex-shrink-0 text-red-500 mt-0.5" 
                  />
                  <div className="flex-1">
                    <p className="font-medium text-red-700">Registration Error</p>
                    <p className="text-red-600 mt-1">{displayError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading || isConnecting}
              className="w-full bg-[#333333] hover:bg-[#444444] text-white rounded-lg px-4 py-3 font-medium 
                focus:outline-none focus:ring-2 focus:ring-black/50 focus:ring-offset-2 
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                transform active:scale-90 hover:scale-105 hover:shadow-lg
                relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {(isLoading || isConnecting) ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                  <span className="ml-2">
                    {isConnecting ? 'Creating Account...' : 'Processing...'}
                  </span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-gray-800 hover:text-gray-600 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
