/** @format */

import { HStack, Image, Separator, Text } from "@chakra-ui/react";
import type { TroopCalculatorResult } from "./TroopsForm";

function getResultTimeText(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${days}d ${hrs}h ${mins}m ${secs}s`;
}

const TroopsResults = ({ result }: { result: TroopCalculatorResult }) => {
    if (!result.showResult) {
        return null;
    }

    return (
        <>
            {result.calculationType === "amount-of-troops" && (
                <HStack gap={2} justifyContent="space-between" width="100%">
                    <Text>Troops:</Text>{" "}
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.quantity)}
                    </Text>
                </HStack>
            )}

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Time:</Text>{" "}
                <Text fontSize="lg" fontWeight="bold">
                    {getResultTimeText(result.time)}
                </Text>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Bread:</Text>
                <HStack>
                    <Image src="/img/resources/kingshot-bread.png" alt="Bread" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.bread)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Wood:</Text>
                <HStack>
                    <Image src="/img/resources/kingshot-wood.png" alt="Wood" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.wood)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Stone:</Text>
                <HStack justifyContent="center">
                    <Image src="/img/resources/kingshot-stone.png" alt="Stone" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.stone)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Iron:</Text>
                <HStack justifyContent="center">
                    <Image src="/img/resources/kingshot-iron.png" alt="Iron" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.iron)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Power:</Text>
                <HStack justifyContent="center">
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.power)}
                    </Text>
                </HStack>
            </HStack>

            <Separator size="lg" width="100%" />

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>KvK Points:</Text>
                <HStack justifyContent="center">
                    <Image
                        src="/img/events/kingshot-kingdom-of-power-event-icon.png"
                        alt="KvK"
                        height={6}
                    />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.kvkPoints)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Strongest Gov. Points:</Text>
                <HStack justifyContent="center">
                    <Image
                        src="/img/events/kingshot-strongest-governor-event-icon.png"
                        alt="KvK"
                        height={6}
                    />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat("de-DE", {
                            style: "decimal",
                        }).format(result.strongestGovernorPoints)}
                    </Text>
                </HStack>
            </HStack>
        </>
    );
};

export default TroopsResults;
