/** @format */

import type { Event } from "@/types/events";
import { gems, governorStamina, resources } from "../items";

export const desertTrial: Event = {
    id: "desert-trial",
    name: "Desert Trial",
    shortName: "Desert Trial",
    image: "/img/100x100/events/kingshot-desert-trial-event-icon.png",
    color: "#528ec7",
    days: [3, 4, 5, 17, 18, 19],
    rewards: [gems, governorStamina, resources],
    todo: ["Hunt Beasts to get Claws", "Summon and Kill Wolves"],
};
