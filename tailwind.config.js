/** @type {import('tailwindcss').Config} */

/** Maps a theme token (stored as "R G B" channels) to a colour that supports opacity modifiers. */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        border: token('border'),
        text: token('text'),
        muted: token('text-muted'),
        primary: {
          DEFAULT: token('primary'),
          press: token('primary-press'),
          contrast: token('primary-contrast'),
        },
        xp: token('xp'),
        streak: token('streak'),
        ai: token('ai'),
        success: token('success'),
        danger: token('danger'),
        info: token('info'),
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      borderRadius: {
        input: '10px',
        btn: '12px',
        card: '16px',
        modal: '20px',
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        press: '0 4px 0 0 var(--press-color)',
        modal: '0 24px 64px -16px rgb(0 0 0 / 0.45)',
        glow: '0 0 0 1px rgb(var(--c-primary) / 0.25), 0 12px 40px -12px rgb(var(--c-primary) / 0.45)',
        mock: '0 30px 60px -24px rgb(0 0 0 / 0.5)',
      },
      transitionDuration: {
        hover: '150ms',
        panel: '250ms',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-back': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(540deg)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'fade-up': 'fade-up 250ms ease-out both',
        'slide-in': 'slide-in 250ms ease-out both',
        'slide-in-back': 'slide-in-back 250ms ease-out both',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
