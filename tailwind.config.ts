import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#d9c7f0",
        screen: "#9fce6b",
        screendark: "#3d5c33",
      },
      fontFamily: {
        pixel: ["'Courier New'", "ui-monospace", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        blink: "blink 4s infinite",
        bob: "bob 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
