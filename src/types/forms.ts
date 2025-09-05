/** @format */

export type TroopsFormValues = {
    calculationType: string;
    trainType: string;
    troopType: string;
    rootTier: string[];
    targetTier: string[];
    quantity: string;

    speedupDays: string;
    speedupHours: string;
    speedupMinutes: string;
    speedupSeconds: string;

    troopTrainingSpeed: string;
    kingdomBuffSpeed: string;
    positionBuffSpeed: string;
};

export type TruegoldFormValues = {
    currentTcLevel: string;
    targetTcLevel: string;

    currentEmLevel: string;
    targetEmLevel: string;

    currentBaLevel: string;
    targetBaLevel: string;

    currentStLevel: string;
    targetStLevel: string;

    currentRaLevel: string;
    targetRaLevel: string;

    saulBuff: string;

    buildingSpeed: string;
    kingdomBuffSpeed: string;
    positionBuffSpeed: string;
    petBuffSpeed: string;

    doubleTime: string;
};
