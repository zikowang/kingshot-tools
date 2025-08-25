/** @format */

import {
    buildTime,
    tierHogPoints,
    tierKvKPoints,
    tierList,
    tierPower,
    tierSGPoints,
} from "../sharedTroops";
import archerCost from "./archerCost";

const archerTrain = tierList.map((elem) => ({
    tier: elem,
    buildTime: buildTime[elem],
    cost: archerCost[elem],
    power: tierPower[elem],
    points: {
        hog: tierHogPoints[elem],
        kvk: tierKvKPoints[elem],
        sg: tierSGPoints[elem],
    },
}));

export default archerTrain;
