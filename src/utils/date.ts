/**
 *
 * @param dateString
 */
export function validateDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return !(
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    !isValidDay(year, month, day)
  );
}

/**
 *
 * @param year
 * @param month
 * @param day
 */
export function isValidDay(year: number, month: number, day: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}
