/** @format */

import type { Event } from "@/types/events";
import { mythicGeneralHeroShard } from "../items";

export const triAllianceClash: Event = {
    id: "tri-alliance-clash",
    name: "Tri-Alliance Clash",
    shortName: "Tri-Alliance Clash",
    image: "/img/100x100/events/kingshot-tri-alliance-clash-event-icon.png",
    color: "#8b76c6",
    days: [15, 16, 17, 18, 19, 20],
    rewards: [mythicGeneralHeroShard, { name: "coming soon..." }],
    todo: ["coming soon..."],
    optionalTodo: [],
};
