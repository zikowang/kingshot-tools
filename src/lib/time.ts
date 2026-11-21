/** @format */

const pad = (n: number) => String(n).padStart(2, "0");

/** Format a real Date as HH:MM:SS in UTC. Fixed format, same in every locale. */
export function formatUtcTime(date: Date) {
    return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

/**
 * Legacy helper: shift a Date so its *local* wall clock reads UTC.
 * Prefer real Dates + `formatUtcTime` / `getUTC*` methods for new code.
 */
export function getUTC(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}
