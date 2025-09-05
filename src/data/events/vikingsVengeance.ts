/** @format */

import type { Event } from "@/types/events";
import { gildedThread, satin } from "../items";

export const vikingsVengeance: Event = {
    id: "vikings-vengeance",
    name: "Viking's Vengeance",
    shortName: "Vikings",
    image: "/img/100x100/events/kingshot-vikings-vengeance-event-icon.png",
    color: "#6bb049",
    days: [9, 10, 11, 23, 24, 25],
    rewards: [gildedThread, satin],
    optionalTodo: ["Reinforce Alliance Members", "Reinforce your HQ"],
};
