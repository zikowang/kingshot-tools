/** @format */

import { Button, HStack, Stat, Table, Text, VStack } from "@chakra-ui/react";
import { LuClipboardCopy } from "react-icons/lu";
import ReallyCountdown from "./ReallyCountdown";

const RALLY_DURATION_MS = 5 * 60 * 1000;

export type RallyStarterResult = {
    name: string;
    marchTimeSec: number;
    rallyStartTime: Date;
    active: boolean;
    counterShadow?: boolean;
    counterRallyOffsetSec?: number;
};

export type RallyTimerResult = {
    hitTime: {
        datetime: Date;
        hour: number;
        minute: number;
        second: number;
    };
    selectedQuickSetMinutes: number | null;
    rallyStarters: RallyStarterResult[];
};

function getGroupedStarters(rallyStarters: RallyStarterResult[], sortGroupsByTime = false) {
    const groups = [
        {
            title: "Rally",
            starters: rallyStarters.filter((starter) => !starter.counterShadow),
        },
        {
            title: "Counter",
            starters: rallyStarters.filter((starter) => starter.counterShadow),
        },
    ].filter((group) => group.starters.length > 0);

    if (sortGroupsByTime) {
        groups.sort(
            (left, right) =>
                left.starters[0].rallyStartTime.getTime() -
                right.starters[0].rallyStartTime.getTime()
        );
    }

    return groups;
}

const RallyTimeResult = ({ result }: { result: RallyTimerResult }) => {
    const activeStarters = result.rallyStarters
        .filter((starter) => starter.active)
        .sort((left, right) => left.rallyStartTime.getTime() - right.rallyStartTime.getTime());
    const hitTimeText = result.hitTime.datetime.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const onCopyToClipboard = () => {
        const rallyHitText = `${result.hitTime.datetime.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })} UTC - Rally Hit`;
        const groupedStarterText = getGroupedStarters(activeStarters)
            .map((group) => {
                const lines = group.starters.map(
                    (starter) =>
                        `${starter.rallyStartTime.toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                        })} UTC - ${starter.name}${starter.counterShadow ? ` (+${starter.counterRallyOffsetSec ?? 0}s)` : ""}`
                );

                return `----${group.title.toUpperCase()}----\n${lines.join("\n")}`;
            })
            .join("\n");

        navigator.clipboard.writeText(`${rallyHitText}\n\n${groupedStarterText}`);
    };

    const getStarterHitTimeText = (starter: RallyStarterResult) => {
        const starterHitTime = new Date(
            starter.rallyStartTime.getTime() + RALLY_DURATION_MS + starter.marchTimeSec * 1000
        );

        return starterHitTime.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    return (
        <VStack gap={8} alignItems="flex-start">
            <Stat.Root>
                <Stat.Label>Hit Time</Stat.Label>
                <Stat.ValueText>{hitTimeText}</Stat.ValueText>
            </Stat.Root>

            <HStack gap={8} alignItems="flex-start">
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Start</Table.ColumnHeader>
                            <Table.ColumnHeader>Hit</Table.ColumnHeader>
                            <Table.ColumnHeader>Leader</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">Start In</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {getGroupedStarters(activeStarters, true).map((group) => {
                            return [
                                <Table.Row key={`${group.title}-header`}>
                                    <Table.Cell colSpan={4}>
                                        <Text fontWeight="bold" color="blue.500">
                                            {group.title}
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>,
                                ...group.starters.map((starter) => (
                                    <Table.Row
                                        key={`${group.title}-${starter.name}-${starter.rallyStartTime.getTime()}`}
                                    >
                                        <Table.Cell>
                                            <Text fontWeight="bold">
                                                {starter.rallyStartTime.toLocaleTimeString(
                                                    undefined,
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        hour12: false,
                                                    }
                                                )}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontWeight="bold">
                                                {getStarterHitTimeText(starter)}
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontWeight="bold">{starter.name}</Text>
                                        </Table.Cell>
                                        <Table.Cell textAlign="end">
                                            <ReallyCountdown targetTime={starter.rallyStartTime} />
                                        </Table.Cell>
                                    </Table.Row>
                                )),
                            ];
                        })}
                    </Table.Body>
                </Table.Root>

                <Button
                    type="button"
                    tabIndex={-1}
                    onClick={onCopyToClipboard}
                    colorPalette={"blue"}
                    variant="outline"
                    size="md"
                    disabled={result.rallyStarters.length < 1}
                >
                    <LuClipboardCopy /> Copy
                </Button>
            </HStack>
        </VStack>
    );
};

export default RallyTimeResult;
