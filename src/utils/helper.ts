// returns the name of the month for the given date
export function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'long' });
}
