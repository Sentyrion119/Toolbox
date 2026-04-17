'use client';

import { useState, useCallback } from 'react';
import { useDictionary } from '@/components/DictionaryProvider';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

function buildCharset(upper: boolean, lower: boolean, numbers: boolean, symbols: boolean): string {
  return [upper ? UPPERCASE : '', lower ? LOWERCASE : '', numbers ? NUMBERS : '', symbols ? SYMBOLS : ''].join('');
}

function generatePassword(length: number, charset: string): string {
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (n) => charset[n % charset.length]).join('');
}

function strengthScore(password: string): 0 | 1 | 2 | 3 {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const variety = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  if (password.length >= 16 && variety >= 4) return 3;
  if (password.length >= 12 && variety >= 3) return 2;
  if (password.length >= 8 && variety >= 2) return 1;
  return 0;
}

const STRENGTH_COLORS = ['bg-red-500', 'bg-amber-500', 'bg-blue-400', 'bg-green-400'];
const STRENGTH_TEXT_COLORS = ['text-red-400', 'text-amber-400', 'text-blue-400', 'text-green-400'];

export default function PasswordGenerator() {
  const dict = useDictionary();
  const t = dict.tools.passwordGenerator;

  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [quantity, setQuantity] = useState(3);
  const [passwords, setPasswords] = useState<string[]>(() => {
    const charset = buildCharset(true, true, true, true);
    return Array.from({ length: 3 }, () => generatePassword(16, charset));
  });
  const [copied, setCopied] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(() => {
    const charset = buildCharset(useUpper, useLower, useNumbers, useSymbols);
    if (!charset) {
      setError(t.errorNoCharset);
      setPasswords([]);
      return;
    }
    setError(null);
    setCopied(null);
    setPasswords(Array.from({ length: quantity }, () => generatePassword(length, charset)));
  }, [length, useUpper, useLower, useNumbers, useSymbols, quantity, t]);

  const copy = useCallback(async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied((c) => (c === index ? null : c)), 2000);
  }, []);

  const strengthLabels = [t.strengthWeak, t.strengthFair, t.strengthStrong, t.strengthVeryStrong];

  const checkboxes = [
    { label: t.uppercaseLabel, value: useUpper, set: setUseUpper },
    { label: t.lowercaseLabel, value: useLower, set: setUseLower },
    { label: t.numbersLabel, value: useNumbers, set: setUseNumbers },
    { label: t.symbolsLabel, value: useSymbols, set: setUseSymbols },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-neutral-400 mb-2">
          {t.lengthLabel} <span className="font-mono text-white">{length}</span>
        </label>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-white"
        />
      </div>

      <div className="space-y-2">
        {checkboxes.map(({ label, value, set }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => set(e.target.checked)}
              className="accent-white"
            />
            <span className="text-sm text-neutral-300">{label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-2">
          {t.quantityLabel} <span className="font-mono text-white">{quantity}</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full accent-white"
        />
      </div>

      <button
        onClick={generate}
        className="w-full py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
      >
        {t.regenerateBtn}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {passwords.length > 0 && (
        <div className="space-y-3">
          {passwords.map((pw, i) => {
            const score = strengthScore(pw);
            return (
              <div key={i} className="border border-neutral-800 p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-sm text-white break-all leading-relaxed">{pw}</p>
                  <button
                    onClick={() => copy(pw, i)}
                    className="shrink-0 px-3 py-1.5 text-sm border border-neutral-700 hover:border-neutral-400 transition-colors"
                  >
                    {copied === i ? t.copiedBtn : t.copyBtn}
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">{t.strengthLabel}</span>
                    <span className={`font-mono ${STRENGTH_TEXT_COLORS[score]}`}>
                      {strengthLabels[score]}
                    </span>
                  </div>
                  <div className="h-1 bg-neutral-800">
                    <div
                      className={`h-full transition-all ${STRENGTH_COLORS[score]}`}
                      style={{ width: `${(score + 1) * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
