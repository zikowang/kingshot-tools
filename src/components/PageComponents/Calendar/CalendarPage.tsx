/** @format */

import { useColorModeValue } from "@/components/ui/color-mode";
import { allEvents } from "@/data/events";
import ReactLayout from "@/layouts/ReactLayout";
import type { Event } from "@/types/events";
import { Box, HStack, Image, Popover, Portal, Table, Text } from "@chakra-ui/react";
import { useMemo, type PropsWithChildren } from "react";

const INTERVAL_SIZE = 28;
const INTERVAL_DAYS = new Array(INTERVAL_SIZE).fill(0).map((_, i) => i + 1);
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SERVER_START_DATE = getUTC(new Date("2025-05-30T00:00:00.000Z"));
const FIRST_DAY_AFTER_FIRST_KVK = getUTC(new Date("2025-08-18T00:00:00.000Z"));

const LOCAL_NOW = new Date();
const UTC_START_OF_TODAY = getUTC(new Date(`${LOCAL_NOW.toISOString().split("T")[0]}`));

const firstColumnWidth = { base: "100px", md: "200px" };

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
        <Table.Cell
            textAlign="center"
            bgColor={isActiveDay ? activeBgColor : "transparent"}
            width={12}
            height={12}
            padding={0}
        >
            {children}
        </Table.Cell>
    );
};

const CalendarRow = ({ event }: { event: Event }) => {
    const intervalDay = getIntervalDay();

    return (
        <Table.Row>
            <Table.Cell
                key={`legend-${event.id}`}
                bgColor={event.color}
                height={12}
                width={firstColumnWidth}
                data-sticky="end"
                left="0"
                padding={0}
            >
                <HStack bgColor={event.color} height={12}>
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
                </HStack>
            </Table.Cell>

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
        </Table.Row>
    );
};

const CalendarPage = () => {
    const intervalDay = getIntervalDay();

    return (
        <ReactLayout>
            <Table.ScrollArea borderWidth="1px" rounded="md" height="calc(100vh - 120px)">
                <Table.Root
                    size="sm"
                    stickyHeader
                    css={{
                        "& [data-sticky]": {
                            position: "sticky",
                            zIndex: 0,
                            bg: "bg",

                            _after: {
                                content: '""',
                                position: "absolute",
                                pointerEvents: "none",
                                top: "0",
                                bottom: "-1px",
                                width: "32px",
                            },
                        },

                        "& [data-sticky=end]": {
                            _after: {
                                insetInlineEnd: "0",
                                translate: "100% 0",
                                shadow: "inset 8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
                            },
                        },

                        "& [data-sticky=start]": {
                            _after: {
                                insetInlineStart: "0",
                                translate: "-100% 0",
                                shadow: "inset -8px 0px 8px -8px rgba(0, 0, 0, 0.16)",
                            },
                        },
                    }}
                >
                    <Table.Header>
                        <Table.Row bg="bg.subtle">
                            <Table.ColumnHeader
                                data-sticky="end"
                                left="0"
                                zIndex={2}
                                minW={firstColumnWidth}
                            >
                                <Box left="0" zIndex={20} position="absolute">
                                    #351
                                </Box>
                            </Table.ColumnHeader>
                            {INTERVAL_DAYS.map((day) => {
                                if (day % 7 !== 1) {
                                    return null;
                                }

                                const week = (day - 1) / 7 + 1;
                                const kvkRotationNumber = getKvKRotationNumber(week);

                                return (
                                    <Table.ColumnHeader
                                        key={`calendar-header-week-${day}`}
                                        colSpan={7}
                                        height={12}
                                        bgColor={week % 2 === 0 ? "gray" : "darkgray"}
                                    >
                                        {`KvK ${kvkRotationNumber} (Week ${week})`}
                                    </Table.ColumnHeader>
                                );
                            })}
                        </Table.Row>

                        <Table.Row bg="bg.subtle">
                            <Table.ColumnHeader
                                data-sticky="end"
                                left="0"
                                zIndex={2}
                                height={12}
                                minW={firstColumnWidth}
                            >
                                <Box left="0" zIndex={20} position="absolute">
                                    day 21
                                </Box>
                            </Table.ColumnHeader>

                            {INTERVAL_DAYS.map((day) => {
                                const isActiveDay = intervalDay === day;

                                return (
                                    <Table.ColumnHeader
                                        key={`calendar-header-day-${day}`}
                                        height={12}
                                        bgColor={isActiveDay ? "lightgrey" : "darkgrey"}
                                    >
                                        {WEEK_DAYS[day % 7]}
                                    </Table.ColumnHeader>
                                );
                            })}
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {allEvents.map((event) => {
                            return <CalendarRow key={event.id} event={event} />;
                        })}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </ReactLayout>
    );
};

export default CalendarPage;
