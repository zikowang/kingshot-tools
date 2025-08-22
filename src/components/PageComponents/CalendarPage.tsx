/** @format */

import { allEvents } from "@/data/events";
import ReactLayout from "@/layouts/ReactLayout";
import type { Event } from "@/types/events";
import { Box, Grid, GridItem, Image } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

const INTERVAL_DAYS = new Array(28).fill(0).map((_, i) => i + 1);
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SERVER_START_DATE = getUTC(new Date("2025-05-30T00:00:00.000Z"));
const INTERVAL_START_DATE = getUTC(new Date("2025-08-18T00:00:00.000Z"));

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
        (UTC_START_OF_TODAY.getTime() - INTERVAL_START_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );

    const result = (daysSinceServerStart % 28) + 1;

    return result;
}

const CalendarCell = ({
    isActiveDay,
    bgColor = "transparent",
    children,
}: { isActiveDay: boolean; bgColor?: string } & PropsWithChildren) => {
    return (
        <GridItem
            textAlign="center"
            outline={isActiveDay ? "1px solid gray" : "none"}
            bgColor={bgColor}
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
                        {`Week ${week}`}
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

                if (!isActive) {
                    return (
                        <CalendarCell
                            key={`${event.id}-${day}`}
                            isActiveDay={intervalDay === day}
                            bgColor={isActive ? event.color : "transparent"}
                        />
                    );
                }

                return (
                    <CalendarCell
                        key={`${event.id}-${day}`}
                        isActiveDay={intervalDay === day}
                        bgColor={isActive ? event.color : "transparent"}
                    >
                        <Image src={event.image} alt={event.name} width={8} />
                    </CalendarCell>
                );
            })}
        </>
    );
};

const CalendarPage = () => {
    const serverDay = getServerDay();

    return (
        <ReactLayout>
            <Box>{`Server Day: ${serverDay}`}</Box>

            <Box display="flex" gap={1} overflowX="hidden">
                <Box display="flex" flexDirection="column" gap={1}>
                    <Box height={12} />
                    <Box height={12} />

                    {allEvents.map((event) => {
                        return (
                            <Box
                                display="flex"
                                alignItems="center"
                                bgColor={event.color}
                                height={12}
                                width="200px"
                                key={`legend-${event.id}`}
                            >
                                <Image src={event.image} alt={event.name} width={8} />
                                <Box>{event.shortName}</Box>
                            </Box>
                        );
                    })}
                </Box>

                <Grid
                    templateColumns={`repeat(${INTERVAL_DAYS.length}, 50px)`}
                    gridColumnGap={1}
                    gridRowGap={1}
                    overflowX="scroll"
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
