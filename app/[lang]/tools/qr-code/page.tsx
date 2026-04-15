import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import Footer from '@/components/Footer';
import { getDictionary, isValidLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isValidLocale(params.lang)) return {};
  const t = getDictionary(params.lang as Locale).tools.qrCode;
  return {
    title: t.h1,
    description: t.seoBody.slice(0, 160),
    alternates: {
      languages: {
        en: '/en/tools/qr-code',
        fr: '/fr/tools/qr-code',
      },
    },
  };
}

const QrCodeGenerator = dynamic(() => import('@/components/tools/QrCodeGenerator'), {
  ssr: false,
  loading: () => (
    <div className="border border-neutral-800 h-48 flex items-center justify-center">
      <span className="text-neutral-600 text-sm font-mono">Loading…</span>
    </div>
  ),
});

export default function QrCodePage({ params }: { params: { lang: string } }) {
  if (!isValidLocale(params.lang)) notFound();

  const lang = params.lang as Locale;
  const dict = getDictionary(lang);
  const t = dict.tools.qrCode;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.h1,
    url: `https://quicktools.vercel.app/${lang}/tools/qr-code`,
    applicationCategory: 'UtilitiesApplication',
    description: t.seoBody.slice(0, 200),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6">
          <nav className="pt-8 pb-2">
            <Link href={`/${lang}`} className="text-sm text-neutral-500 hover:text-white transition-colors">
              {dict.nav.back}
            </Link>
          </nav>

          <div className="pt-8 pb-10 overflow-x-auto flex justify-center">
            <AdSlot size="leaderboard" />
          </div>

          <div className="pb-8">
            <h1 className="text-2xl font-semibold">{t.h1}</h1>
          </div>

          <div className="pb-16">
            <QrCodeGenerator />
          </div>

          <div className="pb-12 flex justify-center">
            <AdSlot size="rectangle" />
          </div>

          <section className="pb-16 border-t border-neutral-800 pt-12">
            <p className="text-sm text-neutral-500 leading-7 max-w-prose">{t.seoBody}</p>
          </section>
        </div>
      </main>

      <Footer lang={lang} copyright={dict.footer.copyright} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
