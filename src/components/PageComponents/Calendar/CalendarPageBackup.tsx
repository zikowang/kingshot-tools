/** @format */

import { allEvents } from "@/data/events";
import ReactLayout from "@/layouts/ReactLayout";
import type { Event } from "@/types/events";
import {
    Badge,
    Box,
    Grid,
    GridItem,
    HStack,
    Image,
    Popover,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, type PropsWithChildren } from "react";
import { useColorModeValue } from "../../ui/color-mode";

const INTERVAL_SIZE = 28;
const INTERVAL_DAYS = new Array(INTERVAL_SIZE).fill(0).map((_, i) => i + 1);
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SERVER_START_DATE = getUTC(new Date("2025-05-30T00:00:00.000Z"));
const FIRST_DAY_AFTER_FIRST_KVK = getUTC(new Date("2025-08-18T00:00:00.000Z"));

const LOCAL_NOW = new Date();
const UTC_START_OF_TODAY = getUTC(new Date(`${LOCAL_NOW.toISOString().split("T")[0]}`));

function getUTC(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

function getServerDay() {
    const result = Math.floor(
        (UTC_START_OF_TODAY.getTime() - SERVER_START_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );

    return result;
}

function getIntervalDay() {
    const daysSinceServerStart = Math.ceil(
        (UTC_START_OF_TODAY.getTime() - FIRST_DAY_AFTER_FIRST_KVK.getTime()) / (1000 * 60 * 60 * 24)
    );

    const result = (daysSinceServerStart % INTERVAL_SIZE) + 1;

    return result;
}

function getKvKRotationNumber(currentWeekNumber: number) {
    const intervalDay = getIntervalDay();
    const intervalWeek = Math.ceil(intervalDay / 7);
    const isNextKvK = intervalWeek > currentWeekNumber;

    const result =
        Math.ceil(
            (FIRST_DAY_AFTER_FIRST_KVK.getTime() - UTC_START_OF_TODAY.getTime()) /
                (1000 * 60 * 60 * 24) /
                INTERVAL_SIZE
        ) + (isNextKvK ? 3 : 2);

    return result;
}

const CalendarCell = ({ isActiveDay, children }: { isActiveDay: boolean } & PropsWithChildren) => {
    const activeBgColor = useColorModeValue("lightgrey", "grey");

    return (
        <GridItem
            textAlign="center"
            bgColor={isActiveDay ? activeBgColor : "transparent"}
            width="100%"
            height={12}
            alignItems="center"
            justifyContent="center"
            display="flex"
        >
            {children}
        </GridItem>
    );
};

const CalendarWeeks = () => {
    return (
        <>
            {INTERVAL_DAYS.map((day) => {
                if (day % 7 !== 1) {
                    return null;
                }

                const week = (day - 1) / 7 + 1;
                const kvkRotationNumber = getKvKRotationNumber(week);

                return (
                    <GridItem
                        key={`calendar-header-week-${day}`}
                        gridColumnStart={"span 7"}
                        height={12}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgColor={week % 2 === 0 ? "gray" : "darkgray"}
                    >
                        {`KvK ${kvkRotationNumber} (Week ${week})`}
                    </GridItem>
                );
            })}
        </>
    );
};

const CalendarDays = () => {
    const intervalDay = getIntervalDay();

    return (
        <>
            {INTERVAL_DAYS.map((day) => {
                return (
                    <CalendarCell
                        key={`calendar-header-day-${day}`}
                        isActiveDay={intervalDay === day}
                    >
                        {WEEK_DAYS[day % 7]}
                    </CalendarCell>
                );
            })}
        </>
    );
};

const CalendarRow = ({ event }: { event: Event }) => {
    const intervalDay = getIntervalDay();

    return (
        <>
            {INTERVAL_DAYS.map((day) => {
                const isActive = event.days.includes(day);
                const isActiveDay = intervalDay === day;
                const [dayDiffText, date] = useMemo(() => {
                    const diff = intervalDay - day;

                    if (diff === 0) {
                        return ["Today", new Date()];
                    }

                    if (diff === -1) {
                        return ["Tomorrow", new Date(Date.now() + 86400000)];
                    }

                    if (diff < 0) {
                        return [
                            `in ${Math.abs(diff)} days`,
                            new Date(Date.now() + Math.abs(diff) * 86400000),
                        ];
                    }

                    return [`in ${28 - diff} days`, new Date(Date.now() + (28 - diff) * 86400000)];
                }, [intervalDay, day]);

                if (!isActive) {
                    return (
                        <CalendarCell
                            key={`${event.id}-${day}`}
                            isActiveDay={intervalDay === day}
                        />
                    );
                }

                return (
                    <CalendarCell key={`${event.id}-${day}`} isActiveDay={intervalDay === day}>
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    width="100%"
                                    height="100%"
                                    bgColor={isActive ? event.color : "transparent"}
                                    opacity={isActiveDay ? 1 : 0.4}
                                    _hover={{ opacity: 1, cursor: "pointer" }}
                                    transition="opacity 0.2s ease-in-out"
                                >
                                    <Image src={event.image} alt={event.name} width={8} />
                                </Box>
                            </Popover.Trigger>
                            <Portal>
                                <Popover.Positioner>
                                    <Popover.Content>
                                        <Popover.Arrow />
                                        <Popover.Body>
                                            <Popover.Title fontWeight="medium">
                                                <HStack>
                                                    <Image
                                                        src={event.image}
                                                        alt={event.name}
                                                        width={8}
                                                    />
                                                    {`${event.name}`}
                                                </HStack>
                                            </Popover.Title>
                                            <Text my="4">
                                                {` ${dayDiffText} (${date.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        weekday: "long",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    }
                                                )})`}
                                            </Text>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover.Positioner>
                            </Portal>
                        </Popover.Root>
                    </CalendarCell>
                );
            })}
        </>
    );
};

const CalendarPage = () => {
    const calendarRef = useRef<HTMLDivElement>(null);

    const serverDay = getServerDay();
    const intervalDay = getIntervalDay();

    useEffect(() => {
        if (calendarRef.current) {
            const scrollTo = (intervalDay - 1) * 50 - 100;

            calendarRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    }, [intervalDay]);

    return (
        <ReactLayout>
            <Box display="flex" gap={1} overflowX="hidden">
                <Box display="flex" flexDirection="column" gap={1}>
                    <VStack
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={0}
                        height={12}
                    >
                        <Text fontWeight="bold" fontSize={20}>
                            #{`351`}
                        </Text>
                        <Badge colorPalette="blue" variant="subtle">
                            <Text fontWeight="bold">{`Day`}</Text>
                            <Text fontWeight="bold" ml={2} fontSize={16}>
                                {serverDay}
                            </Text>
                        </Badge>
                    </VStack>

                    <Box height={12} />

                    {allEvents.map((event) => {
                        return (
                            <Box
                                key={`legend-${event.id}`}
                                display="flex"
                                alignItems="center"
                                justifyContent={{ base: "center", md: "flex-start" }}
                                bgColor={event.color}
                                height={12}
                                width={{ base: "100px", md: "200px" }}
                            >
                                <Popover.Root>
                                    <Popover.Trigger asChild>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            width={{ base: "100px", md: "unset" }}
                                            px={1}
                                            _hover={{ cursor: "pointer" }}
                                        >
                                            <Image src={event.image} alt={event.name} width={8} />
                                        </Box>
                                    </Popover.Trigger>
                                    <Portal>
                                        <Popover.Positioner>
                                            <Popover.Content>
                                                <Popover.Arrow />
                                                <Popover.Body>
                                                    <Popover.Title fontWeight="medium">
                                                        <HStack>
                                                            <Image
                                                                src={event.image}
                                                                alt={event.name}
                                                                width={8}
                                                            />
                                                            {`${event.name}`}
                                                        </HStack>
                                                    </Popover.Title>
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover.Positioner>
                                    </Portal>
                                </Popover.Root>
                                <Text ml={1} display={{ base: "none", md: "block" }}>
                                    {event.shortName}
                                </Text>
                            </Box>
                        );
                    })}
                </Box>

                <Grid
                    templateColumns={`repeat(${INTERVAL_DAYS.length}, 50px)`}
                    gridColumnGap={1}
                    gridRowGap={1}
                    overflowX="scroll"
                    ref={calendarRef}
                >
                    <CalendarWeeks />

                    <CalendarDays />

                    {allEvents.map((event) => {
                        return <CalendarRow key={event.id} event={event} />;
                    })}
                </Grid>
            </Box>
        </ReactLayout>
    );
};

export default CalendarPage;
