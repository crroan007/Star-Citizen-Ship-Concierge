import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'sc-black': '#050505',
                'sc-blue': '#00f0ff',
                'sc-alert': '#ffaa00',
                'tesla-white': '#f5f5f5',
                'sc-dark': '#0b1622', // Keeping for backward compatibility if needed temporarily
            },
            fontFamily: {
                orbitron: ['var(--font-orbitron)'],
                inter: ['var(--font-inter)'], // Assuming I will add this var to layout
            },
        },
    },
    plugins: [],
};
export default config;
