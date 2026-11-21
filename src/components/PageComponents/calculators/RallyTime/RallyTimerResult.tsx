/** @format */

import { formatUtcTime } from "@/lib/time";
import { useNow } from "@/lib/useNow";
import { Button, HStack, Stat, Table, Text, VStack } from "@chakra-ui/react";
import { LuClipboardCopy } from "react-icons/lu";
import RallyCountdown from "./RallyCountdown";
import {
    getClipboardText,
    getGroupedStarters,
    getStarterArrivalTime,
    sortByStartTime,
    type RallyTimerResult,
} from "./rallyTime";

const RallyTimeResult = ({ result }: { result: RallyTimerResult }) => {
    const now = useNow();
    const activeStarters = sortByStartTime(result.rallyStarters.filter((s) => s.active));

    const onCopyToClipboard = () => {
        navigator.clipboard.writeText(getClipboardText(result));
    };

    return (
        <VStack gap={8} alignItems="flex-start">
            <Stat.Root>
                <Stat.Label>Hit Time</Stat.Label>
                <Stat.ValueText>{formatUtcTime(result.hitTime.datetime)}</Stat.ValueText>
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
                        {getGroupedStarters(activeStarters, true).map((group) => [
                            <Table.Row key={`${group.title}-header`}>
                                <Table.Cell colSpan={4}>
                                    <Text fontWeight="bold" color="blue.500">
                                        {group.title}
                                    </Text>
                                </Table.Cell>
                            </Table.Row>,
                            ...group.starters.map((starter) => (
                                <Table.Row key={starter.id}>
                                    <Table.Cell>
                                        <Text fontWeight="bold">
                                            {formatUtcTime(starter.rallyStartTime)}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text opacity={0.5}>
                                            {formatUtcTime(getStarterArrivalTime(starter))}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontWeight="bold">{starter.name}</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                        <RallyCountdown
                                            targetTime={starter.rallyStartTime}
                                            now={now}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )),
                        ])}
                    </Table.Body>
                </Table.Root>

                <Button
                    type="button"
                    tabIndex={-1}
                    onClick={onCopyToClipboard}
                    colorPalette={"blue"}
                    variant="outline"
                    size="md"
                    disabled={activeStarters.length < 1}
                >
                    <LuClipboardCopy /> Copy
                </Button>
            </HStack>
        </VStack>
    );
};

export default RallyTimeResult;
