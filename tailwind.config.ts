import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgba(10, 14, 31, 0.72)",
        outline: "rgba(255, 255, 255, 0.12)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(92, 225, 230, 0.15), 0 18px 70px rgba(20, 184, 166, 0.18)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 30%), radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.12), transparent 25%), linear-gradient(180deg, #050816 0%, #080d1f 45%, #03050d 100%)",
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        pulseline: "pulseline 2.2s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseline: {
          "0%, 100%": { opacity: "0.45", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "0% 50%" },
          to: { backgroundPosition: "200% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

