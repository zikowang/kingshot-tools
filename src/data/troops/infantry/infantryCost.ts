/** @format */

import type { Cost } from "@/types/resource";
import type { Tier } from "@/types/tier";

const infantryCost: Record<Tier, Cost> = {
    t1: {
        bread: 36,
        wood: 27,
        stone: 7,
        iron: 2,
    },
    t2: {
        bread: 58,
        wood: 44,
        stone: 10,
        iron: 3,
    },
    t3: {
        bread: 92,
        wood: 69,
        stone: 17,
        iron: 4,
    },
    t4: {
        bread: 120,
        wood: 90,
        stone: 21,
        iron: 5,
    },
    t5: {
        bread: 156,
        wood: 117,
        stone: 27,
        iron: 6,
    },
    t6: {
        bread: 186,
        wood: 140,
        stone: 33,
        iron: 7,
    },
    t7: {
        bread: 279,
        wood: 210,
        stone: 49,
        iron: 11,
    },
    t8: {
        bread: 558,
        wood: 419,
        stone: 98,
        iron: 21,
    },
    t9: {
        bread: 1394,
        wood: 1046,
        stone: 244,
        iron: 51,
    },
    t10: {
        bread: 2788,
        wood: 2091,
        stone: 488,
        iron: 102,
    },
    t11: {
        bread: 5000,
        wood: 4000,
        stone: 900,
        iron: 250,
    },
    tg1: {
        bread: 2788,
        wood: 2091,
        stone: 488,
        iron: 102,
    },
    tg2: {
        bread: 2788,
        wood: 2091,
        stone: 488,
        iron: 102,
    },
    tg3: {
        bread: 2788,
        wood: 2091,
        stone: 488,
        iron: 102,
    },
    tg4: {
        bread: 2788,
        wood: 2091,
        stone: 488,
        iron: 102,
    },
    tg5: {
        bread: 2788,
        wood: 2091,
        stone: 488,
        iron: 102,
    },
};

export default infantryCost;
