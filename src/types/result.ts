/** @format */

import type { BuildingStage } from "./building";

export type TroopCalculatorResult = {
    showResult: boolean;

    calculationType: "amount-of-troops" | "amount-of-time";

    quantity: number;

    time: number;

    bread: number;
    wood: number;
    stone: number;
    iron: number;

    power: number;

    kvkPoints: number;
    strongestGovernorPoints: number;
};

export type TruegoldCalculatorResult = {
    showResult: boolean;

    time: number;

    bread: number;
    wood: number;
    stone: number;
    iron: number;
    truegold: number;

    buildingList: BuildingStage[];
};
