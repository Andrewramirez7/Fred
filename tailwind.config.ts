import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#1c1c1c",
        screen: "#0f1f13",
        screendark: "#173820",
        ninja: "#39ff14",
        mist: "#d7f5df",
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
