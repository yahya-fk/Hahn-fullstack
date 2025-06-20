import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiAccount, mdiShieldAccount } from '@mdi/js';

const Home = () => {
  const navigate = useNavigate();

  const menuCards = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users, roles and permissions',
      icon: mdiAccount,
      route: '/users',
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700'
    },
    {
      id: 'roles',
      title: 'Role Management',
      description: 'Configure roles and access controls',
      icon: mdiShieldAccount,
      route: '/roles',
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <img 
            src="/logo.gif" 
            alt="Hahn Software Logo" 
            className="mx-auto h-24 drop-shadow-xl mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Hahn Software
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your system with powerful tools
          </p>
        </motion.div>

        {/* Menu Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {menuCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(card.route)}
              className="cursor-pointer group"
            >
              <div className={`
                relative overflow-hidden rounded-3xl shadow-xl
                bg-gradient-to-br ${card.gradient}
                group-hover:bg-gradient-to-br group-hover:${card.hoverGradient}
                transition-all duration-300
                p-8 h-64
              `}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20"></div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-white/10"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center mb-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-4">
                      <Icon 
                        path={card.icon} 
                        size={2.5} 
                        className="text-white drop-shadow-lg" 
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="text-white/90 text-lg leading-relaxed">
                      {card.description}
                    </p>
                    <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Get Started</span>
                      <svg 
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12 text-gray-600 dark:text-gray-400"
        >
          <p className="text-sm">
            Select a module above to get started with system management
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
