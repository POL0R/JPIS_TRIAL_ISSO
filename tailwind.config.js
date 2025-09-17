/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        limePrimary: '#D7FF4C',
        limeSecondary: '#C8FF2E',
        bgDark: '#0E3227',
        surface: '#154332',
        surfaceDeep: '#133A2B',
        accentGreen: '#1E6C4F',
        textPrimary: '#EAF7F0',
        textMuted: '#A7D2BF',
        liveRed: '#FF5A5A',
      },
      borderRadius: {
        xl2: '20px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)',
        insetGlow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        limeGrad: 'linear-gradient(135deg, #D7FF4C 0%, #C8FF2E 100%)',
        footballGrad: 'linear-gradient(135deg, #34D399 0%, #D7FF4C 100%)',
      }
    },
  },
  plugins: [],
}
