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
    id: `archer-${elem.name}`,
    tierId: elem.id,
    tierName: elem.name,
    buildTime: buildTime[elem.name],
    cost: archerCost[elem.name],
    power: tierPower[elem.name],
    points: {
        hog: tierHogPoints[elem.name],
        kvk: tierKvKPoints[elem.name],
        sg: tierSGPoints[elem.name],
    },
}));

export default archerTrain;
