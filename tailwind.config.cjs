/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    'blue': '#4577CA',
                    'red': '#814B5E',
                    'green': '#136577',
                    'lavender': '#DBE3F5',
                    'lightgrey': '#878C9C',
                    'grey': '#363844',
                }
            }
        },
        fontFamily: {
            lexend: ['Lexend', 'sans-serif'],
            kalam: ['Kalam', 'cursive']
        },
    },
    plugins: [],
}
