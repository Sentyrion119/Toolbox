'use client';

import { useState, useCallback, useRef } from 'react';
import PrivacyBadge from '@/components/PrivacyBadge';
import { useDictionary } from '@/components/DictionaryProvider';
import { formatBytes } from '@/lib/format';

type ResizeMode = 'dimensions' | 'percentage';
type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const FORMAT_LABELS: Record<OutputFormat, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
};

const FORMAT_EXTENSIONS: Record<OutputFormat, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

interface SourceImage {
  file: File;
  width: number;
  height: number;
  objectUrl: string;
}

export default function ImageResizer() {
  const dict = useDictionary();
  const t = dict.tools.imageResizer;

  const [isDragging, setIsDragging] = useState(false);
  const [source, setSource] = useState<SourceImage | null>(null);
  const [mode, setMode] = useState<ResizeMode>('dimensions');
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [percentage, setPercentage] = useState(100);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const aspectRatioRef = useRef<number>(1);
  const resultUrlRef = useRef<string | null>(null);

  const loadFile = useCallback((file: File) => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setResultUrl(null);
    setResultSize(null);
    setError(null);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      aspectRatioRef.current = img.width / img.height;
      setSource({ file, width: img.width, height: img.height, objectUrl });
      setTargetWidth(String(img.width));
      setTargetHeight(String(img.height));
    };
    img.src = objectUrl;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) loadFile(file);
  }, [loadFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const handleWidthChange = useCallback((val: string) => {
    setTargetWidth(val);
    if (lockAspect) {
      const w = parseInt(val, 10);
      if (!isNaN(w) && w > 0) {
        setTargetHeight(String(Math.round(w / aspectRatioRef.current)));
      }
    }
  }, [lockAspect]);

  const handleHeightChange = useCallback((val: string) => {
    setTargetHeight(val);
    if (lockAspect) {
      const h = parseInt(val, 10);
      if (!isNaN(h) && h > 0) {
        setTargetWidth(String(Math.round(h * aspectRatioRef.current)));
      }
    }
  }, [lockAspect]);

  const outputDimensions = source
    ? mode === 'percentage'
      ? {
          w: Math.max(1, Math.round((source.width * percentage) / 100)),
          h: Math.max(1, Math.round((source.height * percentage) / 100)),
        }
      : {
          w: Math.max(1, parseInt(targetWidth, 10) || source.width),
          h: Math.max(1, parseInt(targetHeight, 10) || source.height),
        }
    : null;

  const resize = useCallback(() => {
    if (!source || !outputDimensions) return;
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputDimensions.w;
      canvas.height = outputDimensions.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setError(t.errorFailed); return; }
      ctx.drawImage(img, 0, 0, outputDimensions.w, outputDimensions.h);
      canvas.toBlob(
        (blob) => {
          if (!blob) { setError(t.errorFailed); return; }
          if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
          const url = URL.createObjectURL(blob);
          resultUrlRef.current = url;
          setResultUrl(url);
          setResultSize(blob.size);
        },
        outputFormat,
        outputFormat !== 'image/png' ? 0.92 : undefined,
      );
    };
    img.src = source.objectUrl;
  }, [source, outputDimensions, outputFormat, t]);

  const download = useCallback(() => {
    if (!resultUrl || !source) return;
    const baseName = source.file.name.replace(/\.[^.]+$/, '');
    const ext = FORMAT_EXTENSIONS[outputFormat];
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${baseName}-resized.${ext}`;
    a.click();
  }, [resultUrl, source, outputFormat]);

  return (
    <div className="space-y-6">
      <PrivacyBadge text={dict.privacyBadge} />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed p-14 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-white bg-white/5' : 'border-neutral-700 hover:border-neutral-500'
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

      {source && (
        <>
          <div className="flex border border-neutral-800">
            {(['dimensions', 'percentage'] as ResizeMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm transition-colors ${
                  mode === m ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m === 'dimensions' ? t.tabDimensions : t.tabPercentage}
              </button>
            ))}
          </div>

          {mode === 'dimensions' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">{t.widthLabel}</label>
                  <input
                    type="number"
                    min="1"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2.5 text-white font-mono focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">{t.heightLabel}</label>
                  <input
                    type="number"
                    min="1"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full bg-[#111] border border-neutral-700 px-3 py-2.5 text-white font-mono focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="accent-white"
                />
                <span className="text-sm text-neutral-400">{t.lockAspect}</span>
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                {t.percentageLabel} <span className="font-mono text-white">{percentage}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          )}

          {outputDimensions && (
            <div className="border border-neutral-800 p-4">
              <div className="grid grid-cols-2 text-sm">
                <div>
                  <p className="text-neutral-500 mb-0.5">{t.originalLabel}</p>
                  <p className="font-mono text-white">
                    {source.width} × {source.height}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-500 mb-0.5">{t.outputLabel}</p>
                  <p className="font-mono text-white">
                    {outputDimensions.w} × {outputDimensions.h}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="ir-format" className="block text-sm text-neutral-400 mb-2">
              {t.formatLabel}
            </label>
            <select
              id="ir-format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
              className="w-full bg-[#111] border border-neutral-700 px-3 py-2.5 text-white focus:outline-none focus:border-neutral-500 transition-colors"
            >
              {(Object.keys(FORMAT_LABELS) as OutputFormat[]).map((fmt) => (
                <option key={fmt} value={fmt} className="bg-[#111]">
                  {FORMAT_LABELS[fmt]}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resize}
            className="w-full py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
          >
            {t.resizeBtn}
          </button>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {resultUrl && resultSize !== null && (
            <div className="border border-neutral-800 p-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">{t.outputLabel}</span>
                <span className="font-mono text-white">{formatBytes(resultSize)}</span>
              </div>
              <button
                onClick={download}
                className="w-full py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
              >
                {t.downloadBtn}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
