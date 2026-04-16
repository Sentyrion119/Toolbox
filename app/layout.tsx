import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'QuickTools — Free Online Tools',
    template: '%s | QuickTools',
  },
  description:
    'Free online tools for images, PDFs, and QR codes. All processing happens in your browser — your files never leave your device.',
  metadataBase: new URL('https://quicktools.vercel.app'),
  openGraph: { siteName: 'QuickTools', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') ?? '/en';
  const lang = pathname.startsWith('/fr') ? 'fr' : 'en';

  return (
    <html lang={lang} className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <>
            <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID} />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
