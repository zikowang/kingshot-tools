/** @format */

import CustomSelect from "@/components/ui/select";
import {
    Box,
    Button,
    createListCollection,
    Field,
    Grid,
    GridItem,
    HStack,
    Input,
    NumberInput,
    Separator,
    Switch,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuClock, LuUserPlus, LuUserRoundMinus } from "react-icons/lu";

import { Fragment } from "react";
import { getUTC } from "../../Calendar/CalendarPage";
import RallyTimeResult, {
    type RallyStarterResult,
    type RallyTimerResult,
} from "./RallyTimerResult";

const QUICK_SET_OPTIONS = [
    { label: "6:00", minutes: 6 },
    { label: "6:30", minutes: 6.5 },
    { label: "7:00", minutes: 7 },
] as const;
const COUNTER_RALLY_OFFSET_OPTIONS = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60] as const;
const DEFAULT_QUICK_SET_MINUTES = 7;
const DEFAULT_RALLY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const counterRallyOffsetCollection = createListCollection({
    items: COUNTER_RALLY_OFFSET_OPTIONS.map((offsetSeconds) => ({
        label: `+${offsetSeconds}s`,
        value: String(offsetSeconds),
    })),
});

const defaultRallyStarter: RallyStarterResult = {
    name: "Starter 1",
    marchTimeSec: 60,
    rallyStartTime: new Date(),
    active: true,
    counterShadow: false,
    counterRallyOffsetSec: 15,
};

function getHitTimeData(value?: Date, minutesToAdd = DEFAULT_QUICK_SET_MINUTES, isUtc = false) {
    const now = !isUtc ? getUTC(value ?? new Date()) : (value ?? new Date());
    const defaultSet = new Date(now.getTime() + minutesToAdd * 60000);
    const hour = defaultSet.getHours();
    const minute = defaultSet.getMinutes();
    const second = defaultSet.getSeconds();

    return { datetime: defaultSet, hour, minute, second };
}

