/** @format */

import barracksBuild from "./barracks";
import embassyBuild from "./embassy";
import rangeBuild from "./range";
import stableBuild from "./stable";
import townCenterBuild from "./townCenter";

export const townCenter = townCenterBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const embassy = embassyBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const barracks = barracksBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const stable = stableBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const range = rangeBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const allBuildings = {
    townCenter,
    embassy,
    barracks,
    stable,
    range,
};
