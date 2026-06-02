'use client';

import Image from 'next/image';
import React from 'react';

type Props = {
  src?: string;
  alt?: string;
  className?: string;
};

const GradientFallback = React.memo(({ text }: { text: string }) => {
  const colorA = '#0ea5e9';
  const colorB = '#7c3aed';
  const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='${encodeURIComponent(colorA)}'/><stop offset='1' stop-color='${encodeURIComponent(colorB)}'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-size='120' fill='rgba(255,255,255,0.9)'>${encodeURIComponent(text)}</text></svg>`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={svg} alt={text} className="h-full w-full object-contain object-center" loading="lazy" decoding="async" />
  );
});

const ProductImageComponent = React.memo(function ProductImage({ src, alt, className }: Props) {
  if (!src) {
    const initial = (alt || 'P').charAt(0).toUpperCase();
    return <div className={`h-full w-full ${className || ''}`}><GradientFallback text={initial} /></div>;
  }

  // Use native img for external urls to avoid Next/Image domain config issues in local dev
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || 'product'} className={`h-full w-full object-contain object-center ${className || ''}`} loading="lazy" decoding="async" />
  );
});

export default ProductImageComponent;
