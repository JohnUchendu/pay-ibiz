// components/InstallPWA.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setShowPrompt(false);
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 left-4 right-4 bg-secondary text-accent p-4 rounded-lg shadow-lg"
    >
      <p className="text-sm font-medium">Install QR Pay for a better experience!</p>
      <div className="flex justify-end space-x-2 mt-2">
        <button
          onClick={() => setShowPrompt(false)}
          className="px-3 py-1 text-sm bg-gray-200 text-primary rounded hover:bg-gray-300"
        >
          Dismiss
        </button>
        <button
          onClick={handleInstall}
          className="px-3 py-1 text-sm bg-accent text-primary rounded hover:bg-gray-200"
        >
          Install
        </button>
      </div>
    </motion.div>
  );
}