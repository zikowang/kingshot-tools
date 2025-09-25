/** @format */

import type { Event } from "@/types/events";
import { gems, governorStamina, mythicGeneralHeroShard } from "../items";

// Not accurate since it's like every 6 weeks or so
export const buccaneerBounty: Event = {
    id: "buccaneer-bounty",
    name: "Buccaneer Bounty",
    shortName: "Buccaneer Bounty",
    image: "/img/100x100/events/kingshot-buccaneer-bounty-event-icon.png",
    color: "grey",
    days: [10, 11, 12, 13, 14, 15, 16],
    rewards: [gems, mythicGeneralHeroShard, governorStamina],
    todo: [
        "Hunt Beasts",
        "Hunt Terrors",
        "Daily Login",
        "Use Epic Recruitment",
        "Finish Intel Missions",
        "Raise Power through Troops",
        "Use Speedups",
    ],
};
