/** @format */

import type { Event } from "@/types/events";
import { gems, mythicHeroShard, resources, speedups } from "../items";

export const heroRoulette: Event = {
    id: "heroRoulette",
    name: "Hero Roulette",
    shortName: "Hero Roulette",
    image: "/img/100x100/events/kingshot-hero-roulette-event-icon.png",
    color: "#e48423",
    days: [9, 10, 11, 23, 24, 25],
    rewards: [gems, mythicHeroShard, resources, speedups],
    todo: ["Spin the wheel"],
};
