/** @format */

import barracksTG5Build from "./barracks/barracksTG5";
import barracksTG8Build from "./barracks/barracksTG8";
import commandCenterTG5Build from "./commandCenter/commandCenterTG5";
import commandCenterTG8Build from "./commandCenter/commandCenterTG8";
import embassyTG5Build from "./embassy/embassyTG5";
import embassyTG8Build from "./embassy/embassyTG8";
import infirmaryTG5Build from "./infirmary/infirmaryTG5";
import infirmaryTG8Build from "./infirmary/infirmaryTG8";
import rangeTG5Build from "./range/rangeTG5";
import rangeTG8Build from "./range/rangeTG8";
import stableTG5Build from "./stable/stableTG5";
import stableTG8Build from "./stable/stableTG8";
import townCenterTG5Build from "./townCenter/townCenterTG5";
import townCenterTG8Build from "./townCenter/townCenterTG8";
import warAcademyTG5Build from "./warAcademy/warAcademyTG5";
import warAcademyTG8Build from "./warAcademy/warAcademyTG8";

export const townCenter = [...townCenterTG5Build, ...townCenterTG8Build]
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const embassy = [...embassyTG5Build, ...embassyTG8Build]
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const barracks = [...barracksTG5Build, ...barracksTG8Build]
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const stable = [...stableTG5Build, ...stableTG8Build]
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const range = [...rangeTG5Build, ...rangeTG8Build]
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const infirmary = [...infirmaryTG5Build, ...infirmaryTG8Build]
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const commandCenter = [...commandCenterTG5Build, ...commandCenterTG8Build]
    .map((entry) => {
        return entry.stages.map((stage) => stage);
    })
    .flat()
    .toSorted((a, b) => a.level - b.level);

export const warAcademy = [...warAcademyTG5Build, ...warAcademyTG8Build]
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
