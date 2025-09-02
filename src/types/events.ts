/** @format */

export type Item = {
    name: string;
    image?: string;
};

export type Event = {
    id: string;
    name: string;
    shortName: string;
    image?: string;
    color: string;
    days: number[];
    rewards?: Item[];
    todo?: string[];
    optionalTodo?: string[];
};
