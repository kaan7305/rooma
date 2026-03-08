'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Shield, CheckCircle } from 'lucide-react';

interface ImageCaptchaProps {
  onVerify: (verified: boolean) => void;
  isVerified: boolean;
}

type CaptchaItem = {
  id: number;
  emoji: string;
  isTarget: boolean;
};

export default function ImageCaptcha({ onVerify, isVerified }: ImageCaptchaProps) {
  const [items, setItems] = useState<CaptchaItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [targetType, setTargetType] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const challenges = [
    {
      target: 'houses',
      emoji: '🏠',
      distractors: ['🚗', '🌳', '🎈', '⚽', '📱', '🍕']
    },
    {
      target: 'buildings',
      emoji: '🏢',
      distractors: ['🚗', '🌳', '🎈', '⚽', '📱', '🍕']
    },
    {
      target: 'homes',
      emoji: '🏡',
      distractors: ['🚗', '🌳', '🎈', '⚽', '📱', '🍕']
    }
  ];

  const generateCaptcha = () => {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setTargetType(challenge.target);

    // Create 9 items: 3-4 targets and rest distractors
    const numTargets = 3 + Math.floor(Math.random() * 2); // 3 or 4 targets
    const newItems: CaptchaItem[] = [];

    // Add targets
    for (let i = 0; i < numTargets; i++) {
      newItems.push({
        id: i,
        emoji: challenge.emoji,
        isTarget: true
      });
    }

    // Add distractors
    for (let i = numTargets; i < 9; i++) {
      const randomDistractor = challenge.distractors[Math.floor(Math.random() * challenge.distractors.length)];
      newItems.push({
        id: i,
        emoji: randomDistractor,
        isTarget: false
      });
    }

    // Shuffle items
    for (let i = newItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newItems[i], newItems[j]] = [newItems[j], newItems[i]];
    }

    // Update IDs after shuffle
    newItems.forEach((item, index) => {
      item.id = index;
    });

    setItems(newItems);
    setSelectedIds([]);
    setError('');
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const toggleSelection = (id: number) => {
    if (isVerified) return;

    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleVerify = () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one image');
      return;
    }

    // Check if user selected all targets and no distractors
    const correctSelections = items.filter(item => item.isTarget).map(item => item.id);
    const isCorrect =
      selectedIds.length === correctSelections.length &&
      selectedIds.every(id => correctSelections.includes(id));

    if (isCorrect) {
      setError('');
      onVerify(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        setError('Too many failed attempts. Generating new challenge...');
        setTimeout(generateCaptcha, 2000);
        setAttempts(0);
      } else {
        setError('Incorrect selection. Try again.');
      }
      onVerify(false);
    }
  };

  const handleRefresh = () => {
    generateCaptcha();
    setAttempts(0);
  };

  if (isVerified) {
    return (
      <div className="p-6 rounded-xl border-2 bg-emerald-50 border-emerald-300">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-emerald-900">Verification Complete</h3>
            <p className="text-sm text-emerald-700">You've been verified as human</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border-2 bg-gray-50 border-gray-300">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Verify you're human</h3>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-gray-900 mb-4">
          Select all images with <span className="text-rose-600">{targetType}</span>
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleSelection(item.id)}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-5xl transition-all hover:scale-105 ${
                selectedIds.includes(item.id)
                  ? 'border-rose-500 bg-rose-50 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              {item.emoji}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium mb-3">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleVerify}
            className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition"
            title="New challenge"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Click on all images that match the description above
      </p>
    </div>
  );
}
