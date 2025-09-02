/** @format */

import type { Event } from "@/types/events";
import { forgeHammer, gems, mythicGeneralHeroShard } from "../items";

export const allianceMobilization: Event = {
    id: "alliance-mobilization",
    name: "Alliance Mobilization",
    shortName: "Al. Mobilization",
    image: "/img/100x100/events/kingshot-alliance-mobilization-event-icon.png",
    color: "#6bb049",
    days: [15, 16, 17, 18, 19, 20],
    rewards: [gems, mythicGeneralHeroShard, forgeHammer],
    todo: ["Kill Beasts", "Kill Terrors", "Raise Power through Troops", "Gather Resources"],
    optionalTodo: ["Use Speedups", "Use Truegold", "Raise Governor Gear", "Raise Governor Charm"],
};
