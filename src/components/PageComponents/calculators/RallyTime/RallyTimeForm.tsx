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

import { Fragment, useCallback, useState } from "react";
import { getUTC } from "../../Calendar/CalendarPage";
import RallyTimeResult, {
    type RallyStarterResult,
    type RallyTimerResult,
} from "./RallyTimerResult";

const HIT_TIME_QUICK_SET_OPTIONS = [
    { label: "6:00", minutes: 6 },
    { label: "6:30", minutes: 6.5 },
    { label: "7:00", minutes: 7 },
    { label: "10:00", minutes: 10 },
    { label: "15:00", minutes: 15 },
] as const;
const START_TIME_QUICK_SET_OPTIONS = [
    { label: "30s", minutes: 0.5 },
    { label: "45s", minutes: 0.75 },
    { label: "1m", minutes: 1 },
    { label: "2m", minutes: 2 },
    { label: "3m", minutes: 3 },
    { label: "5m", minutes: 5 },
] as const;
const COUNTER_RALLY_OFFSET_OPTIONS = [
    1, 2, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 90, 120, 150, 180, 210, 240, 270, 300,
] as const;
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

function getTimeData(value: Date) {
    return {
        datetime: value,
        hour: value.getHours(),
        minute: value.getMinutes(),
        second: value.getSeconds(),
    };
}

function getEarliestStarter(starters: RallyStarterResult[]) {
    return starters
        .filter((starter) => starter.active)
        .sort((left, right) => left.rallyStartTime.getTime() - right.rallyStartTime.getTime())[0];
}

const RallyTimeForm = ({
    data,
    updateData,
}: {
    data: RallyTimerResult;
    updateData: (value: RallyTimerResult) => void;
}) => {
    const [timeInputMode, setTimeInputMode] = useState<"hit" | "start">("hit");
    const earliestStarter = getEarliestStarter(data.rallyStarters);
    const inputTime =
        timeInputMode === "start" && earliestStarter
            ? getTimeData(earliestStarter.rallyStartTime)
            : data.hitTime;
    const quickSetOptions =
        timeInputMode === "start" ? START_TIME_QUICK_SET_OPTIONS : HIT_TIME_QUICK_SET_OPTIONS;

    const getHitTimeFromInput = (inputTimeValue: Date) => {
        if (timeInputMode !== "start" || !earliestStarter) {
            return inputTimeValue;
        }

        const counterOffsetMs = earliestStarter.counterShadow
            ? (earliestStarter.counterRallyOffsetSec ?? 15) * 1000
            : 0;

        return new Date(
            inputTimeValue.getTime() +
                earliestStarter.marchTimeSec * 1000 +
                DEFAULT_RALLY_TIME -
                counterOffsetMs
        );
    };

    const handleQuickSetTime = useCallback(
        (minutesToAdd: number) => {
            const updatedInputTime = getHitTimeData(undefined, minutesToAdd);
            const updatedRallyHit = getHitTimeFromInput(updatedInputTime.datetime);

            updateData({
                ...data,
                hitTime: getTimeData(updatedRallyHit),
                selectedQuickSetMinutes: minutesToAdd,
            });
        },
        [data, earliestStarter, timeInputMode, updateData]
    );

    const handleUpdateRallyHit = useCallback(
        (key: "hour" | "minute" | "second", value: number) => {
            const newInputTime = new Date(inputTime.datetime);

            if (key === "hour") {
                newInputTime.setHours(value);
            } else if (key === "minute") {
                newInputTime.setMinutes(value);
            } else if (key === "second") {
                newInputTime.setSeconds(value);
            }

            const updatedRallyHit = getHitTimeFromInput(newInputTime);

            updateData({
                ...data,
                hitTime: getTimeData(updatedRallyHit),
                selectedQuickSetMinutes: null,
            });
        },
        [data, getHitTimeFromInput, inputTime, updateData]
    );

    const handleUpdateRallyStarters = useCallback(
        (starters: RallyStarterResult[]) => {
            updateData({
                ...data,
                rallyStarters: starters,
            });
        },
        [data, updateData]
    );

    return (
        <VStack justifyContent={"flex-start"} alignItems="flex-start" gap={4} mt={8}>
            <VStack justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap">
                <Switch.Root
                    checked={timeInputMode === "start"}
                    onCheckedChange={(e) => setTimeInputMode(e.checked ? "start" : "hit")}
                    colorPalette="blue"
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Enter earliest next start time</Switch.Label>
                </Switch.Root>
                <HStack gap={2} flexWrap="wrap">
                    <NumberInput.Root
                        value={String(inputTime.hour)}
                        onValueChange={(e) => {
                            const numericValue = Number(e.value);

                            if (isNaN(numericValue) || numericValue > 23) {
                                handleUpdateRallyHit("hour", 0);
                                return;
                            }

                            if (numericValue < 0) {
                                handleUpdateRallyHit("hour", 23);
                                return;
                            }

                            handleUpdateRallyHit("hour", Math.abs(numericValue));
                        }}
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        width="100px"
                        step={1}
                        required
                    >
                        <NumberInput.Label>
                            {timeInputMode === "start" ? "Start hour" : "Hit hour"}
                        </NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    <NumberInput.Root
                        value={String(inputTime.minute)}
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
                        step={1}
                        required
                    >
                        <NumberInput.Label>
                            {timeInputMode === "start" ? "Start minute" : "Hit minute"}
                        </NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    <NumberInput.Root
                        value={String(inputTime.second)}
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
                        step={1}
                        required
                    >
                        <NumberInput.Label>
                            {timeInputMode === "start" ? "Start second" : "Hit second"}
                        </NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </HStack>

                <HStack gap={2} flexWrap="wrap">
                    {quickSetOptions.map((option) => (
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
                {timeInputMode === "start"
                    ? "Quick set buttons add 30 seconds, 1, 2, 3, or 5 minutes to the current time."
                    : "Quick set buttons add 6:00, 6:30, or 7:00 minutes to the current time."}
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
