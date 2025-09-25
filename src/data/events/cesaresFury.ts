/** @format */

import type { Event } from "@/types/events";
import { gems, mythicGeneralHeroShard, speedups } from "../items";

// Cesares seems not to be once every 4 weeks (maybe every 3 weeks?)
// 09.09.2025 - 11.09.2025
// 27.09.2025 - 29.09.2025
export const cesaresFury: Event = {
    id: "cesares-fury",
    name: "Cesare's Fury",
    shortName: "Cesare's Fury",
    image: "/img/100x100/events/kingshot-cesares-fury-event-icon.png",
    color: "#d27070",
    days: [13, 14, 15],
    rewards: [gems, mythicGeneralHeroShard, speedups],
    todo: ["Kill Cesares", "Kill Cesares Bosses"],
};
