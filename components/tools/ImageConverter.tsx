'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import PrivacyBadge from '@/components/PrivacyBadge';
import { useDictionary } from '@/components/DictionaryProvider';
import { formatBytes } from '@/lib/format';

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

const LOSSY_FORMATS: OutputFormat[] = ['image/jpeg', 'image/webp'];

interface ConvertedFile {
  name: string;
  url: string;
  blob: Blob;
  size: number;
}

function convertImage(file: File, format: OutputFormat, quality: number): Promise<ConvertedFile> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('no context')); return; }
      ctx.drawImage(img, 0, 0);
      const isLossy = LOSSY_FORMATS.includes(format);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('toBlob failed')); return; }
          const url = URL.createObjectURL(blob);
          const ext = FORMAT_EXTENSIONS[format];
          const baseName = file.name.replace(/\.[^.]+$/, '');
          resolve({ name: `${baseName}.${ext}`, url, blob, size: blob.size });
        },
        format,
        isLossy ? quality / 100 : undefined,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('load failed')); };
    img.src = objectUrl;
  });
}

export default function ImageConverter() {
  const dict = useDictionary();
  const t = dict.tools.imageConverter;

  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState<ConvertedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const sourceFilesRef = useRef<File[]>([]);
  const resultUrlsRef = useRef<string[]>([]);

  const convertFiles = useCallback(async (files: File[], format: OutputFormat, q: number) => {
    resultUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    resultUrlsRef.current = [];
    setIsConverting(true);
    setError(null);
    setResults([]);
    try {
      const converted: ConvertedFile[] = [];
      for (const file of files) {
        const result = await convertImage(file, format, q);
        resultUrlsRef.current.push(result.url);
        converted.push(result);
      }
      setResults(converted);
    } catch {
      setError(t.errorFailed);
    } finally {
      setIsConverting(false);
    }
  }, [t]);

  useEffect(() => {
    if (sourceFilesRef.current.length === 0) return;
    const files = sourceFilesRef.current;
    const timer = setTimeout(() => convertFiles(files, outputFormat, quality), 400);
    return () => clearTimeout(timer);
  }, [quality, outputFormat, convertFiles]);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 5);
    if (files.length === 0) return;
    sourceFilesRef.current = files;
    convertFiles(files, outputFormat, quality);
  }, [convertFiles, outputFormat, quality]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const download = useCallback((result: ConvertedFile) => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.name;
    a.click();
  }, []);

  const downloadAll = useCallback(async () => {
    if (results.length <= 1) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    for (const result of results) {
      zip.file(result.name, result.blob);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const isLossy = LOSSY_FORMATS.includes(outputFormat);

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
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-neutral-300">{t.dropzone}</p>
        <p className="text-neutral-600 text-sm mt-1">{t.dropzoneFormats}</p>
      </div>

      <div className={`grid gap-6 ${isLossy ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        <div>
          <label htmlFor="ic-format" className="block text-sm text-neutral-400 mb-2">
            {t.formatLabel}
          </label>
          <select
            id="ic-format"
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

        {isLossy && (
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
        )}
      </div>

      {isConverting && (
        <p className="text-sm text-neutral-400 animate-pulse">{t.converting}</p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {results.length > 0 && (
        <div className="border border-neutral-800 p-4 space-y-4">
          {results.map((result) => (
            <div key={result.name} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-mono text-white truncate">{result.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{formatBytes(result.size)}</p>
              </div>
              <button
                onClick={() => download(result)}
                className="shrink-0 px-3 py-1.5 text-sm border border-neutral-700 hover:border-neutral-400 transition-colors"
              >
                {t.downloadBtn}
              </button>
            </div>
          ))}

          {results.length > 1 && (
            <button
              onClick={downloadAll}
              className="w-full py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
            >
              {t.downloadAllBtn}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
