
export function setUuidv4() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // fallback
  const rnd = (n=16)=>[...Array(n)].map(()=>Math.floor(Math.random()*16).toString(16)).join("");
  return `${rnd(8)}-${rnd(4)}-${rnd(4)}-${rnd(4)}-${rnd(12)}`;
}
