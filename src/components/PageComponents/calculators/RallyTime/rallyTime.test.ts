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
    getSegmentAt,
    maskTimeInput,
    parseRallyPreset,
    parseTimeInput,
    truncateName,
    resolveClockTime,
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
});

describe("time input", () => {
    it.each([
        ["1", "1"],
        ["11", "11"],
        ["112", "11:2"],
        ["11:2", "11:2"],
        ["11:23", "11:23"],
        ["11:234", "11:23:4"],
        ["11:23:30", "11:23:30"],
        ["11:23:301", "11:23:30"],
        ["112330", "11:23:30"],
        ["9:5", "9:5"],
        ["9::5", "9:5"],
        ["ab12:3x4", "12:34"],
    ])("mask %s -> %s", (raw, expected) => {
        expect(maskTimeInput(raw)).toBe(expected);
    });

    it.each([
        ["11", "11:"],
        ["11:23", "11:23:"],
        ["11:23:30", "11:23:30"],
        ["1", "1"],
        ["11:2", "11:2"],
    ])("mask while typing %s -> %s", (raw, expected) => {
        expect(maskTimeInput(raw, true)).toBe(expected);
    });

    it.each([
        ["11:23:30", { hour: 11, minute: 23, second: 30 }],
        ["9:5", { hour: 9, minute: 5, second: 0 }],
        ["112330", { hour: 11, minute: 23, second: 30 }],
        ["1123", { hour: 11, minute: 23, second: 0 }],
        ["00:00:00", { hour: 0, minute: 0, second: 0 }],
    ])("parse %s", (text, expected) => {
        expect(parseTimeInput(text)).toEqual(expected);
    });

    it.each(["", "24:00:00", "12:60", "12:00:60", "1:2:3:4", "abc", "123:4"])(
        "rejects %j",
        (text) => {
            expect(parseTimeInput(text)).toBeNull();
        }
    );

    it("resolves to today when close", () => {
        const now = new Date("2026-11-21T11:22:00Z");
        expect(resolveClockTime({ hour: 11, minute: 30, second: 0 }, now).toISOString()).toBe(
            "2026-11-21T11:30:00.000Z"
        );
    });

    it("rolls past midnight forward", () => {
        const now = new Date("2026-11-21T23:58:00Z");
        expect(resolveClockTime({ hour: 0, minute: 5, second: 0 }, now).toISOString()).toBe(
            "2026-11-22T00:05:00.000Z"
        );
    });

    it("rolls back when just after midnight", () => {
        const now = new Date("2026-11-22T00:02:00Z");
        expect(resolveClockTime({ hour: 23, minute: 59, second: 0 }, now).toISOString()).toBe(
            "2026-11-21T23:59:00.000Z"
        );
    });

    it("caret maps to segment", () => {
        expect([0, 2, 3, 5, 6, 8].map(getSegmentAt)).toEqual([
            "hour",
            "hour",
            "minute",
            "minute",
            "second",
            "second",
        ]);
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

describe("truncateName", () => {
    it("keeps names up to 16 chars", () => {
        expect(truncateName("Exactly16Chars!!")).toBe("Exactly16Chars!!");
    });

    it("cuts longer names to 16 chars with an ellipsis", () => {
        const result = truncateName("VeryLongLeaderNameXYZ");
        expect(result).toBe("VeryLongLeaderN…");
        expect([...result]).toHaveLength(16);
    });

    it("does not split emoji", () => {
        expect(truncateName("🔥".repeat(20))).toBe("🔥".repeat(15) + "…");
    });
});
