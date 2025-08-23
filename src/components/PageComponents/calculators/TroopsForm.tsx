/** @format */

import { tier } from "@/data/troops/sharedTroops";
import trainingData from "@/data/troops/train";
import type { Tier } from "@/types/tier";
import {
    Box,
    Button,
    Checkbox,
    createListCollection,
    InputGroup,
    NumberInput,
    Portal,
    Select,
    Stack,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch } from "react";
import { LuPercent } from "react-icons/lu";

const KINGDOM_BUFF = "25";
const POSITION_BUFF = "50";

const defaultFormValues: {
    calculationType: string[];
    trainType: string[];
    troopType: string[];
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
} = {
    calculationType: ["amount-of-time"],
    trainType: ["train"],
    troopType: ["infantry"],
    rootTier: [],
    targetTier: ["t10"],
    quantity: "1",

    speedupDays: "0",
    speedupHours: "0",
    speedupMinutes: "0",
    speedupSeconds: "0",

    troopTrainingSpeed: "0",
    kingdomBuffSpeed: "0",
    positionBuffSpeed: "0",
};

const calculationTypeCollection = createListCollection({
    items: [
        { label: "Amount of Troops", value: "amount-of-troops" },
        { label: "Amount of Time", value: "amount-of-time" },
    ],
});

const trainTypeCollection = createListCollection({
    items: [
        { label: "Train Troops", value: "train" },
        { label: "Promote Troops", value: "promote" },
    ],
});

const tierCollection = createListCollection({
    items: tier.filter((t) => t !== "t11").map((t) => ({ label: t.toUpperCase(), value: t })),
});

const troopTypeCollection = createListCollection({
    items: [
        { label: "Infantry", value: "infantry" },
        { label: "Cavalry", value: "cavalry" },
        { label: "Archer", value: "archer" },
    ],
});

export type TroopCalculatorResult = {
    showResult: boolean;
    calculationType: "amount-of-troops" | "amount-of-time";
    quantity: number;
    time: number;
    bread: number;
    wood: number;
    stone: number;
    iron: number;

    kvkPoints: number;
    strongestGovernorPoints: number;
};

