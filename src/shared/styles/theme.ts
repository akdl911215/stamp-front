export const theme = {
  colors: {
    bg: "#f7f8fa",
    text: "#1f2937",
    primary: "#1d4ed8",
    primaryHover: "#1e40af",
    border: "#e5e7eb",
    cardBg: "#ffffff"
  },
  radius: { md: "10px" },
  spacing: (n: number) => `${n * 4}px`
} as const;
