/** @format */

import type { BuildingStage } from "@/types/building";
import barracksBuild from "./barracks";
import embassyBuild from "./embassy";
import rangeBuild from "./range";
import stableBuild from "./stable";
import townCenterBuild from "./townCenter";

export const townCenter: BuildingStage[] = townCenterBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const embassy: BuildingStage[] = embassyBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const barracks: BuildingStage[] = barracksBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const stable: BuildingStage[] = stableBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const range: BuildingStage[] = rangeBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const allBuildings = [...townCenter, ...embassy, ...barracks, ...stable, ...range];
