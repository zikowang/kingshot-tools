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

/** Wrap user input into a valid value for one clock part. */
export function normalizeTimePart(key: TimePart, value: number) {
    const max = key === "hour" ? 23 : 59;

    if (isNaN(value)) return 0;
    if (value < 0) return max;
    if (key === "hour") return value > max ? 0 : value;

    return value % 60;
}

export function setTimePart(date: Date, key: TimePart, value: number) {
    const next = new Date(date);

    if (key === "hour") next.setUTCHours(value);
    if (key === "minute") next.setUTCMinutes(value);
    if (key === "second") next.setUTCSeconds(value);

    return next;
}

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
