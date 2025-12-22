'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { CheckCircle, Shield } from 'lucide-react';

interface TurnstileCaptchaProps {
  onVerify: (verified: boolean) => void;
  isVerified: boolean;
}

export default function TurnstileCaptcha({ onVerify, isVerified }: TurnstileCaptchaProps) {
  // Cloudflare Turnstile test site key (always passes for development)
  // For production, replace with your actual Turnstile site key from:
  // https://dash.cloudflare.com/?to=/:account/turnstile
  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  const handleSuccess = (token: string) => {
    console.log('Turnstile verification successful:', token);
    onVerify(true);
  };

  const handleError = () => {
    console.error('Turnstile verification failed');
    onVerify(false);
  };

  const handleExpire = () => {
    console.warn('Turnstile token expired');
    onVerify(false);
  };

  if (isVerified) {
    return (
      <div className="p-4 rounded-xl border-2 bg-emerald-50 border-emerald-300">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-emerald-900">Verification Complete</h3>
            <p className="text-sm text-emerald-700">Protected by Cloudflare Turnstile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border-2 bg-gray-50 border-gray-300">
      <div className="flex items-center gap-3 mb-3">
        <Shield className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Verify you're human</h3>
      </div>

      <div className="flex flex-col items-center">
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={handleSuccess}
          onError={handleError}
          onExpire={handleExpire}
          options={{
            theme: 'light',
            size: 'normal',
          }}
        />
        <p className="text-xs text-gray-500 mt-3 text-center">
          Protected by Cloudflare Turnstile
        </p>
      </div>
    </div>
  );
}