const RallyTimeForm = ({
    data,
    updateData,
}: {
    data: RallyTimerResult;
    updateData: (value: RallyTimerResult) => void;
}) => {
    const handleQuickSetTime = (minutesToAdd: number) => {
        const updatedRallyHit = getHitTimeData(undefined, minutesToAdd);

        updateData({
            ...data,
            hitTime: updatedRallyHit,
            selectedQuickSetMinutes: minutesToAdd,
        });
    };

    const handleUpdateRallyHit = (key: "hour" | "minute" | "second", value: number) => {
        const newHitTime = new Date(data.hitTime.datetime);

        if (key === "hour") {
            newHitTime.setUTCHours(value);
        } else if (key === "minute") {
            newHitTime.setUTCMinutes(value);
        } else if (key === "second") {
            newHitTime.setUTCSeconds(value);
        }

        const updatedRallyHit = {
            datetime: newHitTime,
            hour: newHitTime.getHours(),
            minute: newHitTime.getMinutes(),
            second: newHitTime.getSeconds(),
        };

        updateData({
            ...data,
            hitTime: updatedRallyHit,
            selectedQuickSetMinutes: null,
        });
    };

    const handleUpdateRallyStarters = (starters: RallyStarterResult[]) => {
        updateData({
            ...data,
            rallyStarters: starters,
        });
    };

    return (
        <VStack justifyContent={"flex-start"} alignItems="flex-start" gap={4} mt={8}>
            <VStack justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap">
                <HStack gap={2} flexWrap="wrap">
                    <NumberInput.Root
                        value={String(data.hitTime.hour)}
                        onValueChange={(e) => {
                            const numericValue = Number(e.value);

                            if (isNaN(numericValue)) {
                                handleUpdateRallyHit("hour", 0);
                                return;
                            }

                            if (numericValue < 0) {
                                handleUpdateRallyHit("hour", 23);
                                return;
                            }

                            handleUpdateRallyHit("hour", Math.abs(numericValue) % 24);
                        }}
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        width="100px"
                        required
                    >
                        <NumberInput.Label>Hour</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    <NumberInput.Root
                        value={String(data.hitTime.minute)}
                        onValueChange={(e) => {
                            const numericValue = Number(e.value);

                            if (isNaN(numericValue)) {
                                handleUpdateRallyHit("minute", 0);
                                return;
                            }

                            if (numericValue < 0) {
                                handleUpdateRallyHit("minute", 59);
                                return;
                            }

                            handleUpdateRallyHit("minute", Math.abs(numericValue) % 60);
                        }}
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        width="100px"
                        required
                    >
                        <NumberInput.Label>Minute</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    <NumberInput.Root
                        value={String(data.hitTime.second)}
                        onValueChange={(e) => {
                            const numericValue = Number(e.value);

                            if (isNaN(numericValue)) {
                                handleUpdateRallyHit("second", 0);
                                return;
                            }

                            if (numericValue < 0) {
                                handleUpdateRallyHit("second", 59);
                                return;
                            }

                            handleUpdateRallyHit("second", Math.abs(numericValue) % 60);
                        }}
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        width="100px"
                        required
                    >
                        <NumberInput.Label>Second</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </HStack>

                <HStack gap={2} flexWrap="wrap">
                    {QUICK_SET_OPTIONS.map((option) => (
                        <Button
                            key={option.label}
                            type="button"
                            onClick={() => handleQuickSetTime(option.minutes)}
                            variant={
                                data.selectedQuickSetMinutes === option.minutes
                                    ? "solid"
                                    : "outline"
                            }
                            colorPalette={
                                data.selectedQuickSetMinutes === option.minutes ? "blue" : "green"
                            }
                            size="md"
                        >
                            <LuClock /> {option.label}
                        </Button>
                    ))}
                </HStack>
            </VStack>
            <Text fontSize={12} color="gray.400">
                Quick set buttons add 6:00, 6:30, or 7:00 minutes to the current time.
            </Text>
            <Text fontSize={12} color="gray.400">
                Set counter rally offsets per starter below after marking them as counter.
            </Text>

            <Separator size="lg" width="100%" />

            <RallyTimeResult result={data} />

            <Separator size="lg" width="100%" />

            <Box maxWidth="600px" width="100%">
                <Grid
                    gap={{
                        base: 1,
                        md: 4,
                    }}
                    gridTemplateColumns={{
                        base: "auto 1fr 1fr auto auto auto",
                    }}
                    width="100%"
                    alignItems={"center"}
                >
                    <GridItem></GridItem>
                    <GridItem fontSize={14}>Leader</GridItem>
                    <GridItem fontSize={14}>March Time (s)</GridItem>
                    <GridItem fontSize={14}>Counter</GridItem>
                    <GridItem fontSize={14}>Offset</GridItem>
                    <GridItem></GridItem>
                    {data.rallyStarters.map((starter, index) => (
                        <Fragment key={index}>
                            <Switch.Root
                                colorPalette={"green"}
                                checked={starter.active ?? true}
                                onCheckedChange={(e) => {
                                    const newActive = e.checked;
                                    const updatedStarters = [...data.rallyStarters];
                                    updatedStarters[index] = {
                                        ...updatedStarters[index],
                                        active: newActive,
                                    };
                                    handleUpdateRallyStarters(updatedStarters);
                                }}
                                size={{
                                    base: "sm",
                                    md: "md",
                                }}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label />
                            </Switch.Root>
                            <GridItem opacity={starter.active ? 1 : 0.4}>
                                <Field.Root>
                                    <Input
                                        value={starter.name}
                                        placeholder={`Name Starter ${index + 1}`}
                                        onChange={(e) => {
                                            const newName = e.target.value;
                                            const updatedStarters = [...data.rallyStarters];
                                            updatedStarters[index] = {
                                                ...updatedStarters[index],
                                                name: newName,
                                            };
                                            handleUpdateRallyStarters(updatedStarters);
                                        }}
                                        onFocus={(e) =>
                                            e.target instanceof HTMLInputElement &&
                                            e.target.select()
                                        }
                                    />
                                </Field.Root>
                            </GridItem>

                            <GridItem
                                colSpan={{ base: 1, md: 1 }}
                                opacity={starter.active ? 1 : 0.4}
                            >
                                <NumberInput.Root
                                    value={String(starter.marchTimeSec)}
                                    onValueChange={(e) => {
                                        const updatedStarters = [...data.rallyStarters];
                                        updatedStarters[index] = {
                                            ...updatedStarters[index],
                                            marchTimeSec:
                                                Number(e.value) >= 0 ? Number(e.value) : 0,
                                        };
                                        handleUpdateRallyStarters(updatedStarters);
                                    }}
                                    onFocus={(e) =>
                                        e.target instanceof HTMLInputElement && e.target.select()
                                    }
                                    required
                                    min={0}
                                    step={1}
                                    width="100%"
                                >
                                    <NumberInput.Scrubber />
                                    <NumberInput.Input />
                                </NumberInput.Root>
                            </GridItem>

                            <GridItem
                                colSpan={{ base: 1, md: 1 }}
                                opacity={starter.active ? 1 : 0.4}
                            >
                                <Switch.Root
                                    colorPalette={"blue"}
                                    checked={starter.counterShadow ?? false}
                                    onCheckedChange={(e) => {
                                        const updatedStarters = [...data.rallyStarters];
                                        updatedStarters[index] = {
                                            ...updatedStarters[index],
                                            counterShadow: e.checked,
                                            counterRallyOffsetSec:
                                                updatedStarters[index].counterRallyOffsetSec ?? 15,
                                        };
                                        handleUpdateRallyStarters(updatedStarters);
                                    }}
                                    size={{
                                        base: "sm",
                                        md: "md",
                                    }}
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Root>
                            </GridItem>

                            <GridItem
                                colSpan={{ base: 1, md: 1 }}
                                opacity={starter.active ? 1 : 0.4}
                                width="75px"
                            >
                                {starter.counterShadow ? (
                                    <CustomSelect
                                        label=""
                                        placeholder="Select offset"
                                        value={String(starter.counterRallyOffsetSec ?? 15)}
                                        options={counterRallyOffsetCollection}
                                        onChange={(value) => {
                                            const updatedStarters = [...data.rallyStarters];
                                            updatedStarters[index] = {
                                                ...updatedStarters[index],
                                                counterRallyOffsetSec: Number(value),
                                            };
                                            handleUpdateRallyStarters(updatedStarters);
                                        }}
                                    />
                                ) : (
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        height="46px"
                                    >
                                        <Text fontSize={12} color="gray.400">
                                            Not counter
                                        </Text>
                                    </Box>
                                )}
                            </GridItem>

                            <GridItem>
                                <Button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() => {
                                        const updatedStarters = data.rallyStarters.filter(
                                            (_, i) => i !== index
                                        );
                                        handleUpdateRallyStarters(updatedStarters);
                                    }}
                                    colorPalette={"red"}
                                    variant="ghost"
                                    size={{
                                        base: "sm",
                                        md: "md",
                                    }}
                                    disabled={data.rallyStarters.length === 1}
                                >
                                    <LuUserRoundMinus />
                                </Button>
                            </GridItem>
                        </Fragment>
                    ))}
                </Grid>
            </Box>

            <Button
                type="button"
                tabIndex={-1}
                onClick={() => {
                    const newStarter: RallyStarterResult = {
                        ...defaultRallyStarter,
                        name: `Starter ${data.rallyStarters.length + 1}`,
                    };
                    handleUpdateRallyStarters([...data.rallyStarters, newStarter]);
                }}
                colorPalette={"green"}
                variant="ghost"
                size="md"
            >
                <LuUserPlus /> Add Starter
            </Button>
        </VStack>
    );
};

export default RallyTimeForm;
