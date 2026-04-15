import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';

const BASE_URL = 'https://quicktools.vercel.app';

const paths = [
  '',
  '/tools/image-compressor',
  '/tools/qr-code',
  '/tools/pdf-converter',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((lang) =>
    paths.map((path) => ({
      url: `${BASE_URL}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    }))
  );
}
