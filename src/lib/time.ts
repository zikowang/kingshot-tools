/** @format */

const utcTimeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
});

/** Format a real Date as HH:MM:SS in UTC. */
export function formatUtcTime(date: Date) {
    return utcTimeFormatter.format(date);
}

/**
 * Legacy helper: shift a Date so its *local* wall clock reads UTC.
 * Prefer real Dates + `formatUtcTime` / `getUTC*` methods for new code.
 */
export function getUTC(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}
