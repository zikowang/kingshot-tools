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

import { Fragment, useState, type FocusEvent } from "react";
import RallyTimeResult from "./RallyTimerResult";
import {
    createRallyStarter,
    DEFAULT_COUNTER_RALLY_OFFSET_SEC,
    getEarliestStarter,
    getHitTimeFromStartTime,
    getQuickSetHelpText,
    getTimeData,
    getTimeFromNow,
    normalizeTimePart,
    setTimePart,
    type RallyStarterResult,
    type RallyTimerResult,
    type TimePart,
} from "./rallyTime";

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
const TIME_PARTS: TimePart[] = ["hour", "minute", "second"];
const HIT_HELP_TEXT = getQuickSetHelpText(HIT_TIME_QUICK_SET_OPTIONS.map((o) => o.label));
const START_HELP_TEXT = getQuickSetHelpText(START_TIME_QUICK_SET_OPTIONS.map((o) => o.label));

const counterRallyOffsetCollection = createListCollection({
    items: COUNTER_RALLY_OFFSET_OPTIONS.map((offsetSeconds) => ({
        label: `+${offsetSeconds}s`,
        value: String(offsetSeconds),
    })),
});

const selectOnFocus = (e: FocusEvent<HTMLElement>) =>
    e.target instanceof HTMLInputElement && e.target.select();

const TimeField = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) => (
    <NumberInput.Root
        value={String(value)}
        onValueChange={(e) => onChange(Number(e.value))}
        onFocus={selectOnFocus}
        width="100px"
        step={1}
        required
    >
        <NumberInput.Label>{label}</NumberInput.Label>
        <NumberInput.Scrubber />
        <NumberInput.Input />
    </NumberInput.Root>
);

