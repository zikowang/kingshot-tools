/** @format */

import type { Event } from "@/types/events";
import {
    gems,
    mythicConquestSkillManual,
    mythicExpeditionSkillManual,
    resources,
    speedups,
} from "../items";

export const defeatBeasts: Event = {
    id: "defeat-beasts",
    name: "Defeat Beasts",
    shortName: "Defeat Beasts",
    image: "/img/100x100/events/kingshot-defeat-beasts-event-icon.png",
    color: "#528ec7",
    days: [9, 10],
    rewards: [gems, mythicConquestSkillManual, mythicExpeditionSkillManual, speedups, resources],
    optionalTodo: ["Hunt Beasts", "Hunt Terrors"],
};
