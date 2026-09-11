// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  // Ye line Tailwind ko batati hai ki CSS kahan-kahan apply karni hai
  content: [
    "./index.html",
    "./src/assets/index.css",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Yahan humne tumhare theme.js wale saare colors Tailwind mein add kar diye hain
      colors: {
        brand: {
          page: "rgb(var(--brand-page-rgb) / <alpha-value>)",
          sidebar: "rgb(var(--brand-sidebar-rgb) / <alpha-value>)",
          card: "rgb(var(--brand-card-rgb) / <alpha-value>)",
          cardHover: "rgb(var(--brand-card-hover-rgb) / <alpha-value>)",
          accent: "rgb(var(--brand-accent-rgb) / <alpha-value>)",
          accentDim: "rgb(var(--brand-accent-rgb) / 0.12)",
          textPrimary: "rgb(var(--brand-text-primary-rgb) / <alpha-value>)",
          textSecondary: "rgb(var(--brand-text-secondary-rgb) / <alpha-value>)",
          muted: "rgb(var(--brand-text-muted-rgb) / 0.45)",
          textDark: "rgb(var(--brand-text-dark-rgb) / <alpha-value>)",
          border: "rgb(var(--brand-border-rgb) / 0.07)",
          topbar: "rgb(var(--brand-topbar-rgb) / <alpha-value>)",
        }
      }
    },
  },
  plugins: [],
};
