'use client';

import Script from 'next/script';

export function GoogleAnalytics() {
  return (
    <>
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-BPRQ0B5ZF0" 
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-BPRQ0B5ZF0');
        `}
      </Script>
    </>
  );
}
