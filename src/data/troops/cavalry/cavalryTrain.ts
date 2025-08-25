/** @format */

import {
    buildTime,
    tierHogPoints,
    tierKvKPoints,
    tierList,
    tierPower,
    tierSGPoints,
} from "../sharedTroops";
import cavalryCost from "./cavalryCost";

const cavalryTrain = tierList.map((elem) => ({
    tier: elem,
    buildTime: buildTime[elem],
    cost: cavalryCost[elem],
    power: tierPower[elem],
    points: {
        hog: tierHogPoints[elem],
        kvk: tierKvKPoints[elem],
        sg: tierSGPoints[elem],
    },
}));

export default cavalryTrain;
