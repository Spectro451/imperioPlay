import type { Config } from 'tailwindcss'

export default {
  darkMode: 'media',
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          hard: 'var(--bg-hard)',
          base: 'var(--bg-base)',
          soft: 'var(--bg-soft)',
          card: 'var(--bg-card)',
        },
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        'acento-1': 'var(--acento-1)',
        'acento-2': 'var(--acento-2)',
        'acento-3': 'var(--acento-3)',
      },
    },
  },
} satisfies Config
