/** @format */

export type BuildingStage = {
    id: string;
    type: string;
    name: string;
    level: number;
    buildTime: number;
    cost: {
        bread: number;
        wood: number;
        stone: number;
        iron: number;
        truegold: number;
    };
    power: number;
    requirements: string[];
};

export type Building = {
    id: string;
    name: string;
    stages: BuildingStage[];
};
