/** @format */

import { allEvents } from "@/data/events";
import ReactLayout from "@/layouts/ReactLayout";
import type { Event } from "@/types/events";
import { Box, Grid, GridItem, Image } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

const intervalDays = new Array(28).fill(0).map((_, i) => i + 1);
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const serverStartDate = new Date("2025-05-30");
const intervalStartDate = new Date("2025-08-18 00:00:00");

function getUTC(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

function getServerDay() {
    return Math.floor((new Date().getTime() - serverStartDate.getTime()) / (1000 * 60 * 60 * 24));
}

function getIntervalDay() {
    return (
        Math.ceil((new Date().getTime() - intervalStartDate.getTime()) / (1000 * 60 * 60 * 24)) % 28
    );
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
            {intervalDays.map((day) => {
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
    const now = new Date();
    const intervalDay = getIntervalDay();

    console.log("UTC", now.toISOString());
    console.log("UTC 2", getUTC(now));
    console.log("First part", now.toISOString().split(".").at(0));
    console.log("new Date", new Date(now.toISOString().split(".").at(0) as string));

    console.log((now.getTime() - intervalStartDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <>
            {intervalDays.map((day) => {
                return (
                    <CalendarCell
                        key={`calendar-header-day-${day}`}
                        isActiveDay={intervalDay === day}
                    >
                        {weekDays[day % 7]}
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
            {intervalDays.map((day) => {
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
                    templateColumns={`repeat(${intervalDays.length}, 50px)`}
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
