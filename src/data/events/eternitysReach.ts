/** @format */

import type { Event } from "@/types/events";
import { charmDesign, charmGuide, gems } from "../items";

export const eternitysReach: Event = {
    id: "eternitys-reach",
    name: "Eternity's Reach",
    shortName: "Eternity's Reach",
    image: "/img/100x100/events/kingshot-eternitys-reach-event-icon.png",
    color: "#528ec7",
    days: [9, 23],
    rewards: [gems, charmGuide, charmDesign],
    optionalTodo: ["Right", "Right", "Left", "Left", "Right"],
};
