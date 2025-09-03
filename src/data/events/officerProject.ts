/** @format */

import type { Event } from "@/types/events";
import { charmDesign, forgeHammer, gems, mythicExpeditionSkillManual } from "../items";

export const officerProject: Event = {
    id: "officer-project",
    name: "Officer Project",
    shortName: "Officer Project",
    image: "/img/100x100/events/kingshot-officer-project-event-icon.png",
    color: "#528ec7",
    days: [3, 4, 7, 8, 17, 18, 21, 22],
    rewards: [gems, forgeHammer, charmDesign, mythicExpeditionSkillManual],
    todo: ["Raise Governor Charm", "Train Troops", "Use Forgehammer", "Use Widgets"],
};
