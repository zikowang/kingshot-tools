/** @format */

import { getResultTimeText } from "@/lib/utils";
import type { TruegoldCalculatorResult } from "@/types/result";
import {
    Button,
    CloseButton,
    Drawer,
    Grid,
    HStack,
    Image,
    Portal,
    Separator,
    Text,
} from "@chakra-ui/react";
import React from "react";

const TruegoldResults = ({ result }: { result: TruegoldCalculatorResult }) => {
    if (!result.showResult) {
        return null;
    }

    return (
        <>
            {/* Summary result */}
            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Time:</Text>{" "}
                <Text fontSize="lg" fontWeight="bold">
                    {getResultTimeText(result.time)}
                </Text>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Bread:</Text>
                <HStack>
                    <Image src="/img/100x100/resources/kingshot-bread.png" alt="Bread" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat(undefined, {
                            notation: "compact",
                            minimumFractionDigits: 2,
                            style: "decimal",
                        }).format(result.bread)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Wood:</Text>
                <HStack>
                    <Image src="/img/100x100/resources/kingshot-wood.png" alt="Wood" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat(undefined, {
                            notation: "compact",
                            minimumFractionDigits: 2,
                            style: "decimal",
                        }).format(result.wood)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Stone:</Text>
                <HStack justifyContent="center">
                    <Image src="/img/100x100/resources/kingshot-stone.png" alt="Stone" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat(undefined, {
                            notation: "compact",
                            minimumFractionDigits: 2,
                            style: "decimal",
                        }).format(result.stone)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Iron:</Text>
                <HStack justifyContent="center">
                    <Image src="/img/100x100/resources/kingshot-iron.png" alt="Iron" height={6} />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat(undefined, {
                            notation: "compact",
                            minimumFractionDigits: 2,
                            style: "decimal",
                        }).format(result.iron)}
                    </Text>
                </HStack>
            </HStack>

            <HStack gap={2} justifyContent="space-between" width="100%">
                <Text>Truegold:</Text>
                <HStack justifyContent="center">
                    <Image
                        src="/img/100x100/resources/kingshot-truegold.png"
                        alt="Truegold"
                        height={6}
                    />
                    <Text fontSize="lg" fontWeight="bold">
                        {new Intl.NumberFormat(undefined, {
                            notation: "compact",
                            style: "decimal",
                        }).format(result.truegold)}
                    </Text>
                </HStack>
            </HStack>

            {/* Building list details */}
            <Drawer.Root size="md" placement={{ mdDown: "bottom", md: "end" }}>
                <Drawer.Trigger asChild>
                    <Button variant="outline" size="sm" ml="auto" colorPalette="blue" mt={4}>
                        Open Details
                    </Button>
                </Drawer.Trigger>
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner>
                        <Drawer.Content mx={{ mdDown: "auto", md: "unset" }}>
                            <Drawer.Header>
                                <Drawer.Title>Building Details</Drawer.Title>
                            </Drawer.Header>
                            <Drawer.Body>
                                <Grid gridTemplateColumns="2fr 1fr 2fr" gap={2}>
                                    {result.buildingList.map((building) => (
                                        <React.Fragment key={building.id}>
                                            <Text fontWeight="bold">{building.name}</Text>

                                            <HStack justifyContent="center" alignItems="center">
                                                <Image
                                                    src="/img/100x100/resources/kingshot-truegold.png"
                                                    alt="Truegold"
                                                    height={5}
                                                />
                                                <Text>
                                                    {new Intl.NumberFormat(undefined, {
                                                        notation: "compact",
                                                        style: "decimal",
                                                    }).format(building.cost.truegold)}
                                                </Text>
                                            </HStack>

                                            <Text ml="auto">
                                                {getResultTimeText(building.buildTime)}
                                            </Text>

                                            <HStack
                                                justifyContent="flex-end"
                                                gridColumnStart={1}
                                                gridColumnEnd={4}
                                            >
                                                <HStack
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                >
                                                    <Image
                                                        src="/img/100x100/resources/kingshot-bread.png"
                                                        alt="Bread"
                                                        height={5}
                                                    />
                                                    <Text>
                                                        {new Intl.NumberFormat(undefined, {
                                                            notation: "compact",
                                                            minimumFractionDigits: 2,
                                                            style: "decimal",
                                                        }).format(building.cost.bread)}
                                                    </Text>
                                                </HStack>
                                                <HStack
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                >
                                                    <Image
                                                        src="/img/100x100/resources/kingshot-wood.png"
                                                        alt="Wood"
                                                        height={5}
                                                    />
                                                    <Text>
                                                        {new Intl.NumberFormat(undefined, {
                                                            notation: "compact",
                                                            minimumFractionDigits: 2,
                                                            style: "decimal",
                                                        }).format(building.cost.wood)}
                                                    </Text>
                                                </HStack>
                                                <HStack
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                >
                                                    <Image
                                                        src="/img/100x100/resources/kingshot-stone.png"
                                                        alt="Stone"
                                                        height={5}
                                                    />
                                                    <Text>
                                                        {new Intl.NumberFormat(undefined, {
                                                            notation: "compact",
                                                            minimumFractionDigits: 2,
                                                            style: "decimal",
                                                        }).format(building.cost.stone)}
                                                    </Text>
                                                </HStack>
                                                <HStack
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                >
                                                    <Image
                                                        src="/img/100x100/resources/kingshot-iron.png"
                                                        alt="Iron"
                                                        height={5}
                                                    />
                                                    <Text>
                                                        {new Intl.NumberFormat(undefined, {
                                                            notation: "compact",
                                                            minimumFractionDigits: 2,
                                                            style: "decimal",
                                                        }).format(building.cost.iron)}
                                                    </Text>
                                                </HStack>
                                            </HStack>

                                            <Separator gridColumnStart={1} gridColumnEnd={4} />
                                        </React.Fragment>
                                    ))}
                                </Grid>
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
        </>
    );
};

export default TruegoldResults;
