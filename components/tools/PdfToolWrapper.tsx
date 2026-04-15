'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDictionary } from '@/components/DictionaryProvider';

const PdfConverter = dynamic(() => import('@/components/tools/PdfConverter'), {
  ssr: false,
  loading: () => <Skeleton />,
});

const ImageToPdf = dynamic(() => import('@/components/tools/ImageToPdf'), {
  ssr: false,
  loading: () => <Skeleton />,
});

function Skeleton() {
  return (
    <div className="border border-neutral-800 h-48 flex items-center justify-center">
      <span className="text-neutral-600 text-sm font-mono">Loading…</span>
    </div>
  );
}

type Mode = 'pdf-to-img' | 'img-to-pdf';

export default function PdfToolWrapper() {
  const dict = useDictionary();
  const t = dict.tools.pdfTool;
  const [mode, setMode] = useState<Mode>('pdf-to-img');

  return (
    <div className="space-y-6">
      <div className="inline-flex border border-neutral-700">
        <button
          onClick={() => setMode('pdf-to-img')}
          className={`px-4 py-2 text-sm transition-colors ${
            mode === 'pdf-to-img'
              ? 'bg-white text-black'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {t.togglePdfToImg}
        </button>
        <button
          onClick={() => setMode('img-to-pdf')}
          className={`px-4 py-2 text-sm border-l border-neutral-700 transition-colors ${
            mode === 'img-to-pdf'
              ? 'bg-white text-black'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          {t.toggleImgToPdf}
        </button>
      </div>

      {mode === 'pdf-to-img' ? <PdfConverter /> : <ImageToPdf />}
    </div>
  );
}
