/** @format */

import { Box, HoverCard, HStack, Image, Link, Portal, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const calculators = [
    {
        label: "Troops",
        href: "/calculators/troop",
    },
    {
        label: "Truegold",
        href: "/calculators/truegold",
    },
    {
        label: "Replenishment Time",
        href: "/calculators/replenishment-time",
    },
    {
        label: "Rally Time",
        href: "/calculators/rally-time",
    },
];

const Navigation = () => {
    const [open, setOpen] = useState(false);

    const pathname = window.location.pathname;

    return (
        <HStack justifyContent="space-between" mb={4}>
            <Link href="/" textDecoration="none">
                <VStack gap={0}>
                    <Image src="/img/kingshot-logo.webp" width={{ base: 100, md: 200 }} />
                    <HStack gap={0} alignItems="baseline">
                        <Text fontWeight="bold" color="orange">
                            FAN
                        </Text>
                        <Text>made</Text>
                    </HStack>
                </VStack>
            </Link>

            <HStack gap={4}>
                <Link
                    key={"Calendar"}
                    href={"/calendar"}
                    fontWeight="bold"
                    color={pathname.includes("/calendar") ? "orange" : "inherit"}
                    _hover={{ textDecoration: "none", color: "orange" }}
                >
                    {"Calendar"}
                </Link>

                <HoverCard.Root
                    open={open}
                    onOpenChange={(e) => setOpen(e.open)}
                    size="sm"
                    openDelay={0}
                    closeDelay={50}
                    positioning={{ placement: "bottom" }}
                >
                    <HoverCard.Trigger asChild>
                        <Link
                            href="#"
                            fontWeight="bold"
                            onTouchStart={() => setOpen(!open)}
                            color={pathname.includes("/calculators/") ? "orange" : "inherit"}
                            _hover={{ textDecoration: "none", color: "orange" }}
                            _focus={{ textDecoration: "none", outline: "none" }}
                        >
                            Calculator{" "}
                            <Box rotate={open ? "180deg" : "0deg"} transition={"0.2s"}>
                                <LuChevronDown />
                            </Box>
                        </Link>
                    </HoverCard.Trigger>

                    <Portal>
                        <HoverCard.Positioner marginTop={-2}>
                            <HoverCard.Content>
                                <VStack gap={4} alignItems="flex-start">
                                    {calculators.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            fontWeight="bold"
                                            color={
                                                pathname.includes(item.href) ? "orange" : "inherit"
                                            }
                                            _hover={{
                                                textDecoration: "none",
                                                color: "orange",
                                            }}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </VStack>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
            </HStack>
        </HStack>
    );
};

export default Navigation;
