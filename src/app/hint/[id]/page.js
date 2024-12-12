
'use client';

import { useState } from 'react';
import { use } from 'react';
import { getHint } from '../../../utils/qrGenerator';

export default function HintPage({ params }) {
  // Unwrap params
  const { id } = use(params);

  const [email, setEmail] = useState('');
  const [hint, setHint] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          hintNumber: id // Use unwrapped ID
        }),
      });

      const data = await response.json();

      if (data.success) {
        setHint(getHint(id));
      } else {
        setError(data.message || 'Email verification failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl mb-4">Hint Verification</h2>
        {!hint ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Verify Email
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Hint Revealed!</h3>
            <p className="text-gray-700">{hint}</p>
          </div>
        )}
        {error && (
          <div className="text-red-500 mt-4 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
