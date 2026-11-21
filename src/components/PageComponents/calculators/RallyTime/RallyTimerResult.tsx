/** @format */

import { formatUtcTime } from "@/lib/time";
import { useNow } from "@/lib/useNow";
import { Box, Button, HStack, Stat, Table, Text, VStack } from "@chakra-ui/react";
import { LuClipboardCopy } from "react-icons/lu";
import RallyCountdown from "./RallyCountdown";
import {
    getClipboardText,
    getGroupedStarters,
    getStarterArrivalTime,
    sortByStartTime,
    truncateName,
    type RallyTimerResult,
} from "./rallyTime";

const RallyTimeResult = ({ result }: { result: RallyTimerResult }) => {
    const now = useNow();
    const activeStarters = sortByStartTime(result.rallyStarters.filter((s) => s.active));

    const onCopyToClipboard = () => {
        navigator.clipboard.writeText(getClipboardText(result));
    };

    return (
        <VStack gap={8} alignItems="flex-start" width="100%" minWidth={0}>
            <HStack gap={4} alignItems="center">
                <Stat.Root>
                    <Stat.Label>Hit Time</Stat.Label>
                    <Stat.ValueText>{formatUtcTime(result.hitTime.datetime)}</Stat.ValueText>
                </Stat.Root>
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

            {/* Safety net: very long names scroll inside the table, not the page. */}
            <Box maxWidth="100%" overflowX="auto">
                <Table.Root
                    size="sm"
                    css={{ "& th, & td": { paddingInline: { base: "6px", md: "8px" } } }}
                >
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Start</Table.ColumnHeader>
                            {/* Phones: hit time moves under the start time. */}
                            <Table.ColumnHeader hideBelow="sm">Hit</Table.ColumnHeader>
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
                                        <Text hideFrom="sm" fontSize="xs" opacity={0.5}>
                                            hit {formatUtcTime(getStarterArrivalTime(starter))}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell hideBelow="sm">
                                        <Text opacity={0.5}>
                                            {formatUtcTime(getStarterArrivalTime(starter))}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text
                                            fontWeight="bold"
                                            wordBreak="break-word"
                                            title={starter.name}
                                        >
                                            {truncateName(starter.name)}
                                        </Text>
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
            </Box>
        </VStack>
    );
};

export default RallyTimeResult;
