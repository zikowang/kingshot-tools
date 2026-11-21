/** @format */

import { formatUtcTime } from "@/lib/time";

// Rally timer math. All Dates are real instants; read/write wall-clock parts in UTC.

export const RALLY_DURATION_MS = 5 * 60 * 1000;
export const DEFAULT_QUICK_SET_MINUTES = 7;
export const DEFAULT_COUNTER_RALLY_OFFSET_SEC = 15;
export const DEFAULT_MARCH_TIME_SEC = 60;
export const PRESET_STORAGE_KEY = "presets.rallyTime";

export type TimePart = "hour" | "minute" | "second";

export type TimeData = {
    datetime: Date;
    hour: number;
    minute: number;
    second: number;
};

export type RallyStarterResult = {
    id: string;
    name: string;
    marchTimeSec: number;
    rallyStartTime: Date;
    active: boolean;
    counterShadow?: boolean;
    counterRallyOffsetSec?: number;
};

export type RallyTimerResult = {
    hitTime: TimeData;
    selectedQuickSetMinutes: number | null;
    rallyStarters: RallyStarterResult[];
};

export const MAX_NAME_DISPLAY_LENGTH = 16;

/** Shorten long leader names for the results table ("…" counts as one char). */
export function truncateName(name: string, max = MAX_NAME_DISPLAY_LENGTH) {
    const chars = [...name]; // split by code point so emoji are not cut in half

    return chars.length > max ? `${chars.slice(0, max - 1).join("")}…` : name;
}

export function createId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createRallyStarter(index: number): RallyStarterResult {
    return {
        id: createId(),
        name: `Starter ${index + 1}`,
        marchTimeSec: DEFAULT_MARCH_TIME_SEC,
        rallyStartTime: new Date(),
        active: true,
        counterShadow: false,
        counterRallyOffsetSec: DEFAULT_COUNTER_RALLY_OFFSET_SEC,
    };
}

export function getTimeData(value: Date): TimeData {
    return {
        datetime: value,
        hour: value.getUTCHours(),
        minute: value.getUTCMinutes(),
        second: value.getUTCSeconds(),
    };
}

export function getTimeFromNow(minutesToAdd: number, now = new Date()): TimeData {
    return getTimeData(new Date(now.getTime() + minutesToAdd * 60000));
}

export type ClockTime = { hour: number; minute: number; second: number };

/**
 * Live mask while typing. Groups digits in pairs: "112330" → "11:23:30".
 * Works the same whether or not colons are already there, so it keeps
 * adding colons after hour and minute. A typed ":" ends a group early ("9:5").
 * `addTrailingColon` shows "11:" as soon as a pair is full; pass it only
 * while the text is growing, so Backspace can still remove the colon.
 */
export function maskTimeInput(raw: string, addTrailingColon = false) {
    const groups = [""];

    for (const ch of raw) {
        const current = groups[groups.length - 1];

        if (ch === ":") {
            if (current && groups.length < 3) groups.push("");
            continue;
        }

        if (!/\d/.test(ch)) continue;

        if (current.length === 2) {
            if (groups.length === 3) break;
            groups.push("");
        }

        groups[groups.length - 1] += ch;
    }

    const last = groups[groups.length - 1];
    const masked = groups.join(":");

    return addTrailingColon && groups.length < 3 && last.length === 2 ? `${masked}:` : masked;
}

/**
 * Parse "HH:MM:SS", "H:M", "HHMMSS", "HHMM", "HH". Missing parts are 0.
 * Returns null for empty or out-of-range input.
 */
export function parseTimeInput(text: string): ClockTime | null {
    const trimmed = text.trim();

    if (!trimmed) return null;

    let parts: string[];

    if (trimmed.includes(":")) {
        parts = trimmed.split(":");
        if (parts.length > 3 || parts.some((p) => !/^\d{0,2}$/.test(p))) return null;
    } else {
        if (!/^\d{1,6}$/.test(trimmed)) return null;
        parts = trimmed.padEnd(6, "0").match(/.{2}/g)!;
    }

    const [hour = 0, minute = 0, second = 0] = parts.map((p) => Number(p || 0));

    if (hour > 23 || minute > 59 || second > 59) return null;

    return { hour, minute, second };
}

/**
 * Turn a clock time into a real Date near `now` (UTC).
 * Window is now-6h … now+18h, so "00:05" typed at 23:58 means tomorrow.
 */
export function resolveClockTime(time: ClockTime, now = new Date()) {
    const candidate = new Date(now);
    candidate.setUTCHours(time.hour, time.minute, time.second, 0);

    const diff = candidate.getTime() - now.getTime();
    const hour = 3600 * 1000;

    if (diff < -6 * hour) candidate.setUTCDate(candidate.getUTCDate() + 1);
    if (diff > 18 * hour) candidate.setUTCDate(candidate.getUTCDate() - 1);

    return candidate;
}

/** Which part of "HH:MM:SS" the caret sits in. */
export function getSegmentAt(caret: number): TimePart {
    if (caret <= 2) return "hour";
    if (caret <= 5) return "minute";

    return "second";
}

export const SEGMENT_SECONDS: Record<TimePart, number> = { hour: 3600, minute: 60, second: 1 };

