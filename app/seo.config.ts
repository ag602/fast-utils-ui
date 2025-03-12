import { Metadata } from 'next';

const defaultKeywords = [
  'utility tools',
  'online tools',
  'file converter',
  'JSON formatter',
  'video editor',
  'audio editor',
  'photo manipulation',
  'document editing',
  'developer tools',
  'free online utilities'
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://fastutils.com'),
  title: {
    default: 'FastUtils - All-in-one Utility Hub',
    template: '%s | FastUtils'
  },
  description: 'A comprehensive suite of tools for JSON formatting, video editing, audio manipulation, document editing and more. Free online utilities for developers and content creators.',
  keywords: defaultKeywords.join(', '),
  authors: [{ name: 'FastUtils Team' }],
  creator: 'FastUtils',
  publisher: 'FastUtils',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'FastUtils',
    title: 'FastUtils - All-in-one Utility Hub',
    description: 'A comprehensive suite of tools for JSON formatting, video editing, audio manipulation, document editing and more.',
    images: '/og-image.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastUtils - All-in-one Utility Hub',
    description: 'A comprehensive suite of tools for JSON formatting, video editing, audio manipulation, document editing and more.',
    images: '/og-image.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://fastutils.com',
  },
  manifest: '/site.webmanifest',
};
