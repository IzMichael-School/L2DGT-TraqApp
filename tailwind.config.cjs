/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    'blue': '#4577CA',
                    'paleblue': '#84AECD',
                    'red': '#814B5E',
                    'green': '#136577',
                    'lavender': '#DBE3F5',
                    'lightgrey': '#878C9C',
                    'grey': '#363844',
                }
            },
            boxShadow: {
                'elevate': '0 0 20px 10px rgb(0, 0, 0, 0.15)',
                'elevate-sm': '0 0 10px 5px rgb(0, 0, 0, 0.15)'
            },
            height: {
                'screen': '100dvh'
            }
        },
        fontFamily: {
            lexend: ['Lexend', 'sans-serif'],
            kalam: ['Kalam', 'cursive']
        },
    },
    plugins: [],
}
