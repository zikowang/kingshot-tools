/** @format */

import { describe, expect, it } from "vitest";
import { getInitialFormValues, toSearchParams } from "./formParams";

const defaults = { a: "0", tiers: [] as string[], name: "" };

describe("getInitialFormValues", () => {
    it("uses preset when no params", () => {
        const result = getInitialFormValues(defaults, "", () => ({ ...defaults, a: "5" }));
        expect(result).toEqual({ values: { ...defaults, a: "5" }, presetLoaded: true });
    });

    it("URL params win and split arrays", () => {
        const result = getInitialFormValues(defaults, "?a=3&tiers=t9,t10&junk=1", () => null);
        expect(result).toEqual({
            values: { a: "3", tiers: ["t9", "t10"], name: "" },
            presetLoaded: false,
        });
    });
});

describe("toSearchParams", () => {
    it("skips empty and zero values", () => {
        expect(toSearchParams({ a: "0", tiers: ["t1", "t2"], name: "" }).toString()).toBe(
            "tiers=t1%2Ct2"
        );
    });
});
