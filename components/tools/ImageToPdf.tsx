'use client';

import { useState, useRef, useCallback } from 'react';
import PrivacyBadge from '@/components/PrivacyBadge';
import { useDictionary } from '@/components/DictionaryProvider';

interface ImageEntry {
  id: string;
  file: File;
  preview: string;
}

export default function ImageToPdf() {
  const dict = useDictionary();
  const t = dict.tools.pdfTool;

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) return;

    const entries: ImageEntry[] = valid.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...entries]);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files);
      e.target.value = '';
    },
    [addFiles]
  );

  const remove = useCallback((id: string) => {
    setImages((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry) URL.revokeObjectURL(entry.preview);
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  const move = useCallback((id: string, direction: -1 | 1) => {
    setImages((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx < 0) return prev;
      const next = idx + direction;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }, []);

  const createPdf = useCallback(async () => {
    if (images.length === 0) {
      setError(t.errorNoImages);
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { jsPDF } = await import('jspdf');

      const loadImg = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      let pdf: InstanceType<typeof jsPDF> | null = null;

      for (let i = 0; i < images.length; i++) {
        const img = await loadImg(images[i].preview);
        const orientation = img.width >= img.height ? 'landscape' : 'portrait';

        if (i === 0) {
          pdf = new jsPDF({ orientation, unit: 'px', format: [img.width, img.height] });
        } else {
          pdf!.addPage([img.width, img.height], orientation);
        }

        pdf!.addImage(img, 'JPEG', 0, 0, img.width, img.height);
      }

      pdf!.save('images.pdf');
    } catch {
      setError(t.conversionFailed);
    } finally {
      setIsCreating(false);
    }
  }, [images, t]);

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
        className={`border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-white bg-white/5'
            : 'border-neutral-700 hover:border-neutral-500'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="text-neutral-300">{t.dropImages}</p>
        <p className="text-neutral-600 text-sm mt-1">{t.imagesFormats}</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map(({ id, preview, file }, idx) => (
              <div key={id} className="border border-neutral-800 bg-[#111] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt={file.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-1.5 flex items-center gap-1">
                  <button
                    onClick={() => move(id, -1)}
                    disabled={idx === 0}
                    className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 text-xs"
                    aria-label={t.moveUp}
                  >
                    {t.moveUp}
                  </button>
                  <button
                    onClick={() => move(id, 1)}
                    disabled={idx === images.length - 1}
                    className="p-1 text-neutral-500 hover:text-white disabled:opacity-30 text-xs"
                    aria-label={t.moveDown}
                  >
                    {t.moveDown}
                  </button>
                  <button
                    onClick={() => remove(id)}
                    className="ml-auto p-1 text-neutral-500 hover:text-red-400 text-xs transition-colors"
                    aria-label={t.remove}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={createPdf}
            disabled={isCreating}
            className="w-full py-2 bg-white text-black text-sm font-medium hover:bg-neutral-200 active:bg-neutral-300 disabled:opacity-50 transition-colors"
          >
            {isCreating ? t.creatingPdf : t.createPdf}
          </button>
        </div>
      )}
    </div>
  );
}
