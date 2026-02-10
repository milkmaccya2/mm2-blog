import type { SatoriOptions } from 'satori';

export function getOgImage(title: string, pubDate: string, siteName: string) {
  return {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a2e',
        padding: '60px',
        fontFamily: 'Noto Sans JP',
      },
      children: [
        // Title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: 1,
              alignItems: 'center',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  color: '#ffffff',
                  fontSize: 52,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                },
                children: title,
              },
            },
          },
        },
        // Divider
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              borderTop: '1px solid #444466',
              marginBottom: '24px',
            },
            children: null,
          },
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
            children: [
              // Date
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    color: '#9999bb',
                    fontSize: 24,
                  },
                  children: pubDate,
                },
              },
              // Site name
              {
                type: 'div',
                props: {
                  style: {
                    color: '#9999bb',
                    fontSize: 24,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  },
                  children: siteName,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export async function loadGoogleFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await fetch(url).then((res) => res.text());

  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)/);
  if (!match?.[1]) {
    throw new Error(`Failed to load font: ${family} ${weight}`);
  }

  return fetch(match[1]).then((res) => res.arrayBuffer());
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
