'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import PrivacyBadge from '@/components/PrivacyBadge';
import { useDictionary } from '@/components/DictionaryProvider';
import { formatBytes, savingsPercent } from '@/lib/format';

interface Result {
  file: File;
  url: string;
  originalSize: number;
  compressedSize: number;
}

export default function ImageCompressor() {
  const dict = useDictionary();
  const t = dict.tools.imageCompressor;

  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const sourceFileRef = useRef<File | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const compress = useCallback(
    async (file: File, currentQuality: number) => {
      setIsCompressing(true);
      setError(null);
      setResult(null);

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = null;
      }

      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 10,
          useWebWorker: true,
          initialQuality: currentQuality / 100,
          alwaysKeepResolution: true,
        });

        const url = URL.createObjectURL(compressed);
        resultUrlRef.current = url;
        setResult({
          file: compressed,
          url,
          originalSize: file.size,
          compressedSize: compressed.size,
        });
      } catch {
        setError(t.errorFailed);
      } finally {
        setIsCompressing(false);
      }
    },
    [t]
  );

  // Re-compress with debounce whenever the quality slider changes
  useEffect(() => {
    if (!sourceFileRef.current) return;
    const file = sourceFileRef.current;
    const timer = setTimeout(() => compress(file, quality), 400);
    return () => clearTimeout(timer);
  }, [quality, compress]);

  const handleFile = useCallback(
    (file: File) => {
      sourceFileRef.current = file;
      compress(file, quality);
    },
    [compress, quality]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) handleFile(file);
    },
    [handleFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `compressed-${result.file.name}`;
    a.click();
  }, [result]);

  const savings = result ? savingsPercent(result.originalSize, result.compressedSize) : 0;

  return (
    <div className="space-y-6">
      <PrivacyBadge text={dict.privacyBadge} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed p-14 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-white bg-white/5'
            : 'border-neutral-700 hover:border-neutral-500'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-neutral-300">{t.dropzone}</p>
        <p className="text-neutral-600 text-sm mt-1">{t.dropzoneFormats}</p>
      </div>

      <div>
        <label className="block text-sm text-neutral-400 mb-2">
          {t.qualityLabel} <span className="font-mono text-white">{quality}%</span>
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-white"
        />
      </div>

      {isCompressing && (
        <p className="text-sm text-neutral-400 animate-pulse">{t.compressing}</p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <div className="border border-neutral-800 p-4 space-y-4">
          <div className="grid grid-cols-3 text-sm">
            <div>
              <p className="text-neutral-500 mb-0.5">{t.labelOriginal}</p>
              <p className="font-mono text-white">{formatBytes(result.originalSize)}</p>
            </div>
            <div className="text-center">
              <p className="text-neutral-500 mb-0.5">{t.labelSaved}</p>
              <p className="font-mono text-green-400">{savings}%</p>
            </div>
            <div className="text-right">
              <p className="text-neutral-500 mb-0.5">{t.labelOutput}</p>
              <p className="font-mono text-white">{formatBytes(result.compressedSize)}</p>
            </div>
          </div>

          <button
            onClick={download}
            className="w-full py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
          >
            {t.downloadBtn}
          </button>
        </div>
      )}
    </div>
  );
}
