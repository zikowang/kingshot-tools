/** @format */

import { buildTime, tier, tierHogPoints, tierKvKPoints, tierSGPoints } from "../sharedTroops";
import infantryCost from "./infantryCost";

const infantryTrain = tier.map((elem) => ({
    tier: elem,
    buildTime: buildTime[elem],
    cost: infantryCost[elem],
    points: {
        hog: tierHogPoints[elem],
        kvk: tierKvKPoints[elem],
        sg: tierSGPoints[elem],
    },
}));

export default infantryTrain;
