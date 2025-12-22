'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Shield } from 'lucide-react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
  isVerified: boolean;
}

export default function Captcha({ onVerify, isVerified }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');

  const generateNumbers = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserAnswer('');
    setError('');
    onVerify(false);
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  const handleVerify = () => {
    const correctAnswer = num1 + num2;
    const answer = parseInt(userAnswer);

    if (isNaN(answer)) {
      setError('Please enter a valid number');
      onVerify(false);
      return;
    }

    if (answer === correctAnswer) {
      setError('');
      onVerify(true);
    } else {
      setError('Incorrect answer. Please try again.');
      onVerify(false);
      generateNumbers();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      isVerified
        ? 'bg-emerald-50 border-emerald-300'
        : 'bg-gray-50 border-gray-300'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <Shield className={`w-5 h-5 ${isVerified ? 'text-emerald-600' : 'text-gray-600'}`} />
        <h3 className="font-semibold text-gray-900">
          {isVerified ? 'Verified ✓' : 'Verify you\'re human'}
        </h3>
      </div>

      {!isVerified && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <span>{num1}</span>
              <span>+</span>
              <span>{num2}</span>
              <span>=</span>
            </div>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="?"
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={handleVerify}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition"
            >
              Verify
            </button>
            <button
              type="button"
              onClick={generateNumbers}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition"
              title="Refresh captcha"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>
      )}

      {isVerified && (
        <div className="flex items-center gap-2 text-sm text-emerald-700">
          <span className="font-medium">You've been verified as human</span>
        </div>
      )}
    </div>
  );
}
