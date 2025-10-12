/** @format */

import { Button, HStack, Stat, Table, Text, VStack } from "@chakra-ui/react";
import { LuClipboardCopy } from "react-icons/lu";
import ReallyCountdown from "./ReallyCountdown";

export type RallyStarterResult = {
    name: string;
    marchTimeSec: number;
    rallyStartTime: Date;
    active: boolean;
};

export type RallyTimerResult = {
    hitTime: {
        datetime: Date;
        hour: number;
        minute: number;
        second: number;
    };
    rallyStarters: RallyStarterResult[];
};

const RallyTimeResult = ({ result }: { result: RallyTimerResult }) => {
    const onCopyToClipboard = () => {
        const rallyHitText = `${result.hitTime.datetime.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })} UTC - Rally Hit`;

        const starterText = result.rallyStarters
            .filter((starter) => starter.active)
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

    return (
        <VStack gap={8} alignItems="flex-start">
            <Stat.Root>
                <Stat.Label>Hit Time</Stat.Label>
                <Stat.ValueText>
                    {result.hitTime.datetime.toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    })}
                </Stat.ValueText>
            </Stat.Root>

            <HStack gap={8} alignItems="flex-start">
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Rally Time</Table.ColumnHeader>
                            <Table.ColumnHeader>Rally Leader</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">Start In</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {result.rallyStarters.map((starter, index) => {
                            if (!starter.active) {
                                return null;
                            }

                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>
                                        <Text fontWeight="bold">
                                            {starter.rallyStartTime.toLocaleTimeString(undefined, {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: false,
                                            })}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text fontWeight="bold">{starter.name}</Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                        <ReallyCountdown targetTime={starter.rallyStartTime} />
                                    </Table.Cell>
                                </Table.Row>
                            );
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
