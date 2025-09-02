/** @format */

import type { Event } from "@/types/events";
import { forgeHammer, gems, speedups, truegold } from "../items";

export const mysticDivination: Event = {
    id: "mystic-divination",
    name: "Mystic Divination",
    shortName: "Mystic Divination",
    image: "/img/100x100/events/kingshot-mystic-divination-event-icon.png",
    color: "#8b76c6",
    days: [19, 20],
    rewards: [gems, truegold, forgeHammer, speedups],
    todo: ["Play the luck event"],
};
