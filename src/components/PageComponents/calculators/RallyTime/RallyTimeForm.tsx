/** @format */

import CustomSelect from "@/components/ui/select";
import {
    Box,
    Button,
    createListCollection,
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

import { useState, type FocusEvent } from "react";
import RallyTimeResult from "./RallyTimerResult";
import TimeInput from "./TimeInput";
import {
    createRallyStarter,
    DEFAULT_COUNTER_RALLY_OFFSET_SEC,
    getEarliestStarter,
    getHitTimeFromStartTime,
    getQuickSetHelpText,
    getTimeData,
    getTimeFromNow,
    type RallyStarterResult,
    type RallyTimerResult,
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
const HIT_HELP_TEXT = getQuickSetHelpText(HIT_TIME_QUICK_SET_OPTIONS.map((o) => o.label));
const START_HELP_TEXT = getQuickSetHelpText(START_TIME_QUICK_SET_OPTIONS.map((o) => o.label));

const counterRallyOffsetCollection = createListCollection({
    items: COUNTER_RALLY_OFFSET_OPTIONS.map((offsetSeconds) => ({
        label: `+${offsetSeconds}s`,
        value: String(offsetSeconds),
    })),
});

// Phone: [active][name ......][remove] / [  ][march][counter][offset]
// Desktop: one row, matching the column titles.
const STARTER_COLUMNS = {
    base: "44px minmax(0, 1fr) auto 80px",
    md: "44px minmax(0, 1.4fr) minmax(0, 1fr) 60px 80px 44px",
};
const STARTER_AREAS = {
    base: `"active name name remove" ". march counter offset"`,
    md: `"active name march counter offset remove"`,
};

const PhoneLabel = ({ children }: { children: string }) => (
    <Text hideFrom="md" fontSize="xs" color="fg.muted" mb={1}>
        {children}
    </Text>
);

const selectOnFocus = (e: FocusEvent<HTMLElement>) =>
    e.target instanceof HTMLInputElement && e.target.select();

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

    const handleSetInputTime = (newInputTime: Date) => {
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
                <TimeInput
                    label={isStartMode ? "Earliest start" : "Hit time"}
                    value={inputTime.datetime}
                    onChange={handleSetInputTime}
                />

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

            <VStack maxWidth="600px" width="100%" gap={{ base: 3, md: 2 }} alignItems="stretch">
                {/* Column titles: desktop only. Phones show a small label per field. */}
                <Grid hideBelow="md" gridTemplateColumns={STARTER_COLUMNS.md} gap={4} fontSize={14}>
                    <GridItem />
                    <GridItem>Leader</GridItem>
                    <GridItem>March Time (s)</GridItem>
                    <GridItem>Counter</GridItem>
                    <GridItem>Offset</GridItem>
                    <GridItem />
                </Grid>

                {data.rallyStarters.map((starter, index) => {
                    const rowOpacity = starter.active ? 1 : 0.4;

                    return (
                        // Phone: a small card in two rows. Desktop: one table-like row.
                        <Grid
                            key={starter.id}
                            gridTemplateColumns={STARTER_COLUMNS}
                            gridTemplateAreas={STARTER_AREAS}
                            gap={{ base: 2, md: 4 }}
                            alignItems="center"
                            borderWidth={{ base: "1px", md: 0 }}
                            borderRadius="md"
                            p={{ base: 3, md: 0 }}
                        >
                            <GridItem gridArea="active">
                                <Switch.Root
                                    colorPalette={"green"}
                                    checked={starter.active ?? true}
                                    onCheckedChange={(e) =>
                                        updateStarter(starter.id, { active: e.checked })
                                    }
                                    aria-label="Active"
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Root>
                            </GridItem>

                            <GridItem gridArea="name" opacity={rowOpacity} minWidth={0}>
                                <Input
                                    value={starter.name}
                                    placeholder={`Name Starter ${index + 1}`}
                                    aria-label="Leader name"
                                    onChange={(e) =>
                                        updateStarter(starter.id, { name: e.target.value })
                                    }
                                    onFocus={selectOnFocus}
                                />
                            </GridItem>

                            <GridItem gridArea="march" opacity={rowOpacity} minWidth={0}>
                                <PhoneLabel>March (s)</PhoneLabel>
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
                                    <NumberInput.Input
                                        inputMode="numeric"
                                        aria-label="March time in seconds"
                                    />
                                </NumberInput.Root>
                            </GridItem>

                            <GridItem gridArea="counter" opacity={rowOpacity}>
                                <PhoneLabel>Counter</PhoneLabel>
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
                                    aria-label="Counter rally"
                                    height="40px"
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control>
                                        <Switch.Thumb />
                                    </Switch.Control>
                                </Switch.Root>
                            </GridItem>

                            <GridItem gridArea="offset" opacity={rowOpacity}>
                                <PhoneLabel>Offset</PhoneLabel>
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
                                        alignItems="center"
                                        justifyContent="center"
                                        height="40px"
                                    >
                                        <Text fontSize={12} color="gray.400">
                                            Not counter
                                        </Text>
                                    </Box>
                                )}
                            </GridItem>

                            <GridItem gridArea="remove" justifySelf="end">
                                <Button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() =>
                                        setStarters(
                                            data.rallyStarters.filter((s) => s.id !== starter.id)
                                        )
                                    }
                                    colorPalette={"red"}
                                    variant="ghost"
                                    size="md"
                                    aria-label="Remove leader"
                                    disabled={data.rallyStarters.length === 1}
                                >
                                    <LuUserRoundMinus />
                                </Button>
                            </GridItem>
                        </Grid>
                    );
                })}
            </VStack>

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
