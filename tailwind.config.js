/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        cream: {
          50: "#FFFBF0",
          100: "#FFF8E7",
          200: "#FFEFD1",
          300: "#FFE4B3",
        },
        coral: {
          400: "#FF8A8A",
          500: "#FF6B6B",
          600: "#F55252",
          700: "#E03E3E",
        },
        sky: {
          400: "#6FE0D8",
          500: "#4ECDC4",
          600: "#3DB5AD",
        },
        lemon: {
          400: "#FFEC8A",
          500: "#FFE66D",
          600: "#FFDB3F",
        },
        lilac: {
          400: "#C8A2E0",
          500: "#A882D8",
          600: "#8A64C2",
        },
        mint: {
          400: "#A8E6A8",
          500: "#7ED47E",
          600: "#5CC05C",
        },
        peach: {
          400: "#FFC9A8",
          500: "#FFA775",
          600: "#FF8A4C",
        },
        cocoa: {
          500: "#5D4E37",
          600: "#4A3E2C",
          700: "#3A3022",
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', '"Ma Shan Zheng"', "cursive"],
        handwrite: ['"Ma Shan Zheng"', '"ZCOOL KuaiLe"', "cursive"],
        sans: ['"Noto Sans SC"', '"PingFang SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        candy: "0 6px 0 rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.08)",
        "candy-sm": "0 3px 0 rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.06)",
        "candy-lg": "0 10px 0 rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.12)",
        glow: "0 0 30px rgba(255,107,107,0.35)",
        "glow-sky": "0 0 30px rgba(78,205,196,0.4)",
        "glow-lemon": "0 0 30px rgba(255,230,109,0.5)",
        soft: "0 4px 24px rgba(93,78,55,0.08)",
        card: "0 2px 12px rgba(93,78,55,0.06), 0 8px 32px rgba(93,78,55,0.06)",
      },
      borderRadius: {
        candy: "20px",
        "candy-sm": "14px",
        "candy-lg": "28px",
        bubble: "40px",
      },
      animation: {
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "rainbow": "rainbow 8s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "pop": "pop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        "sparkle": "sparkle 1.8s ease-in-out infinite",
      },
      keyframes: {
        bounceSoft: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(2deg)" },
          "66%": { transform: "translateY(-6px) rotate(-2deg)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        rainbow: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(255,107,107,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255,107,107,0.7)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        sparkle: {
          "0%,100%": { opacity: "0.4", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      backgroundImage: {
        rainbow:
          "linear-gradient(135deg, #FF6B6B 0%, #FFA775 16%, #FFE66D 32%, #7ED47E 48%, #4ECDC4 64%, #A882D8 80%, #FF6B6B 100%)",
        "rainbow-soft":
          "linear-gradient(135deg, #FFE8E8 0%, #FFF1E0 16%, #FFFBD9 32%, #E4F5E4 48%, #DFF4F2 64%, #EADCF5 80%, #FFE8E8 100%)",
        paper:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 0%, rgba(255,248,231,1) 60%)",
      },
    },
  },
  plugins: [],
};
