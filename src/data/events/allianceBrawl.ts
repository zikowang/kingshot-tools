/** @format */

import type { Event } from "@/types/events";
import { gems, mythicGeneralHeroShard, resources, speedups, truegold } from "../items";

export const allianceBrawl: Event = {
    id: "alliance-brawl",
    name: "Alliance Brawl",
    shortName: "Al. Brawl",
    image: "/img/100x100/events/kingshot-alliance-brawl-event-icon.png",
    color: "#6bb049",
    days: [1, 2, 3, 4, 5, 6, 7],
    rewards: [gems, truegold, mythicGeneralHeroShard, speedups, resources],
};
