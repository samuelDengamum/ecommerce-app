/**
 * @file layout.tsx
 * @description The Root Layout component for the Next.js App Router.
 * This file wraps all application pages with common layout elements like Navbar, Footer,
 * and configures the Redux provider (StoreProvider).
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SupportChat from "./components/SupportChat";
import QuickGuideWidget from "./components/QuickGuideWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexis",
  description: "Modern full-stack ecommerce application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <style>{`
          /* Custom styles to completely hide Google Translate native UI but keep functionality */
          .goog-te-banner-frame { display: none !important; }
          .goog-te-menu-frame { display: none !important; }
          .goog-te-gadget { display: none !important; }
          #google_translate_element { display: none !important; }
          body { top: 0 !important; position: static !important; }
          .skiptranslate { display: none !important; }
          .skiptranslate iframe { display: none !important; }
          #goog-gt-tt { display: none !important; }
          .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col pt-0 text-slate-100">
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <SupportChat />
        <QuickGuideWidget />

        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-config" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,ar,fr,es', // Key languages including Arabic
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
