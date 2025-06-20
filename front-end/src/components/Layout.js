import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

// Icon components
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-light-border dark:border-dark-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-light-text dark:text-dark-text">
                Hahn Software
              </h1>
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
            </span>            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:bg-light-card dark:hover:bg-dark-card transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
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
                {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">JD</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-light-text dark:text-dark-text">John Doe</div>
                    <div className="text-light-muted dark:text-dark-muted">Administrator</div>
                  </div>
                </div>
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
  };
  return titles[pathname] || 'Page';
};

const getPageDescription = (pathname) => {
  const descriptions = {
    '/': 'Welcome to Hahn Software - Select a module to get started',
    '/users': 'Manage system users and permissions',
    '/roles': 'Configure roles and access controls',
    '/profile': 'Manage your account settings',
  };
  return descriptions[pathname] || 'Manage your content';
};

export default Layout;
