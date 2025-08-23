/** @format */

import { buildTime, tier, tierHogPoints, tierKvKPoints, tierSGPoints } from "../sharedTroops";
import cavalryCost from "./cavalryCost";

const cavalryTrain = tier.map((elem) => ({
    tier: elem,
    buildTime: buildTime[elem],
    cost: cavalryCost[elem],
    points: {
        hog: tierHogPoints[elem],
        kvk: tierKvKPoints[elem],
        sg: tierSGPoints[elem],
    },
}));

export default cavalryTrain;
