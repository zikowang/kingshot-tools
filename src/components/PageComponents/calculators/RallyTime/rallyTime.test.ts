/** @format */

import { describe, expect, it } from "vitest";
import {
    createRallyStarter,
    formatCountdown,
    getClipboardText,
    getEarliestStarter,
    getHitTimeFromStartTime,
    getQuickSetHelpText,
    getRallyStartTime,
    getTimeData,
    normalizeTimePart,
    parseRallyPreset,
    setTimePart,
    withStartTimes,
} from "./rallyTime";

const HIT = new Date("2026-03-29T00:59:30.000Z"); // near EU DST switch on purpose

describe("getRallyStartTime", () => {
    it("subtracts march + 5 min rally", () => {
        const start = getRallyStartTime(HIT, { marchTimeSec: 60 });
        expect(start.toISOString()).toBe("2026-03-29T00:53:30.000Z");
    });

    it("counter starts later by offset", () => {
        const start = getRallyStartTime(HIT, {
            marchTimeSec: 60,
            counterShadow: true,
            counterRallyOffsetSec: 15,
        });
        expect(start.toISOString()).toBe("2026-03-29T00:53:45.000Z");
    });

    it("is inverse of getHitTimeFromStartTime", () => {
        const starter = { marchTimeSec: 42, counterShadow: true, counterRallyOffsetSec: 30 };
        const start = getRallyStartTime(HIT, starter);
        expect(getHitTimeFromStartTime(start, starter).getTime()).toBe(HIT.getTime());
    });
});

describe("time parts", () => {
    it("reads UTC parts", () => {
        expect(getTimeData(HIT)).toMatchObject({ hour: 0, minute: 59, second: 30 });
    });

    it("sets UTC parts without moving other parts", () => {
        const next = setTimePart(HIT, "hour", 2);
        expect(next.toISOString()).toBe("2026-03-29T02:59:30.000Z");
    });

    it.each([
        ["hour", 24, 0],
        ["hour", -1, 23],
        ["hour", NaN, 0],
        ["minute", 60, 0],
        ["minute", -1, 59],
        ["second", 75, 15],
    ] as const)("normalize %s %d -> %d", (key, input, expected) => {
        expect(normalizeTimePart(key, input)).toBe(expected);
    });
});

describe("parseRallyPreset", () => {
    it("returns null for missing, broken, or empty data", () => {
        expect(parseRallyPreset(null)).toBeNull();
        expect(parseRallyPreset("{not json")).toBeNull();
        expect(parseRallyPreset("[]")).toBeNull();
        expect(parseRallyPreset('{"a":1}')).toBeNull();
    });

    it("fills defaults and ids", () => {
        const [starter] = parseRallyPreset('[{"marchTimeSec":"-5"}]')!;
        expect(starter).toMatchObject({
            name: "Starter 1",
            marchTimeSec: 60,
            active: true,
            counterShadow: false,
            counterRallyOffsetSec: 15,
        });
        expect(starter.id).toBeTruthy();
    });
});

describe("result helpers", () => {
    const starters = withStartTimes(HIT, [
        { ...createRallyStarter(0), name: "A", marchTimeSec: 30 },
        { ...createRallyStarter(1), name: "B", marchTimeSec: 90 },
        { ...createRallyStarter(2), name: "C", marchTimeSec: 120, active: false },
        {
            ...createRallyStarter(3),
            name: "D",
            marchTimeSec: 60,
            counterShadow: true,
            counterRallyOffsetSec: 10,
        },
    ]);

    it("earliest active starter has longest march", () => {
        expect(getEarliestStarter(starters).name).toBe("B");
    });

    it("clipboard text groups rally and counter in UTC", () => {
        const text = getClipboardText({
            hitTime: getTimeData(HIT),
            selectedQuickSetMinutes: null,
            rallyStarters: starters,
        });
        expect(text).toBe(
            [
                "00:59:30 UTC - Rally Hit",
                "",
                "----RALLY----",
                "00:53:00 UTC - B",
                "00:54:00 UTC - A",
                "----COUNTER----",
                "00:53:40 UTC - D (+10s)",
            ].join("\n")
        );
    });

    it("countdown format", () => {
        expect(formatCountdown(125)).toBe("2:05");
        expect(formatCountdown(-3)).toBe("-0:03");
        expect(formatCountdown(0.2)).toBe("0:00");
    });

    it("help text lists every option", () => {
        expect(getQuickSetHelpText(["30s", "45s", "1m"])).toBe(
            "Quick set buttons add 30s, 45s, or 1m to the current time."
        );
    });
});