const TroopsForm = ({
    setResult,
}: {
    setResult: Dispatch<React.SetStateAction<TroopCalculatorResult>>;
}) => {
    const [formValues, setFormValues] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const initialValues = { ...defaultFormValues };

        Object.keys(initialValues).forEach((key) => {
            const value = params.get(key);

            if (key in initialValues && value !== null) {
                if (Array.isArray(defaultFormValues[key as keyof typeof defaultFormValues])) {
                    initialValues[key as keyof typeof initialValues] = value.split(",") as any;
                } else {
                    initialValues[key as keyof typeof initialValues] = value as any;
                }
            }
        });

        return initialValues;
    });

    const isCalculateAmountOfTroops = formValues.calculationType[0] === "amount-of-troops";
    const isCalculateAmountOfTime = formValues.calculationType[0] === "amount-of-time";
    const isPromotion = formValues.trainType[0] === "promote";

    const onReset = () => {
        setFormValues(defaultFormValues);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const calculationType = formValues.calculationType[0] as
            | "amount-of-troops"
            | "amount-of-time";
        const troopType = formValues.troopType[0] as "infantry" | "cavalry" | "archer";
        const rootTier = formValues.rootTier[0] as Tier;
        const targetTier = formValues.targetTier[0] as Tier;
        const quantity = parseInt(formValues.quantity, 10);
        const troopTrainingSpeed = parseInt(formValues.troopTrainingSpeed || "0", 10);
        const kingdomBuffSpeed = parseInt(formValues.kingdomBuffSpeed || "0", 10);
        const positionBuffSpeed = parseInt(formValues.positionBuffSpeed || "0", 10);
        const sumSpeedBuff =
            1 + troopTrainingSpeed / 100 + kingdomBuffSpeed / 100 + positionBuffSpeed / 100;

        const rootTrain = trainingData[troopType].find((t) => t.tier === rootTier);
        const targetTrain = trainingData[troopType].find((t) => t.tier === targetTier);

        if (!targetTrain) {
            setResult((prev) => ({
                ...prev,
                showResult: false,
            }));
            return;
        }

        const targetCost = targetTrain.cost;

        const targetBaseTime = targetTrain.buildTime;
        const rootBaseTime = rootTrain?.buildTime || 0;

        const buildCalculationBaseTime = isPromotion
            ? Math.floor((targetBaseTime - rootBaseTime) / sumSpeedBuff)
            : Math.floor(targetBaseTime / sumSpeedBuff);

        if (calculationType === "amount-of-troops") {
            const speedupDays = parseInt(formValues.speedupDays, 10);
            const speedupHours = parseInt(formValues.speedupHours, 10);
            const speedupMinutes = parseInt(formValues.speedupMinutes, 10);
            const speedupSeconds = parseInt(formValues.speedupSeconds, 10);

            const totalSpeedupInSeconds =
                speedupDays * 86400 + speedupHours * 3600 + speedupMinutes * 60 + speedupSeconds;
            const resultQuantity = Math.floor(totalSpeedupInSeconds / buildCalculationBaseTime);
            const effectiveTime = resultQuantity * buildCalculationBaseTime;
            const kvkPoints = resultQuantity * targetTrain.points.kvk;
            const strongestGovernorPoints = resultQuantity * targetTrain.points.sg;

            const resultCost = {
                bread: isPromotion
                    ? (targetCost.bread - (rootTrain?.cost?.bread || 0)) * resultQuantity
                    : targetCost.bread * resultQuantity,
                wood: isPromotion
                    ? (targetCost.wood - (rootTrain?.cost?.wood || 0)) * resultQuantity
                    : targetCost.wood * resultQuantity,
                stone: isPromotion
                    ? (targetCost.stone - (rootTrain?.cost?.stone || 0)) * resultQuantity
                    : targetCost.stone * resultQuantity,
                iron: isPromotion
                    ? (targetCost.iron - (rootTrain?.cost?.iron || 0)) * resultQuantity
                    : targetCost.iron * resultQuantity,
            };

            setResult({
                showResult: true,
                calculationType: "amount-of-troops",
                quantity: resultQuantity,
                time: effectiveTime,
                kvkPoints,
                strongestGovernorPoints,
                ...resultCost,
            });

            return;
        }

        const resultTime = buildCalculationBaseTime * quantity;
        const resultCost = {
            bread: isPromotion
                ? (targetCost.bread - (rootTrain?.cost?.bread || 0)) * quantity
                : targetCost.bread * quantity,
            wood: isPromotion
                ? (targetCost.wood - (rootTrain?.cost?.wood || 0)) * quantity
                : targetCost.wood * quantity,
            stone: isPromotion
                ? (targetCost.stone - (rootTrain?.cost?.stone || 0)) * quantity
                : targetCost.stone * quantity,
            iron: isPromotion
                ? (targetCost.iron - (rootTrain?.cost?.iron || 0)) * quantity
                : targetCost.iron * quantity,
        };
        const kvkPoints = quantity * targetTrain.points.kvk;
        const strongestGovernorPoints = quantity * targetTrain.points.sg;

        setResult({
            showResult: true,
            calculationType: "amount-of-troops",
            quantity,
            time: resultTime,
            kvkPoints,
            strongestGovernorPoints,
            ...resultCost,
        });
    };

    useEffect(() => {
        const params = new URLSearchParams();

        Object.entries(formValues).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) params.set(key, value.join(","));
            } else if (value !== "0" && value !== "" && value !== undefined) {
                params.set(key, value);
            }
        });

        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }, [formValues]);

    return (
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Stack gap={4} width="100%">
                <Select.Root
                    value={formValues.calculationType}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({ ...prev, calculationType: e.value }))
                    }
                    collection={calculationTypeCollection}
                    width={{ base: "100%" }}
                    required
                >
                    <Select.HiddenSelect />
                    <Select.Label>What to calculate?</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select calculation" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {calculationTypeCollection.items.map((trainType) => (
                                    <Select.Item item={trainType} key={trainType.value}>
                                        {trainType.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Select.Root
                    value={formValues.trainType}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({ ...prev, trainType: e.value }))
                    }
                    collection={trainTypeCollection}
                    required
                >
                    <Select.HiddenSelect />
                    <Select.Label>Promoting or Training?</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select Training / Promotion" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {trainTypeCollection.items.map((trainType) => (
                                    <Select.Item item={trainType} key={trainType.value}>
                                        {trainType.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Select.Root
                    value={formValues.troopType}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({ ...prev, troopType: e.value }))
                    }
                    collection={troopTypeCollection}
                    required
                >
                    <Select.HiddenSelect />
                    <Select.Label>Troop Type</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select Troop Type" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {troopTypeCollection.items.map((troopType) => {
                                    return (
                                        <Select.Item item={troopType} key={troopType.value}>
                                            {troopType.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    );
                                })}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                {isPromotion && (
                    <Select.Root
                        value={formValues.rootTier}
                        onValueChange={(e) =>
                            setFormValues((prev) => ({ ...prev, rootTier: e.value }))
                        }
                        collection={tierCollection}
                        required
                    >
                        <Select.HiddenSelect />
                        <Select.Label>Current Troop Tier</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select Current Tier" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {tierCollection.items.map((tier) => {
                                        return (
                                            <Select.Item item={tier} key={tier.value}>
                                                {tier.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        );
                                    })}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                )}

                <Select.Root
                    value={formValues.targetTier}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({ ...prev, targetTier: e.value }))
                    }
                    collection={tierCollection}
                    required
                >
                    <Select.HiddenSelect />
                    <Select.Label>Target Troop Tier</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select Target Tier" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {tierCollection.items.map((tier) => {
                                    if (isPromotion && formValues.rootTier[0]) {
                                        if (
                                            tier.value.localeCompare(
                                                formValues.rootTier[0],
                                                undefined,
                                                {
                                                    numeric: true,
                                                }
                                            ) < 1
                                        ) {
                                            return null;
                                        }
                                    }

                                    return (
                                        <Select.Item item={tier} key={tier.value}>
                                            {tier.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    );
                                })}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                {isCalculateAmountOfTime && (
                    <NumberInput.Root
                        value={formValues.quantity}
                        onValueChange={(e) =>
                            setFormValues((prev) => ({ ...prev, quantity: e.value }))
                        }
                        required
                        min={1}
                        onBlur={(e) => {
                            if (e.target instanceof HTMLInputElement) {
                                let value = parseFloat(e.target.value.replace(",", "."));
                                if (isNaN(value) || value < 0) value = 0;
                                e.target.value = value.toString();
                                setFormValues((prev) => ({
                                    ...prev,
                                    quantity: value.toString(),
                                }));
                            }
                        }}
                    >
                        <NumberInput.Label>Amount of troops</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>
                )}

                <NumberInput.Root
                    value={formValues.troopTrainingSpeed || "0"}
                    onValueChange={(e) => {
                        const value = e.value.replace(",", ".");
                        setFormValues((prev) => ({ ...prev, troopTrainingSpeed: value || "0" }));
                    }}
                    step={0.1}
                    min={0}
                    onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                    onBlur={(e) => {
                        if (e.target instanceof HTMLInputElement) {
                            let value = parseFloat(e.target.value.replace(",", "."));
                            if (isNaN(value) || value < 0) value = 0;
                            e.target.value = value.toString();
                            setFormValues((prev) => ({
                                ...prev,
                                troopTrainingSpeed: value.toString(),
                            }));
                        }
                    }}
                >
                    <NumberInput.Label>Troop Training %</NumberInput.Label>
                    <InputGroup startElement={<LuPercent />}>
                        <NumberInput.Input />
                    </InputGroup>
                    <NumberInput.Scrubber />
                </NumberInput.Root>

                <Checkbox.Root
                    checked={formValues.kingdomBuffSpeed !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            kingdomBuffSpeed: e.checked ? KINGDOM_BUFF : "0",
                        }))
                    }
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Kingdom Buff ({KINGDOM_BUFF}%)</Checkbox.Label>
                </Checkbox.Root>

                <Checkbox.Root
                    checked={formValues.positionBuffSpeed !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            positionBuffSpeed: e.checked ? POSITION_BUFF : "0",
                        }))
                    }
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Position Buff ({POSITION_BUFF}%)</Checkbox.Label>
                </Checkbox.Root>

                {isCalculateAmountOfTroops && (
                    <>
                        <NumberInput.Root
                            value={formValues.speedupDays}
                            onValueChange={(e) =>
                                setFormValues((prev) => ({ ...prev, speedupDays: e.value }))
                            }
                            required
                            min={0}
                        >
                            <NumberInput.Label>Speed Up Days</NumberInput.Label>
                            <NumberInput.Scrubber />
                            <NumberInput.Input />
                        </NumberInput.Root>
                        <NumberInput.Root
                            value={formValues.speedupHours}
                            onValueChange={(e) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    speedupHours: e.value,
                                }))
                            }
                            required
                            min={0}
                        >
                            <NumberInput.Label>Speed Up Hours</NumberInput.Label>
                            <NumberInput.Scrubber />
                            <NumberInput.Input />
                        </NumberInput.Root>
                        <NumberInput.Root
                            value={formValues.speedupMinutes}
                            onValueChange={(e) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    speedupMinutes: e.value,
                                }))
                            }
                            required
                            min={0}
                        >
                            <NumberInput.Label>Speed Up Minutes</NumberInput.Label>
                            <NumberInput.Scrubber />
                            <NumberInput.Input />
                        </NumberInput.Root>
                        <NumberInput.Root
                            value={formValues.speedupSeconds}
                            onValueChange={(e) =>
                                setFormValues((prev) => ({
                                    ...prev,
                                    speedupSeconds: e.value,
                                }))
                            }
                            required
                            min={0}
                        >
                            <NumberInput.Label>Speed Up Seconds</NumberInput.Label>
                            <NumberInput.Scrubber />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </>
                )}
            </Stack>

            <Box display="flex" justifyContent="space-between" my={4}>
                <Button
                    type="button"
                    onClick={onReset}
                    variant="ghost"
                    colorPalette="red"
                    size="md"
                >
                    Reset
                </Button>
                <Button type="submit" variant="solid" size="sm">
                    Submit
                </Button>
            </Box>
        </form>
    );
};

export default TroopsForm;
