// 'use client';

// import { useState, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { getHint } from '../../../utils/qrGenerator';
// import { Lock, Unlock, Key, Sparkles } from 'lucide-react';
// import { use } from 'react';

//   export default function HintPage({ params }) {
//   const { id } = use(params);

//   const [email, setEmail] = useState('');
//   const [hint, setHint] = useState(null);
//   const [error, setError] = useState(null);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const emailInputRef = useRef(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsVerifying(true);

//     try {
//       const response = await fetch('/api/verify-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, hintNumber: id }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setHint(getHint(id));
//       } else {
//         setError(data.message || 'Email verification failed');
//       }
//     } catch (err) {
//       setError('An error occurred');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br bg-black overflow-hidden">
//       {/* Animated Background */}
//       <motion.div
//         className="absolute inset-0 z-0 pointer-events-none"
//         transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
//       />

//       {/* Glow Effect */}
//       <motion.div
//         className="absolute inset-0 z-1 opacity-0"
//         style={{
//           backgroundImage: `radial-gradient(circle at center, rgba(5,150,105,${isHovered ? '0.5' : '0'}) 0%, transparent 70%)`
//         }}
//         animate={{ opacity: isHovered ? 0.7 : 0 }}
//         transition={{ duration: 0.3 }}
//       />

//       {/* Main Content */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-96"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         <h2 className="text-3xl mb-14 text-center text-white font-bold flex items-center justify-center gap-3  ">
//           {!hint ? <Lock className="text-[#00f5d0]" size={32} /> : <Unlock className="text-[#00f5d0]" size={32} />}
//           Hint Verification
//         </h2>

//         {/* Form or Hint Display */}
//         {!hint ? (
//           <motion.form
//             onSubmit={handleSubmit}
//             className="space-y-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             <motion.div className="relative">
//               <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00f5d0]" size={20} />
//               <input
//                 ref={emailInputRef}
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your secret email"
//                 required
//                 disabled={isVerifying}
//                 className="w-full bg-transparent pl-10 pr-3 py-4 border-2 text-white border-gray-300 rounded-lg focus:outline-none focus:border-[#00f5d0] transition duration-300 disabled:opacity-50"
//               />
//             </motion.div>
//             <motion.button
//               type="submit"
//               disabled={isVerifying}
//               className="w-full bg-[#00f5d0] text-black py-3 rounded-lg hover:bg-gray-400 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {isVerifying ? (
//                 <>
//                   <Sparkles className="animate-pulse" size={20} />
//                   Verifying...
//                 </>
//               ) : (
//                 "Unlock Hint"
//               )}
//             </motion.button>
//           </motion.form>
//         ) : (
//           <motion.div
//             className="text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Sparkles className="mx-auto mb-4 text-[#00f5d0] animate-spin" size={48} />
//             <h3 className="text-2xl font-bold mb-4 text-white">Hint Revealed!</h3>
//             <p className="text-gray-700 text-lg bg-gray-200 p-4 rounded-lg shadow-inner">
//               {hint}
//             </p>
//           </motion.div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             className="text-red-400 mt-4 text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             {error}
//           </motion.div>
//         )}
//       </motion.div>
//     </div>
//   );
// }
'use client';

import { useState, useRef, useEffect } from 'react';
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
  const emailInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const matrixSymbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#00f5d0';
      context.font = `${fontSize}px monospace`;
      drops.forEach((y, x) => {
        const text = matrixSymbols[Math.floor(Math.random() * matrixSymbols.length)];
        context.fillText(text, x * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[x] = 0;
        }
        drops[x]++;
      });
    }

    const intervalId = setInterval(drawMatrix, 50);
    return () => clearInterval(intervalId);
  }, []);

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 z-0 w-full h-full"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-black/80 backdrop-blur-lg border-2 border-[#00f5d0] p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl mb-14 text-center text-[#00f5d0] font-bold flex items-center justify-center gap-3 glitch-text">
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
                className="w-full bg-transparent pl-10 pr-3 py-4 border-2 text-[#00f5d0] border-[#00f5d0] rounded-lg focus:outline-none focus:border-white transition duration-300 disabled:opacity-50"
              />
            </motion.div>
            <motion.button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#00f5d0] text-black py-3 rounded-lg hover:bg-gray-400 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 glitch-button"
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
            <h3 className="text-2xl font-bold mb-4 text-[#00f5d0] glitch-text">Hint Revealed!</h3>
            <p className="text-[#00f5d0] text-lg bg-black/80 p-4 rounded-lg shadow-inner border border-[#00f5d0]">
              {hint}
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="text-red-400 mt-4 text-center glitch-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      <style jsx global>{`
        body {
          background: black;
          overflow: hidden;
        }
        .glitch-text {
          position: relative;
          text-shadow: 
            2px 2px 0 #00ff00, 
            -2px -2px 0 #ff0000;
          animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        }
        .glitch-button {
          position: relative;
          overflow: hidden;
        }
        .glitch-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(0,255,208,0.4),
            transparent
          );
          animation: glitch-button 1.5s infinite;
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes glitch-button {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}