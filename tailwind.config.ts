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
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        overlayIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        blink: "blink 4s infinite",
        bob: "bob 1.6s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
        overlayIn: "overlayIn 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
