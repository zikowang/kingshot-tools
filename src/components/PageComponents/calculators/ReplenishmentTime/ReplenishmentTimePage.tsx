/** @format */

import ReactLayout from "@/layouts/ReactLayout";
import { Box, Button, Group, HStack, NumberInput, Stat, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuClock } from "react-icons/lu";

import { getUTC } from "../../Calendar/CalendarPage";

const ReplenishmentTimePage = () => {
    const [result, setResult] = useState(getUTC(new Date()));
    const [now, setNow] = useState(getUTC(new Date()));
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const handleUpdateNow = () => {
        setNow(getUTC(new Date()));
    };

    useEffect(() => {
        setResult(new Date(now.getTime() + minutes * 60000 + seconds * 1000));
    }, [now, minutes, seconds]);

    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Replenishment Timer
            </Text>

            <VStack justifyContent={"flex-start"} alignItems="flex-start" gap={4} mt={8}>
                <Box>
                    <Group attached justifyContent={"flex-start"} alignItems="center" gap={4}>
                        <Button
                            type="button"
                            onClick={handleUpdateNow}
                            variant="solid"
                            colorPalette="green"
                            size="md"
                        >
                            <LuClock /> Now
                        </Button>
                        <Text pl={4} fontSize={20}>
                            {now.toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: false,
                            })}
                        </Text>
                    </Group>
                </Box>

                <HStack>
                    <NumberInput.Root
                        value={String(minutes)}
                        onValueChange={(e) => {
                            const numericValue = Number(e.value);

                            if (isNaN(numericValue)) {
                                setMinutes(0);
                                return;
                            }

                            if (numericValue < 0) {
                                setMinutes(59);
                                return;
                            }

                            setMinutes(Math.abs(numericValue) % 60);
                        }}
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        width="100px"
                        required
                    >
                        <NumberInput.Label>Minutes</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>

                    <NumberInput.Root
                        value={String(seconds)}
                        onValueChange={(e) => {
                            const numericValue = Number(e.value);

                            if (isNaN(numericValue)) {
                                setSeconds(0);
                                return;
                            }

                            if (numericValue < 0) {
                                setSeconds(59);
                                return;
                            }

                            setSeconds(Math.abs(numericValue) % 60);
                        }}
                        onFocus={(e) => e.target instanceof HTMLInputElement && e.target.select()}
                        width="100px"
                        required
                    >
                        <NumberInput.Label>Seconds</NumberInput.Label>
                        <NumberInput.Scrubber />
                        <NumberInput.Input />
                    </NumberInput.Root>
                </HStack>

                <Stat.Root>
                    <Stat.Label>Result</Stat.Label>
                    <Stat.ValueText>
                        {result.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        })}
                    </Stat.ValueText>
                </Stat.Root>
            </VStack>
        </ReactLayout>
    );
};

export default ReplenishmentTimePage;
