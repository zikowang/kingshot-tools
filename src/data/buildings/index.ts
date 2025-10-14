/** @format */

import type { BuildingStage } from "@/types/building";
import barracksBuild from "./barracks";
import commandCenterBuild from "./commandCenter";
import embassyBuild from "./embassy";
import infirmaryBuild from "./infirmary";
import rangeBuild from "./range";
import stableBuild from "./stable";
import townCenterBuild from "./townCenter";
import warAcademyBuild from "./warAcademy";

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

export const infirmary: BuildingStage[] = infirmaryBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const commandCenter: BuildingStage[] = commandCenterBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const warAcademy: BuildingStage[] = warAcademyBuild
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const allBuildings = [
    ...townCenter,
    ...embassy,
    ...barracks,
    ...stable,
    ...range,
    ...infirmary,
    ...commandCenter,
    ...warAcademy,
];
