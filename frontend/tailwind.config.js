/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "hsl(var(--secondary-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)"
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"]
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        blink: { "0%, 45%": { opacity: "1" }, "46%, 100%": { opacity: "0" } },
        "pulse-dot": { "0%, 100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: ".5", transform: "scale(.85)" } }
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        blink: "blink 1s steps(2, start) infinite",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite"
      },
      boxShadow: { glow: "0 0 35px -10px rgba(59,130,246,.4)" }
    }
  },
  plugins: []
};
