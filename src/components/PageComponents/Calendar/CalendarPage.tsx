/** @format */

import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { allEvents } from "@/data/events";
import ReactLayout from "@/layouts/ReactLayout";
import type { Event } from "@/types/events";
import {
    Box,
    Button,
    CloseButton,
    Drawer,
    HStack,
    Image,
    List,
    ListItem,
    Portal,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, type PropsWithChildren } from "react";

const INTERVAL_SIZE = 28;
const INTERVAL_DAYS = new Array(INTERVAL_SIZE).fill(0).map((_, i) => i + 1);
const SERVER_START_DATE = getUTC(new Date("2025-05-30T00:00:00.000Z"));
const FIRST_DAY_AFTER_FIRST_KVK = getUTC(new Date("2025-08-18T00:00:00.000Z"));

const LOCAL_NOW = new Date();
const UTC_START_OF_TODAY = getUTC(new Date(`${LOCAL_NOW.toISOString().split("T")[0]}`));

const firstColumnWidth = { base: "100px", md: "200px" };

export function getUTC(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

export function getIsWinterTime() {
    const test = Array.from({ length: 12 }, (_, i) => {
        return new Date(`2025-${String(i + 1).padStart(2, "0")}-01`).getTimezoneOffset();
    });
    const min = Math.min(...test);
    const max = Math.max(...test);
    const hasDTS = min !== max;
    const currentOffset = LOCAL_NOW.getTimezoneOffset();
    const result = hasDTS && currentOffset === max;

    return result;
}

function getServerDay() {
    const result = Math.floor(
        (UTC_START_OF_TODAY.getTime() - SERVER_START_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );

    return result;
}

function getIntervalDay() {
    const isWinterTime = getIsWinterTime();
    const daysSinceServerStart = Math.ceil(
        (UTC_START_OF_TODAY.getTime() - FIRST_DAY_AFTER_FIRST_KVK.getTime()) / (1000 * 60 * 60 * 24)
    );

    const result = (daysSinceServerStart % INTERVAL_SIZE) + (isWinterTime ? 0 : 1);

    return result || INTERVAL_SIZE;
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

function getDayDiffsForDate(day: number): [string, Date] {
    const intervalDay = getIntervalDay();

    const diff = intervalDay - day;

    if (diff === 0) {
        return ["Today", new Date()];
    }

    if (diff === -1) {
        return ["Tomorrow", new Date(Date.now() + 86400000)];
    }

    if (diff < 0) {
        return [`in ${Math.abs(diff)} days`, new Date(Date.now() + Math.abs(diff) * 86400000)];
    }

    return [`in ${28 - diff} days`, new Date(Date.now() + (28 - diff) * 86400000)];
}

const EventInformationPopover = ({
    event,
    isActive,
    isActiveDay,
    date,
    dayDiffText,
}: {
    event: Event;
    isActive: boolean;
    isActiveDay: boolean;
    date?: Date;
    dayDiffText?: string;
}) => {
    return (
        <Drawer.Root size="sm" placement={{ mdDown: "bottom", md: "end" }}>
            <Drawer.Trigger asChild>
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
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content mx={{ mdDown: "auto", md: "unset" }}>
                        <Drawer.Header>
                            <HStack>
                                <Image src={event.image} alt={event.name} width={12} />
                                <VStack alignItems="flex-start">
                                    <Text fontSize={20} fontWeight="bold">{`${event.name}`}</Text>
                                    {date && dayDiffText ? (
                                        <Text>
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
                                    ) : null}
                                </VStack>
                            </HStack>
                        </Drawer.Header>
                        <Drawer.Body>
                            {event.rewards && event.rewards.length > 0 && (
                                <>
                                    <Text fontWeight="bold" my={2}>
                                        Rewards
                                    </Text>
                                    <List.Root ps={4}>
                                        {event.rewards.map((reward) => (
                                            <ListItem key={reward.name}>
                                                <HStack>
                                                    <Text>{reward.name}</Text>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List.Root>
                                </>
                            )}
                            {event.todo && event.todo.length > 0 && (
                                <>
                                    <Text fontWeight="bold" my={2}>
                                        Todos
                                    </Text>
                                    <List.Root ps={4}>
                                        {event.todo.map((todo) => (
                                            <ListItem key={`${event.id}-${todo}`}>
                                                <HStack>
                                                    <Text>{todo}</Text>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List.Root>
                                </>
                            )}
                            {event.optionalTodo && event.optionalTodo.length > 0 && (
                                <>
                                    <Text fontWeight="bold" my={2}>
                                        Optional Todos
                                    </Text>
                                    <List.Root ps={4}>
                                        {event.optionalTodo.map((optionalTodo) => (
                                            <ListItem key={`${event.id}-${optionalTodo}`}>
                                                <HStack>
                                                    <Text>{optionalTodo}</Text>
                                                </HStack>
                                            </ListItem>
                                        ))}
                                    </List.Root>
                                </>
                            )}
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Drawer.ActionTrigger asChild>
                                <Button variant="outline" colorPalette="red">
                                    Close
                                </Button>
                            </Drawer.ActionTrigger>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};

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
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width={{ base: "100px", md: "unset" }}
                        px={1}
                        _hover={{ cursor: "pointer" }}
                    >
                        <EventInformationPopover event={event} isActive={true} isActiveDay={true} />
                    </Box>
                    <Text ml={1} display={{ base: "none", md: "block" }} flexGrow={1}>
                        {event.shortName}
                    </Text>
                </HStack>
            </Table.Cell>

            {INTERVAL_DAYS.map((day) => {
                const isActive = event.days.includes(day);
                const isActiveDay = intervalDay === day;
                const [dayDiffText, date] = useMemo(
                    () => getDayDiffsForDate(day),
                    [intervalDay, day]
                );

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
                        <EventInformationPopover
                            event={event}
                            isActive={isActive}
                            isActiveDay={isActiveDay}
                            dayDiffText={dayDiffText}
                            date={date}
                        />
                    </CalendarCell>
                );
            })}
        </Table.Row>
    );
};

const CalendarDaysHeader = () => {
    const intervalDay = getIntervalDay();
    const { colorMode } = useColorMode();

    return (
        <Table.Row bg="bg.subtle" zIndex={10}>
            <Table.ColumnHeader
                bgColor={"transparent"}
                data-sticky="end"
                height={16}
                left={0}
                top={0}
                minW={firstColumnWidth}
            >
                <HStack alignItems="baseline">
                    <Text>Day:</Text>
                    <Text fontWeight="bold" fontSize={20}>
                        {getServerDay()}
                    </Text>
                </HStack>
            </Table.ColumnHeader>

            {INTERVAL_DAYS.map((day) => {
                const isActiveDay = intervalDay === day;
                const [_, date] = useMemo(() => getDayDiffsForDate(day), [intervalDay, day]);

                return (
                    <Table.ColumnHeader
                        key={`calendar-header-day-${day}`}
                        height={12}
                        bgColor={
                            isActiveDay
                                ? colorMode === "light"
                                    ? "lightgrey"
                                    : "grey"
                                : "transparent"
                        }
                    >
                        <VStack gap={0}>
                            <Text fontWeight="bold">
                                {date.toLocaleDateString(undefined, {
                                    weekday: "short",
                                })}
                            </Text>
                            <Text>
                                {date.toLocaleDateString(undefined, {
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </Text>
                        </VStack>
                    </Table.ColumnHeader>
                );
            })}
        </Table.Row>
    );
};

const CalendarPage = () => {
    const calendarRef = useRef<HTMLDivElement>(null);

    const intervalDay = getIntervalDay();

    useEffect(() => {
        if (intervalDay <= 3) {
            return;
        }

        if (calendarRef.current) {
            const scrollTo = (intervalDay - 1) * 50 + 25;

            calendarRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    }, [intervalDay]);

    return (
        <ReactLayout>
            <Text textStyle="3xl" fontWeight="bold">
                Calendar #351
            </Text>

            <Table.ScrollArea height="calc(100vh - 210px)" ref={calendarRef} mt={8}>
                <Table.Root
                    size="sm"
                    showColumnBorder
                    stickyHeader
                    css={{
                        "& [data-sticky]": {
                            position: "sticky",
                            zIndex: 1,
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
                        {/* <CalendarWeeksHeader /> */}

                        <CalendarDaysHeader />
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
