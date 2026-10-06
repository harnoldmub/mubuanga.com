import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    // A closed palette, from the brief. Gold is the only accent and stays
    // rare; Congo green and night blue exist for depth, never for text.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ink: {
        DEFAULT: "#050505",
        raised: "#0A0C10",
        line: "rgba(244,241,234,0.12)",
        soft: "rgba(244,241,234,0.06)",
      },
      night: { DEFAULT: "#07111F", deep: "#040A13" },
      paper: {
        DEFAULT: "#F4F1EA",
        line: "rgba(5,5,5,0.14)",
        soft: "rgba(5,5,5,0.05)",
      },
      grey: "#9C9C9C",
      gold: { DEFAULT: "#C6A15B", soft: "rgba(198,161,91,0.14)" },
      congo: "#1F6B4E",
    },
    borderRadius: { none: "0", sm: "2px", DEFAULT: "4px", full: "9999px" },
    fontFamily: {
      display: ["var(--font-sans)", "system-ui", "sans-serif"],
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-sans)", "system-ui", "sans-serif"],
    },
    extend: {
      fontSize: {
        // fluid editorial scale — every heading on the site comes from here
        mega: ["clamp(3rem, 9.2vw, 9.75rem)", { lineHeight: "0.9", letterSpacing: "-0.045em" }],
        display: ["clamp(2.5rem, 6.2vw, 6rem)", { lineHeight: "0.94", letterSpacing: "-0.04em" }],
        title: ["clamp(2rem, 4.2vw, 3.75rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        heading: ["clamp(1.375rem, 2.2vw, 2rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        lead: ["clamp(1.02rem, 1.35vw, 1.28rem)", { lineHeight: "1.62", letterSpacing: "-0.01em" }],
        meta: ["0.8125rem", { lineHeight: "1.35", letterSpacing: "0" }],
      },
      spacing: {
        gutter: "clamp(1.25rem, 4.2vw, 4.5rem)",
        section: "clamp(5.5rem, 11vw, 11rem)",
      },
      maxWidth: { shell: "1680px", measure: "62ch" },
      transitionTimingFunction: { expo: "cubic-bezier(0.16, 1, 0.3, 1)" },
    },
  },
  plugins: [],
};
export default config;
