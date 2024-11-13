/**
 *
 * @param text
 * @param length
 */
export function parseArrayString(text?: string, length?: number) {
  if (!text) {
    return { array: [], empty: true, valid: false };
  }

  text = text.trim();

  if (text === "") {
    return { array: [], empty: true, valid: false };
  }

  const parts = text.split(",");

  if (length && parts.length > length) {
    return { array: [], empty: false, valid: false };
  }

  const numbers = parts.map(Number);

  if (numbers.some(isNaN)) {
    return { array: [], empty: false, valid: false };
  }

  return { array: numbers, empty: false, valid: true };
}
