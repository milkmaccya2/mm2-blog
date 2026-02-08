/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // 'sans' を上書きして、デフォルトのフォントを指定
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"游ゴシック  Medium"',
          '"Yu Gothic Medium"',
          '"YuGothic"',
          'Meiryo',
          'sans-serif',
        ],
      },
      // 行間や字間のデフォルトを微調整したい場合
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
        normal: '0.03em', // デフォルトを少し広めに設定
        wide: '.05em',
        wider: '.1em',
        widest: '.25em',
      },
    },
  },
  plugins: [],
};
