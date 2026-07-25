import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14181F",
        surface: "#1C222C",
        "border-hairline": "#2A313D",
        ivory: "#F3F1EC",
        muted: "#9AA3B2",
        "muted-dim": "#5b6472",
        accent: {
          DEFAULT: "#E8A33D",
          hover: "#f0b45c",
        },
        status: {
          new: "#E8A33D",
          contacted: "#4FB6A8",
          closed: "#6FCF97",
        },
        error: {
          bg: "#2a1a1a",
          border: "#4a2b2b",
          text: "#f0a3a3",
        },
      },
      fontFamily: {
        // These CSS vars are set on <html> in app/layout.tsx via next/font's
        // `variable` option (Space Grotesk → --font-display, Inter → --font-body)
        display: ["var(--font-display)", "ui-sans-serif", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