const RallyTimeForm = ({
    data,
    updateData,
}: {
    data: RallyTimerResult;
    updateData: (value: RallyTimerResult) => void;
}) => {
    const [timeInputMode, setTimeInputMode] = useState<"hit" | "start">("hit");
    const isStartMode = timeInputMode === "start";
    const earliestStarter = getEarliestStarter(data.rallyStarters);
    const inputTime =
        isStartMode && earliestStarter ? getTimeData(earliestStarter.rallyStartTime) : data.hitTime;
    const quickSetOptions = isStartMode ? START_TIME_QUICK_SET_OPTIONS : HIT_TIME_QUICK_SET_OPTIONS;

    const toHitTime = (inputDate: Date) =>
        isStartMode && earliestStarter
            ? getHitTimeFromStartTime(inputDate, earliestStarter)
            : inputDate;

    const handleQuickSetTime = (minutesToAdd: number) => {
        updateData({
            ...data,
            hitTime: getTimeData(toHitTime(getTimeFromNow(minutesToAdd).datetime)),
            selectedQuickSetMinutes: minutesToAdd,
        });
    };

    const handleUpdateTimePart = (key: TimePart, rawValue: number) => {
        const newInputTime = setTimePart(inputTime.datetime, key, normalizeTimePart(key, rawValue));

        updateData({
            ...data,
            hitTime: getTimeData(toHitTime(newInputTime)),
            selectedQuickSetMinutes: null,
        });
    };

    const setStarters = (starters: RallyStarterResult[]) => {
        updateData({ ...data, rallyStarters: starters });
    };

    const updateStarter = (id: string, patch: Partial<RallyStarterResult>) => {
        setStarters(data.rallyStarters.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    };

    return (
        <VStack justifyContent={"flex-start"} alignItems="flex-start" gap={4} mt={8}>
            <VStack justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap">
                <Switch.Root
                    checked={isStartMode}
                    onCheckedChange={(e) => setTimeInputMode(e.checked ? "start" : "hit")}
                    colorPalette="blue"
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>Enter earliest next start time</Switch.Label>
                </Switch.Root>
                <HStack gap={2} flexWrap="wrap">
                    {TIME_PARTS.map((part) => (
                        <TimeField
                            key={part}
                            label={`${isStartMode ? "Start" : "Hit"} ${part}`}
                            value={inputTime[part]}
                            onChange={(value) => handleUpdateTimePart(part, value)}
                        />
                    ))}
                </HStack>

                <HStack gap={2} flexWrap="wrap">
                    {quickSetOptions.map((option) => {
                        const isSelected = data.selectedQuickSetMinutes === option.minutes;

                        return (
                            <Button
                                key={option.label}
                                type="button"
                                onClick={() => handleQuickSetTime(option.minutes)}
                                variant={isSelected ? "solid" : "outline"}
                                colorPalette={isSelected ? "blue" : "green"}
                                size="md"
                            >
                                <LuClock /> {option.label}
                            </Button>
                        );
                    })}
                </HStack>
            </VStack>
            <Text fontSize={12} color="gray.400">
                {isStartMode ? START_HELP_TEXT : HIT_HELP_TEXT} All times are UTC.
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
                    {data.rallyStarters.map((starter, index) => {
                        const rowOpacity = starter.active ? 1 : 0.4;

                        return (
                            <Fragment key={starter.id}>
                                <Switch.Root
                                    colorPalette={"green"}
                                    checked={starter.active ?? true}
                                    onCheckedChange={(e) =>
                                        updateStarter(starter.id, { active: e.checked })
                                    }
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
                                <GridItem opacity={rowOpacity}>
                                    <Field.Root>
                                        <Input
                                            value={starter.name}
                                            placeholder={`Name Starter ${index + 1}`}
                                            onChange={(e) =>
                                                updateStarter(starter.id, { name: e.target.value })
                                            }
                                            onFocus={selectOnFocus}
                                        />
                                    </Field.Root>
                                </GridItem>

                                <GridItem opacity={rowOpacity}>
                                    <NumberInput.Root
                                        value={String(starter.marchTimeSec)}
                                        onValueChange={(e) =>
                                            updateStarter(starter.id, {
                                                marchTimeSec: Math.max(0, Number(e.value) || 0),
                                            })
                                        }
                                        onFocus={selectOnFocus}
                                        required
                                        min={0}
                                        step={1}
                                        width="100%"
                                    >
                                        <NumberInput.Scrubber />
                                        <NumberInput.Input />
                                    </NumberInput.Root>
                                </GridItem>

                                <GridItem opacity={rowOpacity}>
                                    <Switch.Root
                                        colorPalette={"blue"}
                                        checked={starter.counterShadow ?? false}
                                        onCheckedChange={(e) =>
                                            updateStarter(starter.id, {
                                                counterShadow: e.checked,
                                                counterRallyOffsetSec:
                                                    starter.counterRallyOffsetSec ??
                                                    DEFAULT_COUNTER_RALLY_OFFSET_SEC,
                                            })
                                        }
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

                                <GridItem opacity={rowOpacity} width="75px">
                                    {starter.counterShadow ? (
                                        <CustomSelect
                                            label=""
                                            placeholder="Select offset"
                                            value={String(
                                                starter.counterRallyOffsetSec ??
                                                    DEFAULT_COUNTER_RALLY_OFFSET_SEC
                                            )}
                                            options={counterRallyOffsetCollection}
                                            onChange={(value) =>
                                                updateStarter(starter.id, {
                                                    counterRallyOffsetSec: Number(value),
                                                })
                                            }
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
                                        onClick={() =>
                                            setStarters(
                                                data.rallyStarters.filter(
                                                    (s) => s.id !== starter.id
                                                )
                                            )
                                        }
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
                        );
                    })}
                </Grid>
            </Box>

            <Button
                type="button"
                tabIndex={-1}
                onClick={() =>
                    setStarters([
                        ...data.rallyStarters,
                        createRallyStarter(data.rallyStarters.length),
                    ])
                }
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
