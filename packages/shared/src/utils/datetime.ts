export function getExpiresAt(secondsFromNow: number): number {
  const now = Math.floor(Date.now() / 1000);
  return now + secondsFromNow;
}
