/** @format */

import type { Event } from "@/types/events";
import {
    artisansVision,
    gems,
    mythicConquestSkillManual,
    mythicExpeditionSkillManual,
    truegold,
} from "../items";

export const armamentCompetition: Event = {
    id: "armament-competition",
    name: "Armament Competition",
    shortName: "Armament",
    image: "/img/100x100/events/kingshot-armament-competition-event-icon.png",
    color: "#528ec7",
    days: [1, 2, 5, 6, 15, 16, 19, 20],
    rewards: [
        gems,
        truegold,
        artisansVision,
        mythicExpeditionSkillManual,
        mythicConquestSkillManual,
    ],
    todo: ["Raise Governor Gear", "Use Truegold", "Use Hero Shards", "Use Speedups"],
};
