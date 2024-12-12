'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getHint } from '../../../utils/qrGenerator';
import { Lock, Unlock, Key, Sparkles } from 'lucide-react';
import { use } from 'react';

  export default function HintPage({ params }) {
  const { id } = use(params);

  const [email, setEmail] = useState('');
  const [hint, setHint] = useState(null);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const emailInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, hintNumber: id }),
      });

      const data = await response.json();

      if (data.success) {
        setHint(getHint(id));
      } else {
        setError(data.message || 'Email verification failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br bg-black overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 z-1 opacity-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(5,150,105,${isHovered ? '0.5' : '0'}) 0%, transparent 70%)`
        }}
        animate={{ opacity: isHovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-96"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h2 className="text-3xl mb-14 text-center text-white font-bold flex items-center justify-center gap-3  ">
          {!hint ? <Lock className="text-[#00f5d0]" size={32} /> : <Unlock className="text-[#00f5d0]" size={32} />}
          Hint Verification
        </h2>

        {/* Form or Hint Display */}
        {!hint ? (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f5d0]" size={20} />
              <input
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your secret email"
                required
                disabled={isVerifying}
                className="w-full bg-transparent pl-10 pr-3 py-4 border-2 text-white border-gray-300 rounded-lg focus:outline-none focus:border-[#00f5d0] transition duration-300 disabled:opacity-50"
              />
            </motion.div>
            <motion.button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#00f5d0] text-black py-3 rounded-lg hover:bg-gray-400 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isVerifying ? (
                <>
                  <Sparkles className="animate-pulse" size={20} />
                  Verifying...
                </>
              ) : (
                "Unlock Hint"
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="mx-auto mb-4 text-[#00f5d0] animate-spin" size={48} />
            <h3 className="text-2xl font-bold mb-4 text-white">Hint Revealed!</h3>
            <p className="text-gray-700 text-lg bg-gray-200 p-4 rounded-lg shadow-inner">
              {hint}
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="text-red-400 mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
