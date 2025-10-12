/** @format */

import {
    Box,
    Button,
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

const QUICK_SET_MINUTES = 7;
const DEFAULT_RALLY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const defaultRallyStarter: RallyStarterResult = {
    name: "Starter 1",
    marchTimeSec: 60,
    rallyStartTime: new Date(),
    active: true,
};

function getHitTimeData(value?: Date, isUtc = false) {
    const now = !isUtc ? getUTC(value ?? new Date()) : (value ?? new Date());
    const defaultSet = new Date(now.getTime() + QUICK_SET_MINUTES * 60000); // 7 minutes later
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
    const handleQuickSetTime = () => {
        const updatedRallyHit = getHitTimeData();

        updateData({
            ...data,
            hitTime: updatedRallyHit,
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
            <HStack justifyContent={"flex-start"} alignItems="flex-end">
                <Button
                    type="button"
                    onClick={handleQuickSetTime}
                    variant="solid"
                    colorPalette="green"
                    size="md"
                >
                    <LuClock /> Quick Set
                </Button>
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
            <Text fontSize={12} color="gray.400">
                The "Quick Set" button will add {QUICK_SET_MINUTES} minutes to the current time
            </Text>

            <Separator size="lg" width="100%" />

            <RallyTimeResult result={data} />

            <Separator size="lg" width="100%" />

            <Box maxWidth="600px" width="100%">
                <Grid
                    gap={4}
                    gridTemplateColumns={"auto 1fr 1fr auto"}
                    width="100%"
                    alignItems={"center"}
                >
                    <GridItem></GridItem>
                    <GridItem fontSize={14}>Rally Starter</GridItem>
                    <GridItem fontSize={14}>Rally March Time (seconds)</GridItem>
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
                            >
                                <Switch.HiddenInput />
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label />
                            </Switch.Root>
                            <GridItem>
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

                            <GridItem>
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
                                    size="md"
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
