'use client';

import { useState, useRef, useCallback } from 'react';
import PrivacyBadge from '@/components/PrivacyBadge';
import { useDictionary } from '@/components/DictionaryProvider';
import { interp } from '@/lib/format';

interface PageImage {
  dataUrl: string;
  pageNumber: number;
}

export default function PdfConverter() {
  const dict = useDictionary();
  const t = dict.tools.pdfTool;

  const [pages, setPages] = useState<PageImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convertPdf = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setPages([]);
    setProgress(null);

    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      const results: PageImage[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(interp(t.converting, { page: i, total: pdf.numPages }));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context unavailable');

        await page.render({ canvasContext: ctx, viewport }).promise;
        results.push({ dataUrl: canvas.toDataURL('image/jpeg', 0.92), pageNumber: i });
      }

      setPages(results);
    } catch (err) {
      const message =
        err instanceof Error && err.message.toLowerCase().includes('password')
          ? t.passwordProtected
          : t.conversionFailed;
      setError(message);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [t]);

  const downloadPage = useCallback((dataUrl: string, pageNumber: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `page-${String(pageNumber).padStart(3, '0')}.jpg`;
    a.click();
  }, []);

  const downloadAll = useCallback(async () => {
    if (pages.length === 0) return;

    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const { dataUrl, pageNumber } of pages) {
      const base64 = dataUrl.split(',')[1];
      zip.file(`page-${String(pageNumber).padStart(3, '0')}.jpg`, base64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pages.zip';
    a.click();
    URL.revokeObjectURL(url);
  }, [pages]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === 'application/pdf') convertPdf(file);
    },
    [convertPdf]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) convertPdf(file);
    },
    [convertPdf]
  );

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
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-neutral-300">{t.dropPdf}</p>
        <p className="text-neutral-600 text-sm mt-1">{t.pdfOnly}</p>
      </div>

      {isProcessing && (
        <p className="text-sm text-neutral-400 font-mono animate-pulse">
          {progress ?? '…'}
        </p>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {pages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-neutral-400">
              {interp(pages.length === 1 ? t.pageCountOne : t.pageCountMany, { n: pages.length })}
            </p>
            {pages.length > 1 && (
              <button
                onClick={downloadAll}
                className="text-sm px-3 py-1.5 border border-neutral-700 hover:border-neutral-400 transition-colors"
              >
                {t.downloadAll}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pages.map(({ dataUrl, pageNumber }) => (
              <div
                key={pageNumber}
                className="group relative border border-neutral-800 bg-[#111]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUrl} alt={`Page ${pageNumber}`} className="w-full block" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => downloadPage(dataUrl, pageNumber)}
                    className="text-sm px-3 py-1.5 bg-white text-black hover:bg-neutral-200 transition-colors"
                  >
                    {t.downloadPage}
                  </button>
                </div>
                <p className="text-xs font-mono text-neutral-500 text-center py-1.5">
                  p.{pageNumber}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
