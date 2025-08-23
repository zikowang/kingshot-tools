/** @format */

import { buildTime, tier, tierHogPoints, tierKvKPoints, tierSGPoints } from "../sharedTroops";
import archerCost from "./archerCost";

const archerTrain = tier.map((elem) => ({
    tier: elem,
    buildTime: buildTime[elem],
    cost: archerCost[elem],
    points: {
        hog: tierHogPoints[elem],
        kvk: tierKvKPoints[elem],
        sg: tierSGPoints[elem],
    },
}));

export default archerTrain;
