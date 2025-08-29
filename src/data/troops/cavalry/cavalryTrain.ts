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
    id: `cavalry-${elem.name}`,
    tierId: elem.id,
    tierName: elem.name,
    buildTime: buildTime[elem.name],
    cost: cavalryCost[elem.name],
    power: tierPower[elem.name],
    points: {
        hog: tierHogPoints[elem.name],
        kvk: tierKvKPoints[elem.name],
        sg: tierSGPoints[elem.name],
    },
}));

export default cavalryTrain;
