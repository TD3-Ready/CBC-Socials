/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Charter', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#1B1A17', 2: '#5B5A55', 3: '#9C9A91' },
        paper: { DEFAULT: '#FAF8F2', 2: '#F3F1E9' },
        card: '#FFFFFF',
        line: { DEFAULT: '#E8E4D8', 2: '#D7D2C2' },
        gold: { DEFAULT: '#B8935C', ink: '#8C6A3A', soft: 'rgba(184,147,92,0.10)' },
        cat: {
          worship: '#4A6FA5',
          study: '#8B7355',
          outreach: '#6B8E6B',
          youth: '#C2774A',
          music: '#8B7AA8',
          other: '#6B6B6B',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,18,12,.04), 0 2px 6px rgba(20,18,12,.04)',
        lift: '0 4px 12px rgba(20,18,12,.06), 0 16px 40px rgba(20,18,12,.08)',
      },
      borderRadius: {
        'xl-pill': '28px',
      },
    },
  },
  plugins: [],
};
