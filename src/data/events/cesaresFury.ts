/** @format */

import type { Event } from "@/types/events";
import { gems, mythicGeneralHeroShard, speedups } from "../items";

export const cesaresFury: Event = {
    id: "cesares-fury",
    name: "Cesare's Fury",
    shortName: "Cesare's Fury",
    image: "/img/100x100/events/kingshot-cesares-fury-event-icon.png",
    color: "#d27070",
    days: [20, 21, 22],
    rewards: [gems, mythicGeneralHeroShard, speedups],
    todo: ["Kill Cesares", "Kill Cesares Bosses"],
};
