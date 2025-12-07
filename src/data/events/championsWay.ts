/** @format */

import type { Event } from "@/types/events";
import { forgeHammer, gems, mythicHeroShard, speedups } from "../items";

export const championsWay: Event = {
    id: "champions-way",
    name: "Champions Way",
    shortName: "Champions Way",
    image: "/img/100x100/events/kingshot-champions-way-event-icon.png",
    color: "#d27070",
    days: [3, 4, 5, 17, 18, 19],
    rewards: [mythicHeroShard, forgeHammer, gems, speedups],
    optionalTodo: ["Hunt Beasts", "Summon and defeat Cesare's Elite Rebels"],
};
