import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@mdi/react';
import { mdiCheckCircle, mdiAlertCircle, mdiClose } from '@mdi/js';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 5000 }) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          icon: mdiCheckCircle,
          iconColor: 'text-white'
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          icon: mdiAlertCircle,
          iconColor: 'text-white'
        };
      default:
        return {
          bgColor: 'bg-blue-500',
          icon: mdiCheckCircle,
          iconColor: 'text-white'
        };
    }
  };

  const config = getToastConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`${config.bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md`}>
            <Icon 
              path={config.icon} 
              size={1} 
              className={config.iconColor}
            />
            <span className="flex-1 font-medium">{message}</span>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <Icon path={mdiClose} size={0.8} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
