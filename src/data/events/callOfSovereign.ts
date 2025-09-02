/** @format */

import type { Event } from "@/types/events";
import {
    artisansVision,
    charmDesign,
    charmGuide,
    gems,
    gildedThread,
    governorStamina,
    mythicGeneralHeroShard,
    satin,
} from "../items";

export const callOfSovereign: Event = {
    id: "call-of-the-sovereign",
    name: "Call of the Sovereign",
    shortName: "Call of the Sovereign",
    image: "/img/100x100/events/kingshot-sovereign-event-icon.png",
    color: "#528ec7",
    days: [16, 17, 18],
    rewards: [
        gems,
        mythicGeneralHeroShard,
        governorStamina,
        gildedThread,
        satin,
        artisansVision,
        charmDesign,
        charmGuide,
    ],
    todo: [
        "Hunt Beasts",
        "Hunt Terrors",
        "Daily Login",
        "Gather Resources",
        "Raise Power through Troops",
    ],
    optionalTodo: ["Make Purchases"],
};
