import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                bg: 'var(--bg)',
                surface: 'var(--surface)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'accent-1': 'var(--accent-1)',
                'accent-2': 'var(--accent-2)',
                border: 'var(--border)',
            },
            boxShadow: {
                'brutal-btn': '6px 6px 0px 0px var(--text-primary)',
                'brutal-btn-hover': '8px 8px 0px 0px var(--text-primary)',
                'brutal-btn-active': '4px 4px 0px 0px var(--text-primary)',
                'brutal-card': '8px 8px 0px 0px var(--text-primary)',
                'brutal-card-hover': '12px 12px 0px 0px var(--text-primary)',
                // Keeping generic for other uses if needed, or mapping to btn/card
                'brutal': '10px 10px 0px 0px var(--text-primary)',
                'brutal-hover': '12px 12px 0px 0px var(--text-primary)',
            },
            borderWidth: {
                DEFAULT: '3px',
                '3': '3px',
            },
            borderRadius: {
                DEFAULT: '0px',
                'none': '0px',
                'sm': '4px', // Only for inputs/badges if really needed
            },
            fontFamily: {
                sans: ['Inter', 'Work Sans', 'sans-serif'],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            }
        },
    },
    plugins: [
        typography,
    ],
}
