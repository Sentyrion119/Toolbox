'use client';

import { useEffect, useRef } from 'react';

type AdSize = 'leaderboard' | 'rectangle';

const dimensions: Record<AdSize, { width: number; height: number }> = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
};

const slotIds: Record<AdSize, string | undefined> = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD,
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE,
};

const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

export default function AdSlot({ size }: { size: AdSize }) {
  const { width, height } = dimensions[size];
  const slotId = slotIds[size];
  const isDev = process.env.NODE_ENV === 'development';
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (isDev || !publisherId || !slotId || pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // silently ignore if adsbygoogle is not loaded yet
    }
  }, [isDev, slotId]);

  if (isDev) {
    return (
      <div
        className="flex items-center justify-center border border-dashed border-neutral-700 text-neutral-600 text-xs font-mono mx-auto"
        style={{ width, height, minHeight: height }}
      >
        Ad — {width}×{height}
      </div>
    );
  }

  if (!publisherId || !slotId) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle mx-auto block"
      style={{ display: 'block', width, height }}
      data-ad-client={publisherId}
      data-ad-slot={slotId}
      data-ad-format="fixed"
    />
  );
}
