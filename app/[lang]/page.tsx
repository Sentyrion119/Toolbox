import type { Metadata } from 'next';
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
  const dict = getDictionary(params.lang as Locale);
  return {
    title: `${dict.site.name} — ${dict.home.h1line1} ${dict.home.h1line2}`,
    description: dict.home.subheading,
    openGraph: {
      title: `${dict.site.name} — ${dict.home.h1line1} ${dict.home.h1line2}`,
      description: dict.home.subheading,
    },
    alternates: {
      languages: {
        en: '/en',
        fr: '/fr',
      },
    },
  };
}

const toolSlugs = ['image-compressor', 'qr-code', 'pdf-converter', 'image-converter', 'image-resizer', 'password-generator'] as const;

function getToolIcon(slug: (typeof toolSlugs)[number]) {
  if (slug === 'image-compressor') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    );
  }
  if (slug === 'qr-code') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3" />
      </svg>
    );
  }
  if (slug === 'pdf-converter') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h4" />
      </svg>
    );
  }
  if (slug === 'image-converter') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
        <path d="m16 3 3 3-3 3" />
        <path d="M5 6h14" />
        <path d="m8 21-3-3 3-3" />
        <path d="M19 18H5" />
      </svg>
    );
  }
  if (slug === 'image-resizer') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 3h6v6" />
        <path d="M9 21H3v-6" />
        <path d="M21 3l-7 7" />
        <path d="M3 21l7-7" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function HomePage({ params }: { params: { lang: string } }) {
  if (!isValidLocale(params.lang)) notFound();

  const lang = params.lang as Locale;
  const dict = getDictionary(lang);
  const home = dict.home;
  const toolKeys = dict.tools;

  const tools = [
    { slug: 'image-compressor', ...toolKeys.imageCompressor },
    { slug: 'qr-code', ...toolKeys.qrCode },
    { slug: 'pdf-converter', ...toolKeys.pdfTool },
    { slug: 'image-converter', ...toolKeys.imageConverter },
    { slug: 'image-resizer', ...toolKeys.imageResizer },
    { slug: 'password-generator', ...toolKeys.passwordGenerator },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6">
          <section className="pt-24 pb-16">
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-6">
              {home.badge}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight mb-5">
              {home.h1line1}
              <br />
              <span className="text-neutral-400">{home.h1line2}</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-xl">{home.subheading}</p>
          </section>

          <div className="pb-10 overflow-x-auto flex justify-center">
            <AdSlot size="leaderboard" />
          </div>

          <section className="pb-20">
            <div className="grid sm:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.slug}
                  className="border border-neutral-800 p-6 flex flex-col gap-4 hover:border-neutral-600 transition-colors"
                >
                  <div className="text-neutral-400">{getToolIcon(tool.slug as (typeof toolSlugs)[number])}</div>
                  <div className="flex-1">
                    <h2 className="font-semibold mb-2">{tool.name}</h2>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {tool.cardDescription}
                    </p>
                  </div>
                  <Link
                    href={`/${lang}/tools/${tool.slug}`}
                    className="text-sm text-white border border-neutral-700 px-3 py-2 text-center hover:bg-white hover:text-black transition-colors"
                  >
                    {home.openTool}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <div className="pb-10 flex justify-center">
            <AdSlot size="rectangle" />
          </div>

          <section className="pb-24 border-t border-neutral-800 pt-16">
            <h2 className="text-xl font-semibold mb-10">{home.why.heading}</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {home.why.features.map((f) => (
                <div key={f.title}>
                  <h3 className="font-medium mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer lang={lang} copyright={dict.footer.copyright} />
    </div>
  );
}
