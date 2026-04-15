type AdSize = 'leaderboard' | 'rectangle';

const dimensions: Record<AdSize, { width: number; height: number }> = {
  leaderboard: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
};

export default function AdSlot({ size }: { size: AdSize }) {
  const { width, height } = dimensions[size];
  const isDev = process.env.NODE_ENV === 'development';

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

  return <div style={{ width, height, minHeight: height }} className="mx-auto" />;
}
