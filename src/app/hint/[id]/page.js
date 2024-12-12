
// // 'use client';

// // import { useState } from 'react';
// // import { use } from 'react';
// // import { getHint } from '../../../utils/qrGenerator';

// // export default function HintPage({ params }) {
// //   // Unwrap params
// //   const { id } = use(params);

// //   const [email, setEmail] = useState('');
// //   const [hint, setHint] = useState(null);
// //   const [error, setError] = useState(null);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError(null);

// //     try {
// //       const response = await fetch('/api/verify-email', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ 
// //           email, 
// //           hintNumber: id // Use unwrapped ID
// //         }),
// //       });

// //       const data = await response.json();

// //       if (data.success) {
// //         setHint(getHint(id));
// //       } else {
// //         setError(data.message || 'Email verification failed');
// //       }
// //     } catch (err) {
// //       setError('An error occurred');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //       <div className="bg-white p-8 rounded-lg shadow-md w-96">
// //         <h2 className="text-2xl mb-4">Hint Verification</h2>
// //         {!hint ? (
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <input 
// //               type="email" 
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               placeholder="Enter your email"
// //               required
// //               className="w-full px-3 py-2 border rounded-md"
// //             />
// //             <button 
// //               type="submit" 
// //               className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
// //             >
// //               Verify Email
// //             </button>
// //           </form>
// //         ) : (
// //           <div className="text-center">
// //             <h3 className="text-xl font-bold mb-4">Hint Revealed!</h3>
// //             <p className="text-gray-700">{hint}</p>
// //           </div>
// //         )}
// //         {error && (
// //           <div className="text-red-500 mt-4 text-center">
// //             {error}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import { useState, useRef } from 'react';
// import { use } from 'react';
// import { getHint } from '../../../utils/qrGenerator';
// import { Lock, Unlock, Sparkles, Key } from 'lucide-react';

// export default function HintPage({ params }) {
//   // Unwrap params
//   const { id } = use(params);

//   const [email, setEmail] = useState('');
//   const [hint, setHint] = useState(null);
//   const [error, setError] = useState(null);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [animationClass, setAnimationClass] = useState('');
//   const emailInputRef = useRef(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsVerifying(true);

//     // Add shake animation on error
//     const shakeAnimation = () => {
//       setAnimationClass('animate-shake');
//       setTimeout(() => setAnimationClass(''), 500);
//     };

//     try {
//       const response = await fetch('/api/verify-email', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           email, 
//           hintNumber: id
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         // Reveal hint with a magical unveiling effect
//         setAnimationClass('animate-reveal');
//         setTimeout(() => {
//           setHint(getHint(id));
//           setAnimationClass('');
//         }, 500);
//       } else {
//         shakeAnimation();
//         setError(data.message || 'Email verification failed');
//       }
//     } catch (err) {
//       shakeAnimation();
//       setError('An error occurred');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-100">
//       <div className={`
//         bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md 
//         transform transition-all duration-500 
//         ${animationClass}
//       `}>
//         <div className="text-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
//             {!hint ? <Lock className="text-gray-600" size={32} /> : <Unlock className="text-green-600" size={32} />}
//             Hint Verification
//           </h2>
//         </div>

//         {!hint ? (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative">
//               <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//               <input 
//                 ref={emailInputRef}
//                 type="email" 
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your secret email"
//                 required
//                 disabled={isVerifying}
//                 className="
//                   w-full pl-10 pr-3 py-3 border-2 border-gray-300 
//                   rounded-lg focus:outline-none focus:border-purple-500 
//                   transition duration-300 
//                   disabled:opacity-50
//                 "
//               />
//             </div>
//             <button 
//               type="submit" 
//               disabled={isVerifying}
//               className="
//                 w-full bg-purple-600 text-white py-3 rounded-lg 
//                 hover:bg-purple-700 transition duration-300 
//                 flex items-center justify-center gap-2
//                 disabled:opacity-50
//               "
//             >
//               {isVerifying ? (
//                 <>
//                   <Sparkles className="animate-pulse" size={20} />
//                   Verifying...
//                 </>
//               ) : (
//                 "Unlock Hint"
//               )}
//             </button>
//           </form>
//         ) : (
//           <div className="text-center animate-fade-in">
//             <Sparkles className="mx-auto mb-4 text-yellow-500 animate-spin" size={48} />
//             <h3 className="text-2xl font-bold mb-4 text-gray-800">Hint Revealed!</h3>
//             <p className="text-gray-700 text-lg bg-yellow-100 p-4 rounded-lg shadow-inner">
//               {hint}
//             </p>
//           </div>
//         )}

//         {error && (
//           <div className="
//             text-red-600 mt-4 text-center 
//             bg-red-100 p-3 rounded-lg 
//             animate-shake
//           ">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useRef } from 'react';
import { use } from 'react';
import { getHint } from '../../../utils/qrGenerator';
import { Lock, Unlock, Sparkles, Key } from 'lucide-react';

export default function HintPage({ params }) {
  // Unwrap params
  const { id } = use(params);

  const [email, setEmail] = useState('');
  const [hint, setHint] = useState(null);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const emailInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);

    // Add shake animation on error
    const shakeAnimation = () => {
      setAnimationClass('animate-shake');
      setTimeout(() => setAnimationClass(''), 500);
    };

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          hintNumber: id
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reveal hint with a magical unveiling effect
        setAnimationClass('animate-reveal');
        setTimeout(() => {
          setHint(getHint(id));
          setAnimationClass('');
        }, 500);
      } else {
        shakeAnimation();
        setError(data.message || 'Email verification failed');
      }
    } catch (err) {
      shakeAnimation();
      setError('An error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-1 00 p-4">
      <div className={`
        bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md 
        transform transition-all duration-500 
        ${animationClass}
      `}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            {!hint ? <Lock className="text-purple-600" size={32} /> : <Unlock className="text-purple-600" size={32} />}
            Hint Verification
          </h2>
        </div>

        {!hint ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
              <input 
                ref={emailInputRef}
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your secret email"
                required
                disabled={isVerifying}
                className="
                  w-full pl-10 pr-3 py-3 border-2 border-gray-300 
                  rounded-lg focus:outline-none focus:border-purple-500 
                  transition duration-300 
                  disabled:opacity-50
                "
              />
            </div>
            <button 
              type="submit" 
              disabled={isVerifying}
              className="
                w-full bg-purple-600 text-white py-3 rounded-lg 
                hover:bg-purple-700 transition duration-300 
                flex items-center justify-center gap-2
                disabled:opacity-50
              "
            >
              {isVerifying ? (
                <>
                  <Sparkles className="animate-pulse" size={20} />
                  Verifying...
                </>
              ) : (
                "Unlock Hint"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center animate-fade-in">
            <Sparkles className="mx-auto mb-4 text-purple-500 animate-spin" size={48} />
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Hint Revealed!</h3>
            <p className="text-gray-700 text-lg bg-gray-200 p-4 rounded-lg shadow-inner">
              
              {hint}
            </p>
          </div>
        )}

        {error && (
          <div className="
            text-red-600 mt-4 text-center 
            bg-red-100 p-3 rounded-lg 
            animate-shake
          ">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}