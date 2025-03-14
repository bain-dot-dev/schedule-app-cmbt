import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        zircon: {
          "50": "#f9fbff", // base colour
          "100": "#dbe6fe",
          "200": "#bfd4fe",
          "300": "#93bafd",
          "400": "#6095fa",
          "500": "#3b6ff6",
          "600": "#254eeb",
          "700": "#1d3bd8",
          "800": "#1e31af",
          "900": "#1e2f8a",
          "950": "#171f54",
        },
        "link-water": {
          "50": "#f5f7f9",
          "100": "#e8ecf1",
          "200": "#d7dee7", // base colour
          "300": "#bac7d6",
          "400": "#99abc1",
          "500": "#8093b1",
          "600": "#6e7ea2",
          "700": "#626f93",
          "800": "#545d79",
          "900": "#464d62",
          "950": "#2e313d",
        },
        masala: {
          "50": "#f6f6f6",
          "100": "#e7e7e7",
          "200": "#d1d1d1",
          "300": "#b0b0b0",
          "400": "#888888",
          "500": "#6d6d6d",
          "600": "#5d5d5d",
          "700": "#4f4f4f",
          "800": "#454545",
          "900": "#404040", // base colour
          "950": "#262626",
        },
        "royal-blue": {
          "50": "#edf4ff",
          "100": "#dfeaff",
          "200": "#c5d8ff",
          "300": "#a2bdff",
          "400": "#7d98fc",
          "500": "#536af5", // base colour
          "600": "#414cea",
          "700": "#333acf",
          "800": "#2c33a7",
          "900": "#2b3384",
          "950": "#191b4d",
        },
        "rock-blue": {
          "50": "#f4f7f9",
          "100": "#ecf0f3",
          "200": "#dce4e9",
          "300": "#c6d2db",
          "400": "#aebccb",
          "500": "#94a3b8", // base colour
          "600": "#828fa9",
          "700": "#6f7a93",
          "800": "#5c6677",
          "900": "#4d5462",
          "950": "#2d3139",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
