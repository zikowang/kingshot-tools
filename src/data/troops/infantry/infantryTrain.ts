/** @format */

import {
    buildTime,
    tierHogPoints,
    tierKvKPoints,
    tierList,
    tierPower,
    tierSGPoints,
} from "../sharedTroops";
import infantryCost from "./infantryCost";

const infantryTrain = tierList.map((elem) => ({
    tier: elem,
    buildTime: buildTime[elem],
    cost: infantryCost[elem],
    power: tierPower[elem],
    points: {
        hog: tierHogPoints[elem],
        kvk: tierKvKPoints[elem],
        sg: tierSGPoints[elem],
    },
}));

export default infantryTrain;
