export function generateRandomId(length = 16) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}
