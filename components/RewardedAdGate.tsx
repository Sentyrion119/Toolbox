'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Dictionary } from '@/lib/i18n';
import { interp } from '@/lib/format';

const SESSION_KEY = 'qt_premium_unlocked_at';
const AD_COUNTDOWN_SECONDS = process.env.NODE_ENV === 'development' ? 5 : 30;
export const PREMIUM_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export function isPremiumUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  return Date.now() - parseInt(raw, 10) < PREMIUM_DURATION_MS;
}

export function premiumRemainingMs(): number {
  if (typeof window === 'undefined') return 0;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return 0;
  return Math.max(0, PREMIUM_DURATION_MS - (Date.now() - parseInt(raw, 10)));
}

interface RewardedAdGateProps {
  onClose: () => void;
  onUnlock: () => void;
  dict: Dictionary['rewardedAd'];
}

export default function RewardedAdGate({ onClose, onUnlock, dict }: RewardedAdGateProps) {
  const [secondsLeft, setSecondsLeft] = useState(AD_COUNTDOWN_SECONDS);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanSkip(true);
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const unlock = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, String(Date.now()));
    onUnlock();
  }, [onUnlock]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#111] border border-neutral-700 w-full max-w-md">
        <div className="p-5 border-b border-neutral-800">
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">
            {dict.adLabel}
          </p>
          <h2 className="font-semibold text-lg">{dict.title}</h2>
          <p className="text-sm text-neutral-400 mt-1">{dict.subtitle}</p>
        </div>

        {/* Simulated video player — replace with real rewarded ad SDK in production */}
        <div className="relative bg-neutral-900 aspect-video flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
          <svg
            className="relative z-10 text-neutral-600"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800">
            <div
              className="h-full bg-white transition-all duration-1000 ease-linear"
              style={{
                width: `${((AD_COUNTDOWN_SECONDS - secondsLeft) / AD_COUNTDOWN_SECONDS) * 100}%`,
              }}
            />
          </div>
          {!canSkip && (
            <div className="absolute top-3 right-3 bg-black/60 px-2 py-0.5 text-xs font-mono text-neutral-300">
              {interp(dict.countdownLabel, { n: secondsLeft })}
            </div>
          )}
        </div>

        <div className="p-4 flex justify-end">
          <button
            onClick={canSkip ? unlock : undefined}
            disabled={!canSkip}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              canSkip
                ? 'bg-white text-black hover:bg-neutral-200 active:bg-neutral-300'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {canSkip ? dict.skipNow : interp(dict.countdownLabel, { n: secondsLeft })}
          </button>
        </div>
      </div>
    </div>
  );
}
