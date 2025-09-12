/** @format */

import type { Event } from "@/types/events";
import {
    artisansVision,
    charmDesign,
    charmGuide,
    forgeHammer,
    mithril,
    mythicGeneralHeroShard,
    widget,
} from "../items";

export const champagneFair: Event = {
    id: "champagne-fair",
    name: "Champagne Fair",
    shortName: "Champagne Fair",
    image: "/img/100x100/events/kingshot-champagne-fair-event-icon.png",
    color: "#e48423",
    days: [1, 2],
    rewards: [
        widget,
        mithril,
        forgeHammer,
        mythicGeneralHeroShard,
        artisansVision,
        charmDesign,
        charmGuide,
    ],
    optionalTodo: ["Exchange Hero Shards", "Exchange Hero Skill Books"],
};
