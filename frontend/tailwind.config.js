/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#202521',
        muted: '#727a74',
        line: '#e6e9e5',
        canvas: '#f7f8f6',
        accent: '#3d684f',
        'accent-soft': '#eaf1eb',
      },
      boxShadow: {
        panel: '0 1px 2px rgba(23, 32, 25, 0.04), 0 8px 24px rgba(23, 32, 25, 0.035)',
        modal: '0 18px 60px rgba(20, 28, 22, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
