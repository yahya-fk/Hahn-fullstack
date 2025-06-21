import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Icon from '@mdi/react';
import { 
  mdiAccount, 
  mdiLogout, 
  mdiChevronDown, 
  mdiHome,
  mdiAccountMultiple,
  mdiShield,
  mdiWeatherNight,
  mdiWeatherSunny
} from '@mdi/js';

// Icon components (keeping for backwards compatibility)
const UserIcon = ({ className }) => (
  <Icon path={mdiAccount} size={0.8} className={className} />
);

const HomeIcon = ({ className }) => (
  <Icon path={mdiHome} size={0.8} className={className} />
);

const UsersIcon = ({ className }) => (
  <Icon path={mdiAccountMultiple} size={0.8} className={className} />
);

const RolesIcon = ({ className }) => (
  <Icon path={mdiShield} size={0.8} className={className} />
);

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Roles', href: '/roles', icon: RolesIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      navigate('/login');
    }
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || 'User';
  };

  const getUserRole = () => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0].name === 'ADMIN' ? 'Administrator' : 'User';
    }
    return 'User';
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
        {/* Logo */}
        <div className="flex h-20 items-center justify-center  border-b border-light-border dark:border-dark-border">
          <div className="flex items-center justify-center w-full">
            <div className="flex-shrink-0">
              <img 
                src="/hahn_freigestellt.png" 
                alt="Hahn Software" 
                className="h-20 w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>        {/* Theme Toggle in Sidebar */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surface rounded-lg">
            <span className="text-sm text-light-muted dark:text-dark-muted">
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-card dark:hover:bg-dark-card transition-colors"
              aria-label="Toggle theme"
            >
              <Icon 
                path={theme === 'dark' ? mdiWeatherSunny : mdiWeatherNight} 
                size={0.8} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {getPageTitle(location.pathname)}
                </h2>
                <p className="text-sm text-light-muted dark:text-dark-muted">
                  {getPageDescription(location.pathname)}
                </p>
              </div>
              
              {/* Enhanced User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
                    </div>
                    <div className="text-left hidden sm:block">
                      <div className="font-medium text-light-text dark:text-dark-text text-sm">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-light-muted dark:text-dark-muted text-xs">
                        {getUserRole()}
                      </div>
                    </div>
                  </div>
                  <Icon 
                    path={mdiChevronDown} 
                    size={0.8} 
                    className={`text-light-muted dark:text-dark-muted transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-light-card dark:bg-dark-card rounded-lg shadow-lg border border-light-border dark:border-dark-border z-50">
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
                          </div>
                          <div>
                            <div className="font-medium text-light-text dark:text-dark-text text-sm">
                              {getUserDisplayName()}
                            </div>
                            <div className="text-light-muted dark:text-dark-muted text-xs">
                              {user?.email || user?.username}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                        >
                          <Icon path={mdiAccount} size={0.8} className="mr-3 text-light-muted dark:text-dark-muted" />
                          My Profile
                        </Link>
                        
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            toggleTheme();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                        >
                          <Icon 
                            path={theme === 'dark' ? mdiWeatherSunny : mdiWeatherNight} 
                            size={0.8} 
                            className="mr-3 text-light-muted dark:text-dark-muted" 
                          />
                          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-light-border dark:border-dark-border pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Icon path={mdiLogout} size={0.8} className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper functions
const getPageTitle = (pathname) => {
  const titles = {
    '/': 'Menu',
    '/users': 'User Management',
    '/roles': 'Role Management', 
    '/profile': 'Profile',
    '/login': 'Login',
    '/register': 'Register',
  };
  return titles[pathname] || 'Page';
};

const getPageDescription = (pathname) => {
  const descriptions = {
    '/': 'Welcome to Hahn Software - Your central management hub',
    '/users': 'Manage system users, permissions, and access controls',
    '/roles': 'Configure roles and define user access levels',
    '/profile': 'Manage your account settings and personal information',
    '/login': 'Sign in to your account',
    '/register': 'Create a new account',
  };
  return descriptions[pathname] || 'Manage your content';
};

export default Layout;
