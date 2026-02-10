import React from 'react';
import type { SatoriOptions } from 'satori';

export function getOgImage(title: string, pubDate: string, siteName: string) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a2e',
        padding: '60px',
        fontFamily: 'Noto Sans JP',
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.4,
            wordBreak: 'break-word',
          }}
        >
          {title}
        </div>
      </div>
      {/* Divider */}
      <div
        style={{
          display: 'flex',
          borderTop: '1px solid #444466',
          marginBottom: '24px',
        }}
      />
      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Date */}
        <div
          style={{
            display: 'flex',
            color: '#9999bb',
            fontSize: 24,
          }}
        >
          {pubDate}
        </div>
        {/* Site name */}
        <div
          style={{
            color: '#9999bb',
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {siteName}
        </div>
      </div>
    </div>
  );
}

export async function loadGoogleFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await fetch(url).then((res) => res.text());

  const match = css.match(/src:\s*url\((['"]?)(.+?)\1\)\s*format\((['"]?)(.+?)\3\)/);
  if (!match?.[2]) {
    throw new Error(`Failed to load font: ${family} ${weight}`);
  }

  return fetch(match[2]).then((res) => res.arrayBuffer());
}

export function getSatoriOptions(fonts: {
  regular: ArrayBuffer;
  bold: ArrayBuffer;
}): SatoriOptions {
  return {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Noto Sans JP',
        data: fonts.regular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Noto Sans JP',
        data: fonts.bold,
        weight: 700,
        style: 'normal',
      },
    ],
  };
}
