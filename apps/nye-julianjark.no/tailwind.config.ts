import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        body: ["18px", "1.4"],
        "body-lg": "1.6vw",

        lead: ["26px", "1.4"],
        "lead-lg": "2.5vw",

        h1: [
          "42px",
          {
            lineHeight: "1.2",
            fontWeight: "500",
          },
        ],
        "h1-lg": "4.5vw",

        h2: ["26px", "1.3"],
        "h2-lg": "2.5vw",

        h3: [
          "18px",
          {
            lineHeight: "1.4",
            fontWeight: "700",
          },
        ],
        "h3-lg": "1.6vw",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      {
        mytheme: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#FFB4B4",
          secondary: "#E3673A",
        },
      },
    ],
  },
} satisfies Config;
