/** @format */

import { ToggleTip } from "@/components/ui/toggle-tip";
import { tierList } from "@/data/troops/sharedTroops";
import trainingData from "@/data/troops/train";
import type { TroopCalculatorResult } from "@/types/result";
import type { Tier } from "@/types/tier";
import {
    Box,
    Button,
    createListCollection,
    Field,
    InputGroup,
    NumberInput,
    Portal,
    SegmentGroup,
    Select,
    Stack,
    Switch,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState, type Dispatch } from "react";
import {
    LuArrowBigUpDash,
    LuCirclePlus,
    LuInfo,
    LuPercent,
    LuTimer,
    LuUserPlus,
} from "react-icons/lu";

const KING_SKILL = "30";
const POSITION_BUFF = "50";
const DEFAULT_CALCULATION_TYPE = "amount-of-time";
const HIDDEN_TIER_LIST = ["t11", "tg4", "tg5"];

const defaultFormValues: {
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
} = {
    calculationType: DEFAULT_CALCULATION_TYPE,
    trainType: "train",
    troopType: "infantry",
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

const tierCollection = createListCollection({
    items: tierList
        .filter((t) => !HIDDEN_TIER_LIST.includes(t.name))
        .map((t) => ({ label: t.name.toUpperCase(), value: t.name })),
});

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

    const isCalculateAmountOfTroops = formValues.calculationType === "amount-of-troops";
    const isCalculateAmountOfTime = formValues.calculationType === "amount-of-time";
    const isPromotion = formValues.trainType === "promote";

    const onReset = () => {
        setFormValues(defaultFormValues);
    };

    useEffect(() => {
        const calculationType = formValues.calculationType as "amount-of-troops" | "amount-of-time";
        const troopType = formValues.troopType as "infantry" | "cavalry" | "archer";
        const rootTier = formValues.rootTier[0] as Tier["name"];
        const targetTier = formValues.targetTier[0] as Tier["name"];
        const quantity = parseInt(formValues.quantity, 10);
        const troopTrainingSpeed = parseFloat(formValues.troopTrainingSpeed || "0");
        const kingdomBuffSpeed = parseInt(formValues.kingdomBuffSpeed || "0", 10);
        const positionBuffSpeed = parseInt(formValues.positionBuffSpeed || "0", 10);
        const sumSpeedBuff =
            1 + troopTrainingSpeed / 100 + kingdomBuffSpeed / 100 + positionBuffSpeed / 100;

        const rootTrain = trainingData[troopType].find((t) => t.tierName === rootTier);
        const targetTrain = trainingData[troopType].find((t) => t.tierName === targetTier);

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

        const calculationBaseTime = isPromotion
            ? Math.floor(targetBaseTime - rootBaseTime)
            : Math.floor(targetBaseTime);
        const powerBaseGain = isPromotion
            ? targetTrain.power - (rootTrain?.power || 0)
            : targetTrain.power;

        if (calculationType === "amount-of-troops") {
            const speedupDays = parseInt(formValues.speedupDays, 10);
            const speedupHours = parseInt(formValues.speedupHours, 10);
            const speedupMinutes = parseInt(formValues.speedupMinutes, 10);
            const speedupSeconds = parseInt(formValues.speedupSeconds, 10);

            const totalSpeedupInSeconds =
                speedupDays * 86400 + speedupHours * 3600 + speedupMinutes * 60 + speedupSeconds;
            const updatedEffectiveSpeedupInSeconds = totalSpeedupInSeconds * sumSpeedBuff;
            const resultQuantity = Math.floor(
                updatedEffectiveSpeedupInSeconds / calculationBaseTime
            );
            const effectiveTime = totalSpeedupInSeconds;
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

                power: resultQuantity * powerBaseGain,

                kvkPoints,
                strongestGovernorPoints,
                ...resultCost,
            });

            return;
        }

        const resultTime = Math.floor((calculationBaseTime * quantity) / sumSpeedBuff);

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

            power: quantity * powerBaseGain,

            kvkPoints,
            strongestGovernorPoints,
            ...resultCost,
        });
    }, [formValues]);

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
    }, [formValues, isPromotion]);

    return (
        <Box style={{ width: "100%" }}>
            <Stack gap={4} width="100%">
                <SegmentGroup.Root
                    defaultValue={DEFAULT_CALCULATION_TYPE}
                    value={formValues.calculationType}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            calculationType: e.value || "amount-of-troops",
                        }))
                    }
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        items={[
                            {
                                label: (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LuUserPlus />
                                        <Text>Troops</Text>
                                    </Box>
                                ),
                                value: "amount-of-troops",
                            },
                            {
                                label: (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LuTimer />
                                        <Text>Time</Text>
                                    </Box>
                                ),
                                value: "amount-of-time",
                            },
                        ]}
                        width="100%"
                        opacity={0.7}
                        _hover={{ cursor: "pointer", opacity: 1 }}
                        _checked={{ opacity: 1, outline: "2px solid blue" }}
                    />
                </SegmentGroup.Root>

                <SegmentGroup.Root
                    defaultValue="training"
                    value={formValues.trainType}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            trainType: e.value || "train",
                        }))
                    }
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        items={[
                            {
                                label: (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LuCirclePlus />
                                        <Text>Train</Text>
                                    </Box>
                                ),
                                value: "train",
                            },
                            {
                                label: (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LuArrowBigUpDash />
                                        <Text>Promote</Text>
                                    </Box>
                                ),
                                value: "promote",
                            },
                        ]}
                        width="100%"
                        opacity={0.7}
                        _hover={{ cursor: "pointer", opacity: 1 }}
                        _checked={{ opacity: 1, outline: "2px solid blue" }}
                    />
                </SegmentGroup.Root>

                <SegmentGroup.Root
                    defaultValue="infantry"
                    value={formValues.troopType}
                    onValueChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            troopType: e.value || "infantry",
                        }))
                    }
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        items={[
                            { label: "Infantry", value: "infantry" },
                            { label: "Cavalry", value: "cavalry" },
                            { label: "Archer", value: "archer" },
                        ]}
                        width="100%"
                        opacity={0.7}
                        _hover={{ cursor: "pointer", opacity: 1 }}
                        _checked={{ opacity: 1, outline: "2px solid blue" }}
                    />
                </SegmentGroup.Root>

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
                                <Select.Content maxHeight="200px" overflowY="auto">
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
                            <Select.Content maxHeight="200px" overflowY="auto">
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
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
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

                <Field.Root invalid={parseFloat(formValues.troopTrainingSpeed) <= 0}>
                    <NumberInput.Root
                        value={formValues.troopTrainingSpeed || "0"}
                        onValueChange={(e) => {
                            const value = e.value.replace(",", ".");
                            setFormValues((prev) => ({
                                ...prev,
                                troopTrainingSpeed: value || "0",
                            }));
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
                        width="100%"
                    >
                        <NumberInput.Label>Training Speed</NumberInput.Label>
                        <InputGroup
                            startElement={<LuPercent />}
                            endElement={
                                <ToggleTip
                                    content={
                                        <VStack
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                            p={2}
                                        >
                                            <Text>
                                                You can find your training speed in the bonus
                                                overview.
                                            </Text>
                                            <Box
                                                as="ul"
                                                listStyleType="circle"
                                                listStylePosition="inside"
                                            >
                                                <li>
                                                    Tap on your Power on the top left (next to your
                                                    profile picture)
                                                </li>
                                                <li>Find "Training Speed" in the list</li>
                                            </Box>
                                        </VStack>
                                    }
                                >
                                    <Button
                                        size="xs"
                                        colorPalette={
                                            parseFloat(formValues.troopTrainingSpeed) <= 0
                                                ? "red"
                                                : "blue"
                                        }
                                        variant="ghost"
                                    >
                                        <LuInfo />
                                    </Button>
                                </ToggleTip>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                        <NumberInput.Scrubber />
                    </NumberInput.Root>
                    <Field.ErrorText>You should add your Training Speed!</Field.ErrorText>
                </Field.Root>

                <Switch.Root
                    checked={formValues.kingdomBuffSpeed !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            kingdomBuffSpeed: e.checked ? KING_SKILL : "0",
                        }))
                    }
                    colorPalette="blue"
                    opacity={0.5}
                    _checked={{ opacity: 1 }}
                    _hover={{ opacity: 1 }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label _hover={{ cursor: "pointer" }}>
                        Kingdom Skill Buff ({KING_SKILL}%)
                    </Switch.Label>
                </Switch.Root>

                <Switch.Root
                    checked={formValues.positionBuffSpeed !== "0"}
                    onCheckedChange={(e) =>
                        setFormValues((prev) => ({
                            ...prev,
                            positionBuffSpeed: e.checked ? POSITION_BUFF : "0",
                        }))
                    }
                    colorPalette="blue"
                    opacity={0.5}
                    _checked={{ opacity: 1 }}
                    _hover={{ opacity: 1 }}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label _hover={{ cursor: "pointer" }}>
                        Noble Advisor Buff ({POSITION_BUFF}%)
                    </Switch.Label>
                </Switch.Root>

                {isCalculateAmountOfTroops && (
                    <>
                        <NumberInput.Root
                            value={formValues.speedupDays}
                            onValueChange={(e) =>
                                setFormValues((prev) => ({ ...prev, speedupDays: e.value }))
                            }
                            onFocus={(e) =>
                                e.target instanceof HTMLInputElement && e.target.select()
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
                            onFocus={(e) =>
                                e.target instanceof HTMLInputElement && e.target.select()
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
                            onFocus={(e) =>
                                e.target instanceof HTMLInputElement && e.target.select()
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
                            onFocus={(e) =>
                                e.target instanceof HTMLInputElement && e.target.select()
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

            <Box display="flex" justifyContent="flex-start" my={4}>
                <Button
                    type="button"
                    onClick={onReset}
                    variant="ghost"
                    colorPalette="red"
                    size="md"
                >
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default TroopsForm;
