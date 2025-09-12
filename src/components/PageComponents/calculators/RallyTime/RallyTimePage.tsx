/** @format */

import ReactLayout from "@/layouts/ReactLayout";
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
    Stat,
    Switch,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuClipboardCopy, LuUserPlus, LuUserRoundMinus } from "react-icons/lu";

import { Fragment, useEffect, useState } from "react";
import { getUTC } from "../../Calendar/CalendarPage";

type RallyStarterResult = {
    name: string;
    marchTimeSec: number;
    rallyStartTime: Date;
    active: boolean;
};

type RallyTimerResult = {
    hitTime: Date;
    rallyStarters: RallyStarterResult[];
};

function getHitTimeData(value?: Date) {
    const now = getUTC(value ?? new Date());
    const defaultSet = new Date(now.getTime() + 7 * 60000); // 5 minutes later
    const hour = defaultSet.getHours();
    const minute = defaultSet.getMinutes();
    const second = defaultSet.getSeconds();

    return { hit: defaultSet, hour, minute, second };
}

const defaultRallyStarter: RallyStarterResult = {
    name: "Starter 1",
    marchTimeSec: 60,
    rallyStartTime: new Date(),
    active: true,
};

function loadPreset() {
    const preset = JSON.parse(localStorage.getItem(`presets.rallyTime`) || "[]");

    if (!preset?.length) {
        return null;
    }

    return preset as RallyStarterResult[];
}

function savePreset(starters: RallyStarterResult[]) {
    localStorage.setItem(`presets.rallyTime`, JSON.stringify(starters));
}

