/** @format */

import type { Event } from "@/types/events";
import {
    artisansVision,
    charmDesign,
    charmGuide,
    forgeHammer,
    gems,
    mythicGeneralHeroShard,
    speedups,
} from "../items";

export const swordlandShowdown: Event = {
    id: "swordland-showdown",
    name: "Swordland Showdown",
    shortName: "Swordland",
    image: "/img/100x100/events/kingshot-swordland-showdown-event-icon.png",
    color: "#8b76c6",
    days: [1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 21],
    rewards: [
        gems,
        mythicGeneralHeroShard,
        forgeHammer,
        artisansVision,
        charmDesign,
        charmGuide,
        speedups,
    ],
    todo: ["Register", "Participate"],
};
