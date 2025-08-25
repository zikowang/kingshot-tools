/** @format */

import type { Cost } from "@/types/resource";
import type { Tier } from "@/types/tier";

const archerCost: Record<Tier, Cost> = {
    t1: {
        bread: 23,
        wood: 34,
        stone: 6,
        iron: 2,
    },
    t2: {
        bread: 36,
        wood: 54,
        stone: 9,
        iron: 4,
    },
    t3: {
        bread: 58,
        wood: 86,
        stone: 15,
        iron: 5,
    },
    t4: {
        bread: 75,
        wood: 111,
        stone: 19,
        iron: 6,
    },
    t5: {
        bread: 97,
        wood: 144,
        stone: 24,
        iron: 8,
    },
    t6: {
        bread: 117,
        wood: 173,
        stone: 29,
        iron: 10,
    },
    t7: {
        bread: 175,
        wood: 258,
        stone: 44,
        iron: 14,
    },
    t8: {
        bread: 349,
        wood: 516,
        stone: 87,
        iron: 28,
    },
    t9: {
        bread: 872,
        wood: 1290,
        stone: 217,
        iron: 70,
    },
    t10: {
        bread: 1740,
        wood: 2579,
        stone: 433,
        iron: 140,
    },
    t11: {
        bread: 5000,
        wood: 4000,
        stone: 900,
        iron: 250,
    },
    tg1: {
        bread: 1740,
        wood: 2579,
        stone: 433,
        iron: 140,
    },
    tg2: {
        bread: 1740,
        wood: 2579,
        stone: 433,
        iron: 140,
    },
    tg3: {
        bread: 1740,
        wood: 2579,
        stone: 433,
        iron: 140,
    },
    tg4: {
        bread: 1740,
        wood: 2579,
        stone: 433,
        iron: 140,
    },
    tg5: {
        bread: 1740,
        wood: 2579,
        stone: 433,
        iron: 140,
    },
};

export default archerCost;
