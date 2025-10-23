export const theme = {
  colors: {
    bg: "#f7f8fa",
    text: "#1f2937",
    primary: "#1d4ed8",
    primaryHover: "#1e40af",
    border: "#e5e7eb",
    cardBg: "#ffffff",
    danger: "#dc2626",
    muted: "#6b7280"
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px"
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 10px rgba(0,0,0,0.08)"
  },
  spacing: (n: number) => `${n * 4}px`
} as const;