function getCounterOffsetMs(
    starter: Pick<RallyStarterResult, "counterShadow" | "counterRallyOffsetSec">
) {
    return starter.counterShadow
        ? (starter.counterRallyOffsetSec ?? DEFAULT_COUNTER_RALLY_OFFSET_SEC) * 1000
        : 0;
}

type TimingInput = Pick<
    RallyStarterResult,
    "marchTimeSec" | "counterShadow" | "counterRallyOffsetSec"
>;

/** When a starter must open the rally to land at `hitTime` (counters land later by offset). */
export function getRallyStartTime(hitTime: Date, starter: TimingInput) {
    return new Date(
        hitTime.getTime() -
            starter.marchTimeSec * 1000 -
            RALLY_DURATION_MS +
            getCounterOffsetMs(starter)
    );
}

/** Inverse of `getRallyStartTime`: the hit time implied by a starter's start time. */
export function getHitTimeFromStartTime(startTime: Date, starter: TimingInput) {
    return new Date(
        startTime.getTime() +
            starter.marchTimeSec * 1000 +
            RALLY_DURATION_MS -
            getCounterOffsetMs(starter)
    );
}

/** When a starter's own march arrives (ignores counter offset). */
export function getStarterArrivalTime(starter: RallyStarterResult) {
    return new Date(
        starter.rallyStartTime.getTime() + RALLY_DURATION_MS + starter.marchTimeSec * 1000
    );
}

export function withStartTimes(hitTime: Date, starters: RallyStarterResult[]) {
    return starters.map((starter) => ({
        ...starter,
        rallyStartTime: getRallyStartTime(hitTime, starter),
    }));
}

export function sortByStartTime(starters: RallyStarterResult[]) {
    return [...starters].sort(
        (left, right) => left.rallyStartTime.getTime() - right.rallyStartTime.getTime()
    );
}

export function getEarliestStarter(starters: RallyStarterResult[]) {
    return sortByStartTime(starters.filter((starter) => starter.active))[0];
}

/** Parse saved starters. Bad or missing data returns null; bad fields get defaults. */
export function parseRallyPreset(raw: string | null): RallyStarterResult[] | null {
    if (!raw) return null;

    try {
        const preset: unknown = JSON.parse(raw);

        if (!Array.isArray(preset) || preset.length === 0) return null;

        return preset.map((item: Record<string, unknown>, index) => {
            const marchTimeSec = Number(item.marchTimeSec);
            const offsetSec = Number(item.counterRallyOffsetSec);

            return {
                id: typeof item.id === "string" && item.id ? item.id : createId(),
                name:
                    typeof item.name === "string" && item.name ? item.name : `Starter ${index + 1}`,
                marchTimeSec: marchTimeSec >= 0 ? marchTimeSec : DEFAULT_MARCH_TIME_SEC,
                rallyStartTime: new Date(),
                active: typeof item.active === "boolean" ? item.active : true,
                counterShadow: typeof item.counterShadow === "boolean" ? item.counterShadow : false,
                counterRallyOffsetSec:
                    offsetSec >= 0 ? offsetSec : DEFAULT_COUNTER_RALLY_OFFSET_SEC,
            };
        });
    } catch (e) {
        console.error("Failed to load rally preset:", e);
        return null;
    }
}

const listFormat = new Intl.ListFormat("en", { type: "disjunction" });

export function getQuickSetHelpText(labels: readonly string[]) {
    return `Quick set buttons add ${listFormat.format(labels)} to the current time.`;
}

export function formatCountdown(secondsLeft: number) {
    const remainingSeconds = Math.round(Math.abs(secondsLeft));
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const prefix = secondsLeft < 0 && remainingSeconds > 0 ? "-" : "";

    return `${prefix}${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getGroupedStarters(rallyStarters: RallyStarterResult[], sortGroupsByTime = false) {
    const groups = [
        {
            title: "Rally",
            starters: rallyStarters.filter((starter) => !starter.counterShadow),
        },
        {
            title: "Counter",
            starters: rallyStarters.filter((starter) => starter.counterShadow),
        },
    ].filter((group) => group.starters.length > 0);

    if (sortGroupsByTime) {
        groups.sort(
            (left, right) =>
                left.starters[0].rallyStartTime.getTime() -
                right.starters[0].rallyStartTime.getTime()
        );
    }

    return groups;
}

export function getClipboardText(result: RallyTimerResult) {
    const activeStarters = sortByStartTime(result.rallyStarters.filter((s) => s.active));
    const rallyHitText = `${formatUtcTime(result.hitTime.datetime)} UTC - Rally Hit`;
    const groupedStarterText = getGroupedStarters(activeStarters)
        .map((group) => {
            const lines = group.starters.map(
                (starter) =>
                    `${formatUtcTime(starter.rallyStartTime)} UTC - ${starter.name}${starter.counterShadow ? ` (+${starter.counterRallyOffsetSec ?? 0}s)` : ""}`
            );

            return `----${group.title.toUpperCase()}----\n${lines.join("\n")}`;
        })
        .join("\n");

    return `${rallyHitText}\n\n${groupedStarterText}`;
}
