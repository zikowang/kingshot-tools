/** @format */

import type { Cost } from "@/types/resource";
import type { Tier } from "@/types/tier";

const cavalryCost: Record<Tier, Cost> = {
    t1: {
        bread: 32,
        wood: 30,
        stone: 7,
        iron: 2,
    },
    t2: {
        bread: 51,
        wood: 48,
        stone: 10,
        iron: 3,
    },
    t3: {
        bread: 81,
        wood: 76,
        stone: 16,
        iron: 4,
    },
    t4: {
        bread: 105,
        wood: 99,
        stone: 21,
        iron: 5,
    },
    t5: {
        bread: 136,
        wood: 129,
        stone: 27,
        iron: 7,
    },
    t6: {
        bread: 163,
        wood: 154,
        stone: 32,
        iron: 8,
    },
    t7: {
        bread: 244,
        wood: 2231,
        stone: 48,
        iron: 11,
    },
    t8: {
        bread: 488,
        wood: 461,
        stone: 95,
        iron: 22,
    },
    t9: {
        bread: 1220,
        wood: 1151,
        stone: 237,
        iron: 55,
    },
    t10: {
        bread: 2440,
        wood: 2301,
        stone: 474,
        iron: 109,
    },
    t11: {
        bread: 5000,
        wood: 4000,
        stone: 900,
        iron: 250,
    },
    tg1: {
        bread: 2440,
        wood: 2301,
        stone: 474,
        iron: 109,
    },
    tg2: {
        bread: 2440,
        wood: 2301,
        stone: 474,
        iron: 109,
    },
    tg3: {
        bread: 2440,
        wood: 2301,
        stone: 474,
        iron: 109,
    },
    tg4: {
        bread: 2440,
        wood: 2301,
        stone: 474,
        iron: 109,
    },
    tg5: {
        bread: 2440,
        wood: 2301,
        stone: 474,
        iron: 109,
    },
};

export default cavalryCost;
