'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import RewardedAdGate, { isPremiumUnlocked } from '@/components/RewardedAdGate';
import { useDictionary } from '@/components/DictionaryProvider';

type DotType = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
type CornerSquareType = 'square' | 'extra-rounded' | 'dot';

interface StyleOption<T extends string> {
  value: T;
  labelKey: keyof ReturnType<typeof useDictionary>['tools']['qrCode'];
  premium: boolean;
}

const DOT_STYLES: StyleOption<DotType>[] = [
  { value: 'square', labelKey: 'styleSquare', premium: false },
  { value: 'rounded', labelKey: 'styleRounded', premium: true },
  { value: 'dots', labelKey: 'styleDots', premium: true },
  { value: 'classy', labelKey: 'styleClassy', premium: true },
  { value: 'classy-rounded', labelKey: 'styleClassyRounded', premium: true },
  { value: 'extra-rounded', labelKey: 'styleExtraRounded', premium: true },
];

const CORNER_STYLES: StyleOption<CornerSquareType>[] = [
  { value: 'square', labelKey: 'cornerSquare', premium: false },
  { value: 'extra-rounded', labelKey: 'cornerExtraRounded', premium: true },
  { value: 'dot', labelKey: 'cornerDot', premium: true },
];

export default function QrCodeGenerator() {
  const dict = useDictionary();
  const t = dict.tools.qrCode;

  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [dotStyle, setDotStyle] = useState<DotType>('square');
  const [cornerStyle, setCornerStyle] = useState<CornerSquareType>('square');
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [showAdGate, setShowAdGate] = useState(false);
  const [pendingStyle, setPendingStyle] = useState<{ dot?: DotType; corner?: CornerSquareType } | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<import('qr-code-styling').default | null>(null);

  useEffect(() => {
    const tick = () => {
      const unlocked = isPremiumUnlocked();
      setPremiumUnlocked(unlocked);
      if (!unlocked) {
        setDotStyle('square');
        setCornerStyle('square');
      }
    };

    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!text.trim() || !previewRef.current) return;

    let cancelled = false;

    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      if (cancelled || !previewRef.current) return;

      previewRef.current.innerHTML = '';

      const qr = new QRCodeStyling({
        width: Math.min(size, 400),
        height: Math.min(size, 400),
        data: text,
        dotsOptions: { type: dotStyle, color: fgColor },
        cornersSquareOptions: { type: cornerStyle, color: fgColor },
        cornersDotOptions: { color: fgColor },
        backgroundOptions: { color: bgColor },
      });

      qr.append(previewRef.current);
      qrInstanceRef.current = qr;
    });

    return () => { cancelled = true; };
  }, [text, size, dotStyle, cornerStyle, fgColor, bgColor]);

  const downloadAs = useCallback(async (ext: 'png' | 'svg') => {
    if (!qrInstanceRef.current) return;
    await qrInstanceRef.current.download({ name: 'qr-code', extension: ext });
  }, []);

  const requestStyle = useCallback(
    (type: 'dot' | 'corner', value: DotType | CornerSquareType, isPremium: boolean) => {
      if (!isPremium || premiumUnlocked) {
        if (type === 'dot') setDotStyle(value as DotType);
        else setCornerStyle(value as CornerSquareType);
        return;
      }
      setPendingStyle(type === 'dot' ? { dot: value as DotType } : { corner: value as CornerSquareType });
      setShowAdGate(true);
    },
    [premiumUnlocked]
  );

  const handleUnlock = useCallback(() => {
    setPremiumUnlocked(true);
    setShowAdGate(false);
    if (pendingStyle?.dot) setDotStyle(pendingStyle.dot);
    if (pendingStyle?.corner) setCornerStyle(pendingStyle.corner);
    setPendingStyle(null);
  }, [pendingStyle]);

  const hasContent = text.trim().length > 0;

  return (
    <div className="space-y-6">
      {showAdGate && (
        <RewardedAdGate
          dict={dict.rewardedAd}
          onUnlock={handleUnlock}
          onClose={() => setShowAdGate(false)}
        />
      )}

      <div>
        <label htmlFor="qr-input" className="block text-sm text-neutral-400 mb-2">
          {t.inputLabel}
        </label>
        <input
          id="qr-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full bg-[#111] border border-neutral-700 px-3 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            {t.sizeLabel} <span className="font-mono text-white">{size}px</span>
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="32"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="qr-fg" className="block text-sm text-neutral-400 mb-2">
              {t.foregroundLabel}
            </label>
            <input
              id="qr-fg"
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-9 bg-[#111] border border-neutral-700"
            />
          </div>
          <div>
            <label htmlFor="qr-bg" className="block text-sm text-neutral-400 mb-2">
              {t.backgroundLabel}
            </label>
            <input
              id="qr-bg"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-9 bg-[#111] border border-neutral-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-400">{t.dotStyleLabel}</span>
            {!premiumUnlocked && (
              <span className="text-xs font-mono text-amber-500/80">{t.watchToUnlock}</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {DOT_STYLES.map(({ value, labelKey, premium }) => (
              <button
                key={value}
                onClick={() => requestStyle('dot', value, premium)}
                className={`relative px-2 py-1.5 text-xs border transition-colors ${
                  dotStyle === value
                    ? 'border-white text-white'
                    : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
              >
                {t[labelKey] as string}
                {premium && !premiumUnlocked && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2">
            <span className="text-sm text-neutral-400">{t.cornerStyleLabel}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {CORNER_STYLES.map(({ value, labelKey, premium }) => (
              <button
                key={value}
                onClick={() => requestStyle('corner', value, premium)}
                className={`relative px-2 py-1.5 text-xs border transition-colors ${
                  cornerStyle === value
                    ? 'border-white text-white'
                    : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
              >
                {t[labelKey] as string}
                {premium && !premiumUnlocked && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasContent && (
        <div className="space-y-4">
          <div
            ref={previewRef}
            className="flex justify-center items-center p-8 border border-neutral-800 bg-[#111] min-h-[200px]"
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => downloadAs('png')}
              className="py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
            >
              {t.downloadPng}
            </button>
            <button
              onClick={() => downloadAs('svg')}
              className="py-2 border border-neutral-700 text-sm hover:border-neutral-500 transition-colors"
            >
              {t.downloadSvg}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
