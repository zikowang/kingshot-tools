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
    id: `infantry-${elem.name}`,
    tierId: elem.id,
    tierName: elem.name,
    buildTime: buildTime[elem.name],
    cost: infantryCost[elem.name],
    power: tierPower[elem.name],
    points: {
        hog: tierHogPoints[elem.name],
        kvk: tierKvKPoints[elem.name],
        sg: tierSGPoints[elem.name],
    },
}));

export default infantryTrain;
