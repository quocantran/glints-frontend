export function formatNumberToMillions(number: number): string {
  return parseInt(number / 1000000 + "") + "";
}