const RallyTimePage = () => {
    const [result, setResult] = useState<RallyTimerResult>(() => {
        const { hit } = getHitTimeData();

        return {
            hitTime: hit,
            rallyStarters: [defaultRallyStarter],
        };
    });

    const [rallyHit, setRallyHit] = useState(() => getHitTimeData());
    const [rallyStarters, setRallyStarters] = useState<RallyStarterResult[]>(
        () => loadPreset() || [defaultRallyStarter]
    );

    const handleQuickSetTime = () => {
        const updatedRallyHit = getHitTimeData();
        setRallyHit(updatedRallyHit);
    };

    const handleUpdateRallyHit = (key: "hour" | "minute" | "second", value: number) => {
        setRallyHit((prev) => {
            const newHitTime = new Date(prev.hit);
            if (key === "hour") {
                newHitTime.setUTCHours(value);
            } else if (key === "minute") {
                newHitTime.setUTCMinutes(value);
            } else if (key === "second") {
                newHitTime.setUTCSeconds(value);
            }
            return { ...prev, hit: newHitTime, [key]: value };
        });
    };

    const onCopyToClipboard = () => {
        const rallyHitText = `${result.hitTime.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })} UTC - Rally Hit`;

        const starterText = result.rallyStarters
            .map(
                (starter) =>
                    `${starter.rallyStartTime.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    })} UTC - ${starter.name}`
            )
            .join("\n");

        navigator.clipboard.writeText(`${rallyHitText}\n\n${starterText}`);
    };

    useEffect(() => {
        const updatedStarters = rallyStarters
            .filter((starter) => starter.active)
            .map((starter) => {
                const rallyStartTime = new Date(
                    rallyHit.hit.getTime() - starter.marchTimeSec * 1000
                );
                return { ...starter, rallyStartTime };
            });

        setResult({
            hitTime: rallyHit.hit,
            rallyStarters: updatedStarters,
        });

        savePreset(rallyStarters);
    }, [rallyHit, rallyStarters]);

    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Rally Timer
            </Text>

            <VStack justifyContent={"flex-start"} alignItems="flex-start" gap={4} mt={8}>
                <HStack justifyContent={"flex-start"} alignItems="flex-end">
                    <Button
                        type="button"
                        onClick={handleQuickSetTime}
                        variant="solid"
                        colorPalette="green"
                        size="md"
                    >
                        Quick Set
                    </Button>
                    <NumberInput.Root
                        value={String(rallyHit.hour)}
                        onValueChange={(e) =>
                            handleUpdateRallyHit("hour", Number(e.value) >= 0 ? Number(e.value) : 0)
                        }
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        required
                        min={0}
                    >
                        <NumberInput.Label>Hour</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    <NumberInput.Root
                        value={String(rallyHit.minute)}
                        onValueChange={(e) =>
                            handleUpdateRallyHit(
                                "minute",
                                Number(e.value) >= 0 ? Number(e.value) : 0
                            )
                        }
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        required
                        min={0}
                    >
                        <NumberInput.Label>Minute</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    <NumberInput.Root
                        value={String(rallyHit.second)}
                        onValueChange={(e) =>
                            handleUpdateRallyHit(
                                "second",
                                Number(e.value) >= 0 ? Number(e.value) : 0
                            )
                        }
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        required
                        min={0}
                        step={1}
                    >
                        <NumberInput.Label>Second</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </HStack>

                <Separator size="lg" width="100%" />

                <HStack gap={8} my={8}>
                    <Stat.Root>
                        <Stat.Label>Hit time</Stat.Label>
                        <Stat.ValueText>
                            {result.hitTime.toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: false,
                            })}
                        </Stat.ValueText>
                    </Stat.Root>

                    <VStack width="100%" alignItems="flex-start">
                        {result.rallyStarters.map((starter, index) => (
                            <HStack key={index} gap={2}>
                                <Text>
                                    {starter.rallyStartTime.toLocaleTimeString(undefined, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                    })}
                                </Text>
                                <Text>{starter.name}</Text>
                            </HStack>
                        ))}
                    </VStack>
                    <Button
                        type="button"
                        tabIndex={-1}
                        onClick={onCopyToClipboard}
                        colorPalette={"blue"}
                        variant="outline"
                        size="md"
                        disabled={rallyStarters.length === 1}
                    >
                        <LuClipboardCopy /> Copy
                    </Button>
                </HStack>

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
                        {rallyStarters.map((starter, index) => (
                            <Fragment key={index}>
                                <Switch.Root
                                    colorPalette={"green"}
                                    checked={starter.active ?? true}
                                    onCheckedChange={(e) => {
                                        const newActive = e.checked;
                                        setRallyStarters((prev) => {
                                            const updatedStarters = [...prev];
                                            updatedStarters[index] = {
                                                ...updatedStarters[index],
                                                active: newActive,
                                            };
                                            return updatedStarters;
                                        });
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
                                                setRallyStarters((prev) => {
                                                    const updatedStarters = [...prev];
                                                    updatedStarters[index] = {
                                                        ...updatedStarters[index],
                                                        name: newName,
                                                    };
                                                    return updatedStarters;
                                                });
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
                                        onValueChange={(e) =>
                                            setRallyStarters((prev) => {
                                                const updatedStarters = [...prev];
                                                updatedStarters[index] = {
                                                    ...updatedStarters[index],
                                                    marchTimeSec:
                                                        Number(e.value) >= 0 ? Number(e.value) : 0,
                                                };
                                                return updatedStarters;
                                            })
                                        }
                                        onFocus={(e) =>
                                            e.target instanceof HTMLInputElement &&
                                            e.target.select()
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
                                        onClick={() =>
                                            setRallyStarters((prev) => [
                                                ...prev.filter((_, i) => i !== index),
                                            ])
                                        }
                                        colorPalette={"red"}
                                        variant="ghost"
                                        size="md"
                                        disabled={rallyStarters.length === 1}
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
                    onClick={() =>
                        setRallyStarters((prev) => {
                            const newStarter: RallyStarterResult = {
                                ...defaultRallyStarter,
                                name: `Starter ${prev.length + 1}`,
                            };

                            return [...prev, newStarter];
                        })
                    }
                    colorPalette={"green"}
                    variant="ghost"
                    size="md"
                >
                    <LuUserPlus /> Add Starter
                </Button>
            </VStack>
        </ReactLayout>
    );
};

export default RallyTimePage;
