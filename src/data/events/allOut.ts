/** @format */

import type { Event } from "@/types/events";
import {
    gems,
    mythicConquestSkillManual,
    mythicExpeditionSkillManual,
    resources,
    speedups,
} from "../items";

export const allOut: Event = {
    id: "all-out",
    name: "All Out",
    shortName: "All Out",
    image: "/img/100x100/events/kingshot-all-out-event-icon.png",
    color: "#d27070",
    days: [12, 13],
    rewards: [gems, mythicConquestSkillManual, mythicExpeditionSkillManual, speedups, resources],
    optionalTodo: ["Defeat or Severely Injure Troops"],
};
