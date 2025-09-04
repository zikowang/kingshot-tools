/** @format */

import type { Event } from "@/types/events";
import { resources, speedups, truegold } from "../items";

export const goldenGlaives: Event = {
    id: "golden-glaives",
    name: "Golden Glaives",
    shortName: "Golden Glaives",
    image: "/img/100x100/events/kingshot-golden-glaives-event-icon.png",
    color: "#e48423",
    days: [8, 9, 21, 22],
    rewards: [truegold, speedups, resources],
    todo: ["Finish Intel Missions", "Defeat Golden Glaives"],
};
