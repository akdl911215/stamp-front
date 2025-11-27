export function formatYmd(s: string) {
  const d = new Date(s);
  if (isNaN(+d)) return "-";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function formatYmdHm(s: string) {
  const d = new Date(s);
  if (isNaN(+d)) return "-";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${formatYmd(s)} ${hh}:${mm}`;
}