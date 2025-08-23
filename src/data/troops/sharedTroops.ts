/** @format */

import type { TGTier, Tier } from "@/types/tier";

export const tier: Tier[] = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11"];
export const tgTier: TGTier[] = ["tg1", "tg2", "tg3", "tg4", "tg5"];

export const buildTime: Record<Tier, number> = {
    t1: 12,
    t2: 17,
    t3: 24,
    t4: 32,
    t5: 44,
    t6: 60,
    t7: 83,
    t8: 113,
    t9: 131,
    t10: 152,
    t11: 180,
};

export const tierPower: Record<Tier, number> = {
    t1: 3,
    t2: 4,
    t3: 6,
    t4: 9,
    t5: 13,
    t6: 20,
    t7: 28,
    t8: 38,
    t9: 50,
    t10: 66,
    t11: 80,
};

export const tgPower: Record<TGTier, number> = {
    tg1: 5,
    tg2: 5,
    tg3: 6,
    tg4: 6,
    tg5: 7,
};

export const tierHogPoints: Record<Tier, number> = {
    t1: 90,
    t2: 120,
    t3: 180,
    t4: 265,
    t5: 385,
    t6: 595,
    t7: 830,
    t8: 1130,
    t9: 1485,
    t10: 1960,
    t11: 2700,
};

export const tierKvKPoints: Record<Tier, number> = {
    t1: 3,
    t2: 4,
    t3: 5,
    t4: 8,
    t5: 12,
    t6: 18,
    t7: 25,
    t8: 35,
    t9: 45,
    t10: 60,
    t11: 75,
};

export const tierSGPoints: Record<Tier, number> = {
    t1: 1,
    t2: 2,
    t3: 3,
    t4: 4,
    t5: 72,
    t6: 11,
    t7: 16,
    t8: 23,
    t9: 30,
    t10: 39,
    t11: 51,
};
